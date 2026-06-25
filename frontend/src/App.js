import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [listGejala, setListGejala] = useState([]);
  const [userChoices, setUserChoices] = useState({});
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);

  useEffect(() => {
    const fetchGejala = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/gejala');
        setListGejala(res.data);
      } catch (err) {
        console.error("Gagal ambil data gejala", err);
      }
    };
    fetchGejala();
  }, []);

  const handleChoice = (kode, nilai) => {
    setUserChoices(prev => ({ ...prev, [kode]: nilai }));
  };

  const kirimDiagnosa = async () => {
    const formattedSymptoms = Object.entries(userChoices)
      .filter(([_, val]) => parseFloat(val) > 0)
      .map(([kode, val]) => ({ 
        kode_gejala: kode, 
        cf_user: parseFloat(val) 
      }));

    if (formattedSymptoms.length === 0) {
      alert("Pilih minimal satu gejala dulu ya! ✨");
      return;
    }

    setLoading(true);
    setHasil(null);
    setShowCalculation(false);
    try {
      const response = await axios.post('http://localhost:5000/api/diagnose', {
        selectedSymptoms: formattedSymptoms
      });
      
      setHasil(response.data);
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
    } catch (err) {
      console.error("Error Diagnosa:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- 1. LOGIKA TAMPILAN LANDING PAGE ---
  if (showLanding) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center p-6 font-sans">
        <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-pink-100">
          <div className="md:w-1/2 bg-gradient-to-br from-[#FB6F92] to-[#FFB3C1] p-12 flex flex-col justify-center text-white relative">
            <h2 className="text-4xl font-black mb-4 leading-tight text-center md:text-left">Halo, Selamat Datang! ✨</h2>
            <p className="text-pink-50 font-medium leading-relaxed opacity-90 text-sm text-center md:text-left">
              Sistem Pakar DigestCare membantu Anda menganalisis kemungkinan penyakit pencernaan (Gastritis, Diare, GERD, Wasir, Tipes, Apendisitis) berdasarkan Certainty Factor secara cepat, akurat.
            </p>
          </div>
          <div className="md:w-1/2 p-12 flex flex-col justify-center text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-800 mb-6 leading-tight">Mulai pemeriksaan kesehatan hari ini</h1>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-gray-600 text-sm font-semibold">
                <span className="bg-pink-100 p-2 rounded-xl">📋</span> Input Gejala & Keyakinan
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm font-semibold">
                <span className="bg-pink-100 p-2 rounded-xl">📊</span> Hitung Certainty Factor
              </div>
            </div>
            <button 
              onClick={() => setShowLanding(false)}
              className="bg-[#FB6F92] hover:bg-[#ff5d87] text-white font-black py-4 px-8 rounded-2xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Mulai Diagnosa Sekarang 🔍
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. LOGIKA TAMPILAN HALAMAN DIAGNOSA ---
  return (
    <div className="min-h-screen bg-[#FFF0F3] py-12 px-4 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => setShowLanding(true)}
          className="mb-8 text-pink-400 font-bold text-sm flex items-center gap-2 hover:text-pink-600 transition-colors group"
        >
          <span className="bg-white p-2 rounded-full shadow-sm group-hover:bg-pink-50">←</span> Kembali ke Beranda
        </button>

        <header className="bg-white rounded-[3rem] p-10 shadow-sm border-b-8 border-pink-200 text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#FB6F92] mb-3">DigestCare</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Sistem Pakar Deteksi Penyakit Pencernaan</p>
        </header>

        <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-12 border border-pink-50 mb-8">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-gray-700">Daftar Gejala</h3>
            <span className="bg-pink-50 text-pink-500 text-xs font-black px-4 py-2 rounded-full">{listGejala.length} Gejala Tersedia</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listGejala.map((g) => (
              <div key={g.kode_gejala} className="bg-white border-2 border-gray-50 hover:border-pink-200 p-6 rounded-[2rem] transition-all shadow-sm group">
                <p className="text-[10px] font-black text-pink-300 uppercase mb-2 tracking-widest">{g.kode_gejala}</p>
                <p className="text-sm font-bold text-gray-700 mb-5 leading-snug group-hover:text-[#FB6F92] min-h-[40px]">{g.nama_gejala}</p>
                <select 
                  value={String(userChoices[g.kode_gejala] || 0)}
                  onChange={(e) => handleChoice(g.kode_gejala, e.target.value)}
                  className="w-full bg-gray-50 rounded-2xl py-3 px-4 text-xs font-bold text-gray-500 outline-none focus:ring-2 focus:ring-pink-100"
                >
                  <option value="0">Tidak Mengalami</option>
                  <option value="0.4">Sedikit Yakin</option>
                  <option value="0.6">Cukup Yakin</option>
                  <option value="0.8">Yakin</option>
                  <option value="1">Sangat Yakin</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-12 flex justify-center">
          <button 
            onClick={kirimDiagnosa}
            disabled={loading}
            className={`w-full md:w-3/5 py-6 rounded-[2rem] font-black text-xl text-white shadow-xl transition-all uppercase tracking-widest ${loading ? 'bg-gray-300' : 'bg-[#FB6F92] hover:bg-[#ff5d87] shadow-lg hover:-translate-y-1'}`}
          >
            {loading ? "Menganalisis... ✨" : "Diagnosa Sekarang 🔍"}
          </button>
        </div>

        {hasil && hasil.status === "empty" && (
          <div className="max-w-4xl mx-auto animate-diagnosa">
            <div className="bg-red-50 border border-red-200 rounded-[2rem] p-8 text-center shadow-lg">
              <span className="text-4xl">⚠️</span>
              <h3 className="text-xl font-black text-red-800 mt-4 mb-2">Maaf, Tidak Dapat Memprediksi</h3>
              <p className="text-sm font-semibold text-red-600 leading-relaxed max-w-lg mx-auto">
                Maaf, belum bisa memprediksi penyakit Anda dikarenakan gejala yang diinput kurang atau tidak cocok dengan basis pengetahuan kami. Mohon masukkan gejala tambahan yang Anda rasakan.
              </p>
            </div>
          </div>
        )}

        {hasil && hasil.status === "success" && hasil.diagnosa && (
          <div className="max-w-4xl mx-auto space-y-4 animate-diagnosa"> {/* Batasi lebar hasil */}
            
            {/* Card Hasil Penyakit */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
              <p className="text-[9px] font-black opacity-60 uppercase tracking-widest mb-2">Hasil Diagnosa Utama</p>
              <h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight">
                {hasil.diagnosa.penyakit}
              </h2>
              <div className="inline-block bg-white/20 px-3 py-1 rounded-lg text-xs font-bold mb-6">
                Tingkat Keyakinan: {hasil.diagnosa.keyakinan}
              </div>
              <div className="bg-white/10 rounded-xl p-5 border border-white/10">
                <h4 className="text-[10px] font-black uppercase text-indigo-100 mb-2">Tentang Penyakit Ini:</h4>
                <p className="text-sm leading-relaxed italic opacity-90">
                  "{hasil.diagnosa.penjelasan}"
                </p>
              </div>
            </div>

            {/* Card Pertolongan Pertama */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg border-l-[8px] border-[#FB6F92]">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">🚑</span>
                <h3 className="text-lg font-black text-gray-800">Saran Pertolongan Pertama</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {hasil.diagnosa.pertolongan}
              </p>
            </div>

            {/* Card Perhitungan Certainty Factor */}
            <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-pink-100 overflow-hidden">
              <button 
                onClick={() => setShowCalculation(!showCalculation)}
                className="w-full flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">📊</span>
                  <div>
                    <h3 className="text-lg font-black text-gray-800">Detail Perhitungan Certainty Factor</h3>
                    <p className="text-xs text-gray-400 font-semibold">Lihat bagaimana sistem pakar menghitung nilai keyakinan secara matematis</p>
                  </div>
                </div>
                <span className={`text-2xl text-pink-400 transition-transform duration-300 transform ${showCalculation ? 'rotate-185' : ''}`}>
                  ▼
                </span>
              </button>

              {showCalculation && (
                <div className="mt-8 border-t border-pink-100 pt-6 space-y-6 animate-fadeIn">
                  <div className="bg-pink-50/50 rounded-2xl p-5 border border-pink-100 text-xs text-pink-700 leading-relaxed font-semibold">
                    <p className="mb-2 font-black text-sm">💡 Rumus Certainty Factor yang Digunakan:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>CF_rule</strong> = CF_gejala * CF_pakar (nilai kepercayaan aturan)</li>
                      <li><strong>CF_combine</strong> (untuk aturan ganda) = CF_lama + CF_baru * (1 - CF_lama)</li>
                    </ul>
                  </div>

                  <div className="space-y-6">
                    {hasil.calculation_steps && hasil.calculation_steps.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                          <h4 className="font-black text-gray-800 uppercase text-sm tracking-wide">
                            {item.penyakit}
                          </h4>
                          <span className="bg-pink-100 text-pink-600 text-xs font-black px-3 py-1 rounded-full">
                            CF Akhir: {(item.cf * 100).toFixed(2)}%
                          </span>
                        </div>

                        {/* Rules Evaluated */}
                        <div className="space-y-3">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Aturan yang Terpicu:</p>
                          {item.rulesUsed.map((rule, rIdx) => (
                            <div key={rIdx} className="bg-white rounded-xl p-4 border border-gray-100 text-xs space-y-2 shadow-sm">
                              <div className="flex items-center justify-between text-[10px] font-black text-pink-500 uppercase tracking-widest">
                                <span>Rule {rule.ruleKode}</span>
                                <span>Nilai Pakar: {rule.nilaiKepercayaan}</span>
                              </div>
                              
                              <div className="bg-gray-50 rounded-lg p-2 font-mono text-[10px] text-gray-600 space-y-1">
                                <p>⚙️ {rule.calculationDetail}</p>
                                <p>🧮 {rule.ruleCalculation}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Combine Steps */}
                        {item.combineLogs && item.combineLogs.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Langkah Penggabungan (CF Combine):</p>
                            <div className="bg-[#FAF9F6] rounded-xl p-4 border border-yellow-100 font-mono text-[10px] text-gray-700 space-y-2">
                              {item.combineLogs.map((log, lIdx) => (
                                <p key={lIdx} className="leading-relaxed">
                                  {log.startsWith('Hasil') ? (
                                    <strong className="text-green-700">{log}</strong>
                                  ) : (
                                    <span>{log}</span>
                                  )}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;