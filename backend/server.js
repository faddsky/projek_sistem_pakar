require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db'); 
const expertRoutes = require('./routers/expertRoutes');

const app = express();

// WAJIB: Letakkan cors paling atas sebelum rute
app.use(cors()); 
app.use(express.json());

// Simpan pool ke locals agar bisa diakses controller
app.locals.db = pool;

// Tambahkan rute testing sederhana
app.get('/', (req, res) => res.send("Backend Diagnosa Jalan!"));

app.use('/api', expertRoutes);

// Gunakan port dari .env atau default 5000
const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});