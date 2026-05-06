const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inisialisasi tetap ada di luar, tapi tidak akan terpanggil di dalam fungsi
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const diagnose = async (req, res) => {
    try {
        const { selectedSymptoms } = req.body; 
        const db = req.app.locals.db;

        if (!selectedSymptoms || selectedSymptoms.length === 0) {
            return res.status(400).json({ message: "Pilih minimal satu gejala untuk memulai diagnosa." });
        }

        const [rules] = await db.query("SELECT * FROM basis_pengetahuan");
        
        let hasilDiagnosaRaw = [];

        rules.forEach(rule => {
            const stringAturan = rule.aturan_if_then;
            const gejalaDiRule = stringAturan.match(/G\d{2}/g) || []; 
            
            const parts = stringAturan.split(/\s+THEN\s+/i);
            if (parts.length < 2) return;
            const namaPenyakit = parts[1].trim().toLowerCase();

            const matched = selectedSymptoms.filter(s => {
                return gejalaDiRule.some(g => g.trim() === s.kode_gejala.trim());
            });

            if (matched.length > 0) {
                let cf_hasil = 0;
                const isAnd = stringAturan.toUpperCase().includes(' AND ');
                const isOr = stringAturan.toUpperCase().includes(' OR ');

                if (isAnd) {
                    const values = matched.map(m => parseFloat(m.cf_user));
                    cf_hasil = Math.min(...values) * rule.nilai_kepercayaan;
                } else if (isOr) {
                    const values = matched.map(m => parseFloat(m.cf_user));
                    cf_hasil = Math.max(...values) * rule.nilai_kepercayaan;
                } else {
                    cf_hasil = parseFloat(matched[0].cf_user) * rule.nilai_kepercayaan;
                }

                hasilDiagnosaRaw.push({
                    penyakit: namaPenyakit,
                    cf: cf_hasil
                });
            }
        });

        const finalCalculated = hasilDiagnosaRaw.reduce((acc, curr) => {
            const existing = acc.find(item => item.penyakit.toLowerCase() === curr.penyakit.toLowerCase());
            if (existing) {
                // Rumus CF Combine
                existing.cf = existing.cf + curr.cf * (1 - existing.cf);
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);

        finalCalculated.sort((a, b) => b.cf - a.cf);
        const diagnosaUtama = finalCalculated[0];

        if (!diagnosaUtama || diagnosaUtama.cf <= 0) {
            return res.json({ 
                status: "empty",
                message: "Gejala tidak mencukupi untuk diagnosa." 
            });
        }

        // --- INTEGRASI GEMINI DIMATIKAN SEMENTARA ---
        let aiAdvice = "Fitur saran AI sedang dinonaktifkan untuk pengujian sistem.";
        
        /* 
        // Bagian ini dikomentari agar tidak memakan kuota
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const prompt = `Singkat saja: Berikan 1 kalimat definisi penyakit ${diagnosaUtama.penyakit} 
                            dan list 5 poin penanganan rumah tanpa penjelasan panjang. 
                            Gunakan bahasa Indonesia yang santai.`;

            const result = await model.generateContent(prompt);
            aiAdvice = result.response.text().replace(/[*#]/g, '').trim();
        } catch (aiError) {
            console.error("AI Quota Error:", aiError.message);
            aiAdvice = "Saran penanganan AI sedang tidak tersedia.";
        }
        */
        // --------------------------------------------

        res.json({
            status: "success",
            diagnosa: {
                penyakit: diagnosaUtama.penyakit.toUpperCase(),
                keyakinan: (diagnosaUtama.cf * 100).toFixed(2) + "%",
                penjelasan_ai: aiAdvice 
            },
            detail_lain: finalCalculated.slice(1, 4).map(h => ({
                penyakit: h.penyakit.toUpperCase(),
                keyakinan: (h.cf * 100).toFixed(2) + "%"
            }))
        });

    } catch (error) {
        console.error("Error pada Expert Controller:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

module.exports = { diagnose };