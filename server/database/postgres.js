import pkg from 'pg';
const { Pool } = pkg;
import { postgresConfig } from '../config/database.js';

const pool = new Pool(postgresConfig);

pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on PostgreSQL client', err);
    process.exit(-1);
});

export const query = (text, params) => pool.query(text, params);

export const getClient = () => pool.connect();

export default pool;