import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { query } from '../database/postgres.js';
import { ActivityLog, RecipeReview } from '../database/mongodb.js';

const router = express.Router();

router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const profileResult = await query(
      'SELECT skill_level, favorite_cuisine, dietary_restrictions FROM user_profiles WHERE user_id = $1',
      [req.user.userId]
    );
    if (profileResult.rows.length === 0) {
      const defaultRecipes = await query(
        'SELECT * FROM recipes WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 3',
        ['easy']
      );
      return res.json({ recommendations: defaultRecipes.rows });
    }
    const profile = profileResult.rows[0];
    let queryText = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (profile.skill_level === 'Beginner') {
      queryText += ` AND difficulty = $${paramCount}`;
      params.push('easy');
      paramCount++;
    } else if (profile.skill_level === 'Intermediate') {
      queryText += ` AND difficulty IN ($${paramCount}, $${paramCount + 1})`;
      params.push('easy', 'medium');
      paramCount += 2;
    }

    if (profile.favorite_cuisine && profile.favorite_cuisine !== 'Other') {
      queryText += ` AND cuisine_type = $${paramCount}`;
      params.push(profile.favorite_cuisine);
      paramCount++;
    }

    queryText += ` AND id NOT IN (
      SELECT recipe_id FROM user_recipe_progress 
      WHERE user_id = $${paramCount} AND status = 'completed'
    )`;
    params.push(req.user.userId);

    queryText += ' ORDER BY RANDOM() LIMIT 3';

    const recommendations = await query(queryText, params);

    if (recommendations.rows.length === 0) {
      const fallback = await query(
        'SELECT * FROM recipes WHERE difficulty = $1 ORDER BY RANDOM() LIMIT 3',
        ['easy']
      );
      return res.json({ recommendations: fallback.rows });
    }

    res.json({ recommendations: recommendations.rows });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Server error' });
  }
  
});

router.post('/ai-recommendations', authenticateToken, async (req, res) => {
  try {
    const { conversationData } = req.body;
    
    const profileResult = await query(
      'SELECT skill_level, favorite_cuisine, dietary_restrictions FROM user_profiles WHERE user_id = $1',
      [req.user.userId]
    );
    const profile = profileResult.rows[0] || {};

    const normalizationResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Extract structured data from these user responses. If they say "anything", "no preference", "I'm flexible", etc., return null for that field.

User responses:
- Mood/Cuisine: "${conversationData.moodPreference}"
- Time Available: "${conversationData.timeAvailable}"
- Skill Comfort: "${conversationData.skillComfort}"
- Dietary Needs: "${conversationData.dietaryNeeds}"

Map to these EXACT values or null:
cuisineType: "Italian" | "Asian" | "Mexican" | "Mediterranean" | null (null if no specific cuisine mentioned)
timeCategory: "under_30" | "30_to_60" | "over_60" | null
difficultyLevel: "easy" | "medium" | "hard" | null
dietaryType: "vegetarian" | "vegan" | "gluten_free" | "dairy_free" | "none" | null

IMPORTANT: Only set cuisineType if user explicitly mentions a cuisine. General moods like "comfort food" or "healthy" should be null.

Return ONLY JSON (no markdown):
{
  "cuisineType": "value or null",
  "timeCategory": "value or null",
  "difficultyLevel": "value or null", 
  "dietaryType": "value or null",
  "hasFlexibility": true/false
}`
            }]
          }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 1500 }
        })
      }
    );

    const normResult = await normalizationResponse.json();
    let normText = normResult.candidates[0].content.parts[0].text;
    normText = normText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const normalized = JSON.parse(normText);

    console.log('NORMALIZED DATA:', JSON.stringify(normalized, null, 2));

    const isVeryFlexible = normalized.hasFlexibility || 
      (!normalized.timeCategory && !normalized.difficultyLevel && !normalized.dietaryType && !normalized.cuisineType);
    
    const recipeLimit = isVeryFlexible ? 50 : 20;

    let queryText = `
      SELECT id, name, cuisine_type, difficulty, (prep_time + cook_time) as total_time, description
      FROM recipes 
      WHERE id NOT IN (
        SELECT recipe_id FROM user_recipe_progress 
        WHERE user_id = $1 AND status = 'completed'
      )
    `;
    const params = [req.user.userId];
    let paramCount = 2;

    if (normalized.cuisineType) {
      queryText += ` AND cuisine_type = $${paramCount}`;
      params.push(normalized.cuisineType);
      paramCount++;
    }

    if (normalized.timeCategory) {
      const timeMap = {
        'under_30': 35,
        '30_to_60': 65,
        'over_60': 999
      };
      const maxTime = timeMap[normalized.timeCategory];
      if (maxTime < 999) {
        queryText += ` AND (prep_time + cook_time) <= $${paramCount}`;
        params.push(maxTime);
        paramCount++;
      }
    }

    if (normalized.difficultyLevel) {
      const difficultyMap = {
        'easy': ['easy'],
        'medium': ['easy', 'medium'],
        'hard': ['easy', 'medium', 'hard']
      };
      const difficulties = difficultyMap[normalized.difficultyLevel];
      queryText += ` AND difficulty = ANY($${paramCount}::text[])`;
      params.push(difficulties);
      paramCount++;
    }

    if (normalized.dietaryType && normalized.dietaryType !== 'none') {
      if (normalized.dietaryType === 'vegetarian' || normalized.dietaryType === 'vegan') {
        queryText += ` AND (
          description ILIKE '%vegetarian%' OR 
          description ILIKE '%vegan%' OR
          cuisine_type IN ('Mediterranean', 'Asian') OR
          (
            name NOT ILIKE '%chicken%' AND 
            name NOT ILIKE '%beef%' AND 
            name NOT ILIKE '%pork%' AND 
            name NOT ILIKE '%fish%' AND
            name NOT ILIKE '%salmon%' AND
            name NOT ILIKE '%meat%' AND
            description NOT ILIKE '%chicken%' AND
            description NOT ILIKE '%beef%' AND
            description NOT ILIKE '%pork%' AND
            description NOT ILIKE '%fish%' AND
            description NOT ILIKE '%salmon%' AND
            description NOT ILIKE '%meat%'
          )
        )`;
      } else if (normalized.dietaryType === 'gluten_free') {
        queryText += ` AND (
          name NOT ILIKE '%pasta%' AND 
          name NOT ILIKE '%noodle%' AND
          name NOT ILIKE '%bread%' AND
          name NOT ILIKE '%pizza%' AND
          description NOT ILIKE '%flour%'
        )`;
      } else if (normalized.dietaryType === 'dairy_free') {
        queryText += ` AND (
          name NOT ILIKE '%cheese%' AND 
          name NOT ILIKE '%cream%' AND
          description NOT ILIKE '%milk%' AND
          description NOT ILIKE '%butter%'
        )`;
      }
    }

    if (isVeryFlexible) {
      queryText += ` ORDER BY difficulty, cuisine_type, RANDOM() LIMIT $${paramCount}`;
    } else {
      queryText += ` ORDER BY RANDOM() LIMIT $${paramCount}`;
    }
    params.push(recipeLimit);

    console.log('QUERY FILTERS:', {
      cuisineType: normalized.cuisineType,
      timeCategory: normalized.timeCategory,
      difficultyLevel: normalized.difficultyLevel,
      dietaryType: normalized.dietaryType,
      isVeryFlexible: isVeryFlexible,
      recipeLimit: recipeLimit
    });

    const preFilteredRecipes = await query(queryText, params);

    console.log('PRE-FILTERED RECIPES:', preFilteredRecipes.rows.map(r => ({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine_type,
      difficulty: r.difficulty,
      time: r.total_time,
      description: r.description.substring(0, 100)
    })));

    console.log(`Pre-filtered ${preFilteredRecipes.rows.length} recipes (flexible: ${isVeryFlexible})`);

    if (preFilteredRecipes.rows.length === 0) {
      console.log('NO RECIPES FOUND - Trying relaxed filters');
      
      let relaxedQuery = `
        SELECT id, name, cuisine_type, difficulty, (prep_time + cook_time) as total_time, description
        FROM recipes 
        WHERE id NOT IN (
          SELECT recipe_id FROM user_recipe_progress 
          WHERE user_id = $1 AND status = 'completed'
        )
      `;
      const relaxedParams = [req.user.userId];
      let relaxedParamCount = 2;

      if (normalized.cuisineType) {
        relaxedQuery += ` AND cuisine_type = $${relaxedParamCount}`;
        relaxedParams.push(normalized.cuisineType);
        relaxedParamCount++;
      }

      relaxedQuery += ` ORDER BY RANDOM() LIMIT $${relaxedParamCount}`;
      relaxedParams.push(5);

      const relaxedRecipes = await query(relaxedQuery, relaxedParams);

      if (relaxedRecipes.rows.length === 0) {
        const fallback = await query(
          `SELECT * FROM recipes 
           WHERE id NOT IN (
             SELECT recipe_id FROM user_recipe_progress 
             WHERE user_id = $1 AND status = 'completed'
           )
           ORDER BY RANDOM() LIMIT 3`,
          [req.user.userId]
        );
        return res.json({
          profile: normalized.cuisineType 
            ? `I couldn't find ${normalized.cuisineType} recipes matching all your criteria, but here are some great alternatives you might enjoy.`
            : 'Here are some recipes that match your preferences.',
          recommendations: fallback.rows
        });
      }

      const relaxedList = relaxedRecipes.rows
        .map(r => `${r.id}|${r.name}|${r.cuisine_type}|${r.difficulty}|${r.total_time}m`)
        .join('\n');

      const relaxedGemini = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Choose the 3 best recipes from this list.

CURRENT CONVERSATION (PRIORITIZE THIS):
- Mood/Cuisine: "${conversationData.moodPreference}"
- Time Response: "${conversationData.timeAvailable}"
- Skill Response: "${conversationData.skillComfort}"
- Dietary Response: "${conversationData.dietaryNeeds}"

AVAILABLE RECIPES (format: ID|Name|Cuisine|Difficulty|Time):
${relaxedList}

Return ONLY JSON:
{"profile": "A 2-3 sentence note explaining these may take longer than requested but match their cuisine preference", "recipeIds": [id1, id2, id3]}`
              }]
            }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 3000 }
          })
        }
      );

      const relaxedAiResult = await relaxedGemini.json();
      let relaxedAiText = relaxedAiResult.candidates[0].content.parts[0].text;
      relaxedAiText = relaxedAiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const relaxedAiData = JSON.parse(relaxedAiText);

      const recommendations = await query(
        `SELECT * FROM recipes WHERE id = ANY($1::int[])`,
        [relaxedAiData.recipeIds]
      );

      return res.json({
        profile: relaxedAiData.profile,
        recommendations: recommendations.rows.slice(0, 3)
      });
    }

    const recipeList = preFilteredRecipes.rows
      .map(r => `${r.id}|${r.name}|${r.cuisine_type}|${r.difficulty}|${r.total_time}m`)
      .join('\n');

    console.log('Recipe list for AI:\n', recipeList);

    const finalPrompt = isVeryFlexible 
      ? `From these ${preFilteredRecipes.rows.length} diverse recipes, pick 3 that offer VARIETY across different cuisines and cooking styles. The user is open to anything!`
      : `From these ${preFilteredRecipes.rows.length} recipes, pick the 3 that BEST match the user's specific current needs.`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${finalPrompt}

CRITICAL: CURRENT CONVERSATION OVERRIDES PROFILE
The user's CURRENT responses take ABSOLUTE PRIORITY over their profile preferences.

CURRENT CONVERSATION (PRIORITIZE THIS):
- Mood/Cuisine: "${conversationData.moodPreference}" ${normalized.cuisineType ? `← User wants ${normalized.cuisineType} food` : ''}
- Time Response: "${conversationData.timeAvailable}"
- Skill Response: "${conversationData.skillComfort}"
- Dietary Response: "${conversationData.dietaryNeeds}"

USER PROFILE (context only):
- Skill Level: ${profile.skill_level || 'Beginner'}
- Favorite Cuisine: ${profile.favorite_cuisine || 'Not specified'}
- Dietary Restrictions: ${profile.dietary_restrictions?.join(', ') || 'None'}

AVAILABLE RECIPES (format: ID|Name|Cuisine|Difficulty|Time):
${recipeList}

${isVeryFlexible 
  ? 'Choose 3 diverse recipes from different cuisines/styles to give them variety.' 
  : normalized.cuisineType 
    ? `Choose 3 ${normalized.cuisineType} recipes that match their time and skill requirements.`
    : 'Choose 3 recipes that match their mood and requirements closely.'}

Return ONLY JSON:
{"profile": "A 2-3 sentence personalized summary", "recipeIds": [id1, id2, id3]}`
            }]
          }],
          generationConfig: { 
            temperature: isVeryFlexible ? 0.9 : 0.7,
            maxOutputTokens: 3000
          }
        })
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error('Gemini API request failed');
    }

    const aiResult = await geminiResponse.json();
    console.log('Gemini response:', aiResult);

    let aiText = aiResult.candidates[0].content.parts[0].text;
    aiText = aiText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const aiData = JSON.parse(aiText);

    console.log('Parsed AI data:', aiData);
    console.log('AI SELECTED IDs:', aiData.recipeIds);
    console.log('AI REASONING:', aiData.profile);

    const recommendations = await query(
      `SELECT * FROM recipes WHERE id = ANY($1::int[])`,
      [aiData.recipeIds]
    );

    console.log('FINAL RECOMMENDATIONS:', recommendations.rows.map(r => ({
      id: r.id,
      name: r.name,
      cuisine: r.cuisine_type,
      difficulty: r.difficulty,
      description: r.description.substring(0, 100)
    })));

    if (recommendations.rows.length < 3) {
      const usedIds = recommendations.rows.map(r => r.id);
      const additional = preFilteredRecipes.rows
        .filter(r => !usedIds.includes(r.id))
        .slice(0, 3 - recommendations.rows.length);
      
      if (additional.length > 0) {
        const additionalDetails = await query(
          `SELECT * FROM recipes WHERE id = ANY($1::int[])`,
          [additional.map(r => r.id)]
        );
        recommendations.rows.push(...additionalDetails.rows);
      }
    }

    res.json({
      profile: aiData.profile,
      recommendations: recommendations.rows.slice(0, 3)
    });

  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    
    const fallbackResult = await query(
      `SELECT * FROM recipes 
       WHERE difficulty = 'easy' 
       AND id NOT IN (
         SELECT recipe_id FROM user_recipe_progress 
         WHERE user_id = $1 AND status = 'completed'
       )
       ORDER BY RANDOM() LIMIT 3`,
      [req.user.userId]
    );

    res.json({
      profile: 'Based on your preferences, here are some approachable recipes to try.',
      recommendations: fallbackResult.rows
    });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { difficulty, cuisine, search } = req.query;
    
    let queryText = 'SELECT * FROM recipes WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (difficulty) {
      queryText += ` AND difficulty = $${paramCount}`;
      params.push(difficulty);
      paramCount++;
    }

    if (cuisine) {
      queryText += ` AND cuisine_type = $${paramCount}`;
      params.push(cuisine);
      paramCount++;
    }

    if (search) {
      queryText += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    queryText += ' ORDER BY created_at DESC LIMIT 50';

    const result = await query(queryText, params);

    if (search) {
      await ActivityLog.create({
        userId: req.user.userId,
        activityType: 'search',
        metadata: { query: search, resultsCount: result.rows.length }
      });
    }

    res.json({ recipes: result.rows });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const recipeId = req.params.id;

    const recipeResult = await query('SELECT * FROM recipes WHERE id = $1', [recipeId]);
    
    if (recipeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = recipeResult.rows[0];

    const ingredientsResult = await query(
      'SELECT * FROM recipe_ingredients WHERE recipe_id = $1 ORDER BY id',
      [recipeId]
    );

    const stepsResult = await query(
      'SELECT * FROM recipe_steps WHERE recipe_id = $1 ORDER BY step_order',
      [recipeId]
    );

    const progressResult = await query(
      'SELECT * FROM user_recipe_progress WHERE user_id = $1 AND recipe_id = $2',
      [req.user.userId, recipeId]
    );

    const reviews = await RecipeReview.find({ recipeId: parseInt(recipeId) })
      .sort({ createdAt: -1 })
      .limit(10);

    await ActivityLog.create({
      userId: req.user.userId,
      activityType: 'recipe_viewed',
      recipeId: parseInt(recipeId),
      metadata: { recipeName: recipe.name }
    });

    res.json({
      recipe,
      ingredients: ingredientsResult.rows,
      steps: stepsResult.rows,
      progress: progressResult.rows[0] || null,
      reviews
    });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/start', authenticateToken, async (req, res) => {
  try {
    const recipeId = req.params.id;

    const existingProgress = await query(
      'SELECT id FROM user_recipe_progress WHERE user_id = $1 AND recipe_id = $2',
      [req.user.userId, recipeId]
    );

    if (existingProgress.rows.length > 0) {
      await query(
        'UPDATE user_recipe_progress SET status = $1, started_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND recipe_id = $3',
        ['in_progress', req.user.userId, recipeId]
      );
    } else {
      await query(
        'INSERT INTO user_recipe_progress (user_id, recipe_id, status, started_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
        [req.user.userId, recipeId, 'in_progress']
      );
    }

    await ActivityLog.create({
      userId: req.user.userId,
      activityType: 'recipe_started',
      recipeId: parseInt(recipeId)
    });

    res.json({ message: 'Cooking started successfully' });
  } catch (error) {
    console.error('Error starting recipe:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { rating, notes } = req.body;

    const checkResult = await query(
      'SELECT status FROM user_recipe_progress WHERE user_id = $1 AND recipe_id = $2',
      [req.user.userId, recipeId]
    );

    const alreadyCompleted = checkResult.rows.length > 0 && checkResult.rows[0].status === 'completed';

    await query(
      'UPDATE user_recipe_progress SET status = $1, completed_at = CURRENT_TIMESTAMP, rating = $2, notes = $3 WHERE user_id = $4 AND recipe_id = $5',
      ['completed', rating, notes, req.user.userId, recipeId]
    );

    if (!alreadyCompleted) {
      await query(
        'UPDATE user_profiles SET total_recipes_completed = total_recipes_completed + 1, xp_points = xp_points + 100 WHERE user_id = $1',
        [req.user.userId]
      );
    }

    await ActivityLog.create({
      userId: req.user.userId,
      activityType: 'recipe_completed',
      recipeId: parseInt(recipeId),
      metadata: { rating }
    });

    res.json({ message: 'Recipe completed!', xpEarned: alreadyCompleted ? 0 : 100 });
  } catch (error) {
    console.error('Error completing recipe:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const recipeId = req.params.id;

    const existing = await query(
      'SELECT id FROM user_recipe_progress WHERE user_id = $1 AND recipe_id = $2',
      [req.user.userId, recipeId]
    );

    if (existing.rows.length > 0) {
      return res.json({ message: 'Recipe already saved', saved: true });
    }

    await query(
      'INSERT INTO user_recipe_progress (user_id, recipe_id, status) VALUES ($1, $2, $3)',
      [req.user.userId, recipeId, 'saved']
    );

    res.json({ message: 'Recipe saved successfully', saved: true });
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/saved/list', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      `SELECT r.*, urp.status, urp.rating 
       FROM recipes r 
       INNER JOIN user_recipe_progress urp ON r.id = urp.recipe_id 
       WHERE urp.user_id = $1 AND urp.status IN ('saved', 'in_progress', 'completed')
       ORDER BY urp.started_at DESC, urp.id DESC`,
      [req.user.userId]
    );

    res.json({ recipes: result.rows });
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/:id/review', authenticateToken, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const { rating, comment } = req.body;

    const progressCheck = await query(
      'SELECT id FROM user_recipe_progress WHERE user_id = $1 AND recipe_id = $2 AND status = $3',
      [req.user.userId, recipeId, 'completed']
    );

    if (progressCheck.rows.length === 0) {
      return res.status(400).json({ error: 'You must complete the recipe before reviewing' });
    }

    const review = await RecipeReview.create({
      userId: req.user.userId,
      recipeId: parseInt(recipeId),
      rating,
      comment,
      createdAt: new Date()
    });

    res.json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/progress/stats', authenticateToken, async (req, res) => {
  try {
    const statsResult = await query(
      `SELECT 
        COUNT(*) FILTER (WHERE status = 'completed') as completed_count,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_count,
        COUNT(*) FILTER (WHERE status = 'saved') as saved_count,
        AVG(rating) FILTER (WHERE rating IS NOT NULL) as avg_rating
       FROM user_recipe_progress 
       WHERE user_id = $1`,
      [req.user.userId]
    );

    const recentActivities = await ActivityLog.find({ userId: req.user.userId })
      .sort({ timestamp: -1 })
      .limit(20);

    const difficultyStats = await query(
      `SELECT r.difficulty, COUNT(*) as count 
       FROM user_recipe_progress urp 
       INNER JOIN recipes r ON urp.recipe_id = r.id 
       WHERE urp.user_id = $1 AND urp.status = 'completed' 
       GROUP BY r.difficulty`,
      [req.user.userId]
    );

    const profileResult = await query(
      'SELECT total_recipes_completed, xp_points, current_streak FROM user_profiles WHERE user_id = $1',
      [req.user.userId]
    );

    res.json({
      stats: statsResult.rows[0],
      recentActivities,
      difficultyProgress: difficultyStats.rows,
      profile: profileResult.rows[0]
    });
  } catch (error) {
    console.error('Error fetching progress stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;