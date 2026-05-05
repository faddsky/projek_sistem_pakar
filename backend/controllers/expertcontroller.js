const db = require('../config/db'); // Asumsi koneksi mysql2 kamu
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const diagnose = async (req, res) => {
    try {
        const { selectedSymptoms } = req.body; 
        // Format input: [{ kode_gejala: 'G03', cf_user: 0.8 }, { kode_gejala: 'G04', cf_user: 0.6 }]

        if (!selectedSymptoms || selectedSymptoms.length === 0) {
            return res.status(400).json({ message: "Pilih minimal satu gejala." });
        }

        // 1. Ambil semua aturan dari database
        const [rules] = await db.query("SELECT * FROM basis_pengetahuan");
        
        let hasilDiagnosa = [];

        // 2. Iterasi setiap Rule (R1, R2, dst)
        rules.forEach(rule => {
            const stringAturan = rule.aturan_if_then;
            
            // Ekstrak kode gejala yang ada di dalam string IF...THEN menggunakan Regex
            // Mencari pola G diikuti 2 angka, misal: G03, G10
            const gejalaDiRule = stringAturan.match(/G\d{2}/g); 
            const namaPenyakit = stringAturan.split('THEN ')[1].toLowerCase();

            // Cek kecocokan gejala user dengan gejala di Rule ini
            const matched = selectedSymptoms.filter(s => gejalaDiRule.includes(s.kode_gejala));

            if (matched.length > 0) {
                let cf_hasil = 0;

                if (stringAturan.includes(' AND ')) {
                    // Logika AND: Ambil MIN dari CF User
                    const minCfUser = Math.min(...matched.map(m => m.cf_user));
                    cf_hasil = minCfUser * rule.nilai_kepercayaan;
                } else {
                    // Logika OR: Ambil MAX dari CF User
                    const maxCfUser = Math.max(...matched.map(m => m.cf_user));
                    cf_hasil = maxCfUser * rule.nilai_kepercayaan;
                }

                hasilDiagnosa.push({
                    penyakit: namaPenyakit,
                    cf: cf_hasil
                });
            }
        });

        // 3. Gabungkan CF jika satu penyakit muncul di beberapa Rule (CF Combine)
        // Rumus: CF_c = CF1 + CF2 * (1 - CF1)
        const finalCalculated = hasilDiagnosa.reduce((acc, curr) => {
            const existing = acc.find(item => item.penyakit === curr.penyakit);
            if (existing) {
                existing.cf = existing.cf + curr.cf * (1 - existing.cf);
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);

        // Urutkan dari persentase tertinggi
        finalCalculated.sort((a, b) => b.cf - a.cf);
        const diagnosaUtama = finalCalculated[0];

        if (!diagnosaUtama) {
            return res.json({ message: "Gejala tidak mencukupi untuk diagnosa." });
        }

        // 4. Panggil Gemini API untuk penjelasan penyakit & penanganan
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Saya adalah sistem pakar kesehatan. Pasien terdiagnosa ${diagnosaUtama.penyakit} 
                        dengan tingkat keyakinan ${(diagnosaUtama.cf * 100).toFixed(2)}%. 
                        Tolong berikan penjelasan singkat tentang penyakit ini dan langkah penanganan medis darurat di rumah dalam bahasa Indonesia yang mudah dimengerti.`;

        const result = await model.generateContent(prompt);
        const aiAdvice = result.response.text();

        // 5. Kirim respon ke Frontend
        res.json({
            penyakit: diagnosaUtama.penyakit.toUpperCase(),
            keyakinan: (diagnosaUtama.cf * 100).toFixed(2) + "%",
            edukasi_gemini: aiAdvice,
            all_results: finalCalculated // Untuk grafik atau list tambahan
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { diagnose };