import dotenv from 'dotenv';

dotenv.config();

export const postgresConfig = {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'cooking_helper',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || ''
};

export const mongoConfig = {
    url: process.env.MONGODB_URL || 'mongodb://localhost:27017/cooking_helper',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};