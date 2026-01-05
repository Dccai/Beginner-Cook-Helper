import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { query } from '../database/postgres.js';

const router = express.Router();

router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, name } = req.body;

      // Make sure to check if user exists in database
      const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Make sure to insert user into database
      const result = await query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, hashedPassword, name]
      );
      const userId = result.rows[0].id;

      await query(
        'INSERT INTO user_profiles (user_id) VALUES ($1)',
        [userId]
      );
      
      const token = jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: userId, email, name }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  }
);

router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // Make sure to fetch user from database
      const result = await query(
        'SELECT id, email, password_hash, name FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];

      // Make sure to verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: user.name }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  }
);

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    // Make sure to fetch user profile from database
    const result = await query(
      'SELECT u.id, u.email, u.name, up.skill_level, up.cooking_frequency, up.favorite_cuisine, up.dietary_restrictions, up.total_recipes_completed, up.xp_points, up.current_streak FROM users u LEFT JOIN user_profiles up ON u.id = up.user_id WHERE u.id = $1',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, skill_level, cooking_frequency, favorite_cuisine, dietary_restrictions } = req.body;
    
    if (name) {
      await query(
        'UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [name, req.user.userId]
      );
    }

    const profileCheck = await query(
      'SELECT id FROM user_profiles WHERE user_id = $1',
      [req.user.userId]
    );

    if (profileCheck.rows.length > 0) {
      await query(
        `UPDATE user_profiles 
         SET skill_level = COALESCE($1, skill_level),
             cooking_frequency = COALESCE($2, cooking_frequency),
             favorite_cuisine = COALESCE($3, favorite_cuisine),
             dietary_restrictions = COALESCE($4, dietary_restrictions)
         WHERE user_id = $5`,
        [skill_level, cooking_frequency, favorite_cuisine, dietary_restrictions, req.user.userId]
      );
    } else {
      await query(
        `INSERT INTO user_profiles (user_id, skill_level, cooking_frequency, favorite_cuisine, dietary_restrictions)
         VALUES ($1, $2, $3, $4, $5)`,
        [req.user.userId, skill_level, cooking_frequency, favorite_cuisine, dietary_restrictions]
      );
    }

    const result = await query(
      `SELECT u.id, u.email, u.name, up.skill_level, up.cooking_frequency, 
              up.favorite_cuisine, up.dietary_restrictions, up.total_recipes_completed, 
              up.xp_points, up.current_streak 
       FROM users u 
       LEFT JOIN user_profiles up ON u.id = up.user_id 
       WHERE u.id = $1`,
      [req.user.userId]
    );

    res.json({ 
      message: 'Profile updated successfully',
      user: result.rows[0] 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

router.delete('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM users WHERE id = $1 RETURNING email',
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Account deleted successfully',
      email: result.rows[0].email
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error deleting account' });
  }
});



export default router;