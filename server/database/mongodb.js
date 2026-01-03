import mongoose from 'mongoose';
import { mongoConfig } from '../config/database.js';

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(mongoConfig.url, mongoConfig.options);
    console.log('Connected to MongoDB database');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: Number, 
    required: true,
    index: true
  },
  activityType: {
    type: String,
    enum: ['recipe_viewed', 'recipe_started', 'recipe_completed', 'profile_updated', 'login', 'search'],
    required: true
  },
  recipeId: Number, 
  metadata: {
    type: mongoose.Schema.Types.Mixed, 
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

const recipeReviewSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  recipeId: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  comment: String,
  images: [String], 
  helpfulCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

const sessionAnalyticsSchema = new mongoose.Schema({
  userId: Number,
  sessionId: String,
  startTime: Date,
  endTime: Date,
  pagesVisited: [String],
  recipesViewed: [Number],
  searchQueries: [String],
  deviceInfo: {
    browser: String,
    os: String,
    deviceType: String
  }
});

const aiInteractionSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  interactionType: {
    type: String,
    enum: ['skill_assessment', 'recipe_recommendation', 'cooking_help']
  },
  userInput: mongoose.Schema.Types.Mixed,
  aiResponse: mongoose.Schema.Types.Mixed,
  confidence: Number,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export const RecipeReview = mongoose.model('RecipeReview', recipeReviewSchema);
export const SessionAnalytics = mongoose.model('SessionAnalytics', sessionAnalyticsSchema);
export const AIInteraction = mongoose.model('AIInteraction', aiInteractionSchema);