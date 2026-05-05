require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const expertRoutes = require('./routes/expertRoutes'); // Import router

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function initDb() {
    try {
        const pool = mysql.createPool(dbConfig);
        app.locals.db = pool;
        console.log('✅ Database connected');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
}

// Gunakan Router dengan prefix '/api'
app.use('/api', expertRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    await initDb();
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});