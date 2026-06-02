const diagnose = async (req, res) => {
    try {
        const { selectedSymptoms } = req.body; 
        const db = req.app.locals.db;

        if (!selectedSymptoms || selectedSymptoms.length === 0) {
            return res.status(400).json({ message: "Pilih minimal satu gejala untuk memulai diagnosa." });
        }

        // Fetch all symptoms to map names to codes
        const [symptoms] = await db.query("SELECT kode_gejala, nama_gejala FROM gejala");
        
        // Normalize helper: lowercase and remove non-alphanumeric characters
        const normalizeString = (str) => {
            if (!str) return '';
            return str.toLowerCase().replace(/[^a-z0-9]/g, '');
        };

        const symptomMap = {};
        symptoms.forEach(s => {
            symptomMap[normalizeString(s.nama_gejala)] = s.kode_gejala;
        });

        // Ambil semua aturan dari database
        const [rules] = await db.query("SELECT * FROM basis_pengetahuan");
        
        let hasilDiagnosaRaw = [];

        rules.forEach(rule => {
            const stringAturan = rule.aturan_if_then;
            
            // Parse rule: IF <conditions> THEN <disease>
            const parts = stringAturan.split(/\s+THEN\s+/i);
            if (parts.length < 2) return;
            const conditionPart = parts[0].replace(/^\s*IF\s+/i, '').trim();
            const namaPenyakit = parts[1].trim();

            const isAnd = conditionPart.toUpperCase().includes(' AND ');
            const isOr = conditionPart.toUpperCase().includes(' OR ');

            let symptomPhrases = [];
            let opType = 'SINGLE';
            if (isAnd) {
                symptomPhrases = conditionPart.split(/\s+AND\s+/i);
                opType = 'AND';
            } else if (isOr) {
                symptomPhrases = conditionPart.split(/\s+OR\s+/i);
                opType = 'OR';
            } else {
                symptomPhrases = [conditionPart];
            }

            // Map each phrase to code and user CF
            const ruleSymptoms = [];
            symptomPhrases.forEach(phrase => {
                const normPhrase = normalizeString(phrase);
                let code = symptomMap[normPhrase];
                if (!code) {
                    const found = symptoms.find(s => {
                        const normName = normalizeString(s.nama_gejala);
                        return normName.includes(normPhrase) || normPhrase.includes(normName);
                    });
                    if (found) code = found.kode_gejala;
                }

                if (code) {
                    const userSelected = selectedSymptoms.find(s => s.kode_gejala.trim() === code.trim());
                    const cfUser = userSelected ? parseFloat(userSelected.cf_user) : 0.0;
                    const namaGejala = symptoms.find(s => s.kode_gejala === code)?.nama_gejala || phrase;
                    ruleSymptoms.push({ code, name: namaGejala, cfUser });
                }
            });

            if (ruleSymptoms.length > 0) {
                let cfGejala = 0;
                let calculationDetail = '';

                if (opType === 'AND') {
                    const cfs = ruleSymptoms.map(s => s.cfUser);
                    cfGejala = Math.min(...cfs);
                    calculationDetail = `CF_gejala = Min(${ruleSymptoms.map(s => `${s.name} (${s.cfUser})`).join(', ')}) = ${cfGejala}`;
                } else if (opType === 'OR') {
                    const cfs = ruleSymptoms.map(s => s.cfUser);
                    cfGejala = Math.max(...cfs);
                    calculationDetail = `CF_gejala = Max(${ruleSymptoms.map(s => `${s.name} (${s.cfUser})`).join(', ')}) = ${cfGejala}`;
                } else {
                    cfGejala = ruleSymptoms[0].cfUser;
                    calculationDetail = `CF_gejala = ${ruleSymptoms[0].name} (${cfGejala})`;
                }

                const cfHasil = cfGejala * rule.nilai_kepercayaan;
                const ruleCalculation = `CF_rule = CF_gejala (${cfGejala}) * CF_pakar (${rule.nilai_kepercayaan}) = ${cfHasil.toFixed(4)}`;

                // Only record if cfHasil > 0
                if (cfHasil > 0) {
                    hasilDiagnosaRaw.push({
                        penyakit: namaPenyakit,
                        ruleKode: rule.rule_kode || 'R',
                        cf: cfHasil,
                        cfGejala: cfGejala,
                        nilaiKepercayaan: rule.nilai_kepercayaan,
                        symptoms: ruleSymptoms,
                        opType,
                        calculationDetail,
                        ruleCalculation
                    });
                }
            }
        });

        // Group by disease and perform CF Combine
        const diseasesGrouped = {};
        hasilDiagnosaRaw.forEach(item => {
            const key = item.penyakit.toLowerCase();
            if (!diseasesGrouped[key]) {
                diseasesGrouped[key] = {
                    nama: item.penyakit,
                    rules: []
                };
            }
            diseasesGrouped[key].rules.push(item);
        });

        const finalCalculated = [];

        Object.keys(diseasesGrouped).forEach(key => {
            const group = diseasesGrouped[key];
            const rules = group.rules;

            let finalCf = 0;
            let logSteps = [];

            if (rules.length === 1) {
                finalCf = rules[0].cf;
                logSteps.push(`Hanya terdapat 1 aturan aktif: CF_akhir = ${finalCf.toFixed(4)}`);
            } else if (rules.length > 1) {
                // Combine CFs
                let currentCf = rules[0].cf;
                logSteps.push(`Inisialisasi CF_1 = ${currentCf.toFixed(4)} (dari Rule ${rules[0].ruleKode})`);
                
                for (let i = 1; i < rules.length; i++) {
                    const nextCf = rules[i].cf;
                    const prevCf = currentCf;
                    
                    // CF Combine formula: CF1 + CF2 * (1 - CF1)
                    currentCf = prevCf + nextCf * (1 - prevCf);
                    logSteps.push(`Combine ke-${i}: CF_combine(${prevCf.toFixed(4)}, ${nextCf.toFixed(4)}) = ${prevCf.toFixed(4)} + ${nextCf.toFixed(4)} * (1 - ${prevCf.toFixed(4)}) = ${currentCf.toFixed(4)} (dari Rule ${rules[i].ruleKode})`);
                }
                finalCf = currentCf;
                logSteps.push(`Hasil CF_akhir untuk ${group.nama} = ${finalCf.toFixed(4)} (${(finalCf * 100).toFixed(2)}%)`);
            }

            finalCalculated.push({
                penyakit: group.nama,
                cf: finalCf,
                rulesUsed: rules,
                combineLogs: logSteps
            });
        });

        finalCalculated.sort((a, b) => b.cf - a.cf);
        const diagnosaUtama = finalCalculated[0];

        if (!diagnosaUtama || diagnosaUtama.cf <= 0) {
            return res.json({ 
                status: "empty",
                message: "Gejala tidak mencukupi untuk diagnosa." 
            });
        }

        // --- AMBIL DATA DARI TABEL penyakit (deskripsi) ---
        let penjelasanPenyakit = "Penjelasan detail belum tersedia.";
        let saranPertolongan = "Segera hubungi tenaga medis untuk penanganan lebih lanjut.";
        
        try {
            const [penyakitInfo] = await db.query(
                `SELECT deskripsi FROM penyakit WHERE nama_penyakit = ? OR kode_penyakit = ?`, 
                [diagnosaUtama.penyakit, diagnosaUtama.penyakit]
            );

            if (penyakitInfo.length > 0 && penyakitInfo[0].deskripsi) {
                penjelasanPenyakit = penyakitInfo[0].deskripsi;
            }
        } catch (dbError) {
            console.error("Gagal query deskripsi penyakit:", dbError.message);
        }

        res.json({
            status: "success",
            diagnosa: {
                penyakit: diagnosaUtama.penyakit.toUpperCase(),
                keyakinan: (diagnosaUtama.cf * 100).toFixed(2) + "%",
                penjelasan: penjelasanPenyakit, 
                pertolongan: saranPertolongan   
            },
            detail_lain: finalCalculated.slice(1, 4).map(h => ({
                penyakit: h.penyakit.toUpperCase(),
                keyakinan: (h.cf * 100).toFixed(2) + "%"
            })),
            calculation_steps: finalCalculated // details for the expansion card
        });

    } catch (error) {
        console.error("Error pada Expert Controller:", error);
        res.status(500).json({ message: "Terjadi kesalahan internal pada server." });
    }
};

module.exports = { diagnose };