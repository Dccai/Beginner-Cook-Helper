import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { query } from '../database/postgres.js';
import { ActivityLog, RecipeReview } from '../database/mongodb.js';

const router = express.Router();

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

    await query(
      'UPDATE user_recipe_progress SET status = $1, completed_at = CURRENT_TIMESTAMP, rating = $2, notes = $3 WHERE user_id = $4 AND recipe_id = $5',
      ['completed', rating, notes, req.user.userId, recipeId]
    );

    await query(
      'UPDATE user_profiles SET total_recipes_completed = total_recipes_completed + 1, xp_points = xp_points + 100 WHERE user_id = $1',
      [req.user.userId]
    );

    await ActivityLog.create({
      userId: req.user.userId,
      activityType: 'recipe_completed',
      recipeId: parseInt(recipeId),
      metadata: { rating }
    });

    res.json({ message: 'Recipe completed!', xpEarned: 100 });
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