const express = require('express');
const router = express.Router();
const { diagnose } = require('../controllers/expertcontroller');

// Endpoint untuk mendapatkan daftar gejala (tampilan di React)
router.get('/gejala', async (req, res) => {
    const db = req.app.locals.db;
    try {
        const [rows] = await db.query("SELECT kode_gejala, nama_gejala, deskripsi FROM gejala");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Gagal mengambil data gejala: " + err.message });
    }
});

// Endpoint untuk proses diagnosa Certainty Factor + Gemini API
router.post('/diagnose', diagnose);

module.exports = router;