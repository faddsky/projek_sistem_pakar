// backend/config/db.js
const mysql = require('mysql2/promise'); // Gunakan promise agar kompatibel dengan controller kita
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const pool = mysql.createPool(dbConfig);

console.log('✅ Database Connection Pool Created');

module.exports = pool;