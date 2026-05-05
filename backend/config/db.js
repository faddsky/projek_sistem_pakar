const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke Database phpMyAdmin
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('Database koneksi gagal: ' + err.stack);
    return;
  }
  console.log('Database terkoneksi sebagai id ' + db.threadId);
});

// Endpoint ambil gejala (G01 - G35)
app.get('/api/gejala', (req, res) => {
  db.query('SELECT * FROM gejala', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Endpoint ambil rules (R1 - R23)
app.get('/api/rules', (req, res) => {
  db.query('SELECT * FROM basis_pengetahuan', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running di http://localhost:${PORT}`));