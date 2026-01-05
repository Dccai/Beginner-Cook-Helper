import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import { connectMongoDB } from './database/mongodb.js';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

connectMongoDB();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

app.use('/api/auth', authRoutes)
app.use('/api/recipes', recipeRoutes)

app.get('/', (req, res) => {
    res.json({message: 'Cooking API Running'});
});

//I will add the actual API routes here

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


