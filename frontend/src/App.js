import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  // State untuk kontrol Landing Page
  const [showLanding, setShowLanding] = useState(true);
  
  const [listGejala, setListGejala] = useState([]);
  const [userChoices, setUserChoices] = useState({});
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Ambil data gejala dari backend saat aplikasi dimuat
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

  // 2. Handle perubahan dropdown pilihan user
  const handleChoice = (kode, nilai) => {
    setUserChoices(prev => ({ ...prev, [kode]: parseFloat(nilai) }));
  };

  // 3. Fungsi kirim diagnosa (DIPERBAIKI LOGIKANYA)
  const kirimDiagnosa = async () => {
    const formattedSymptoms = Object.entries(userChoices)
      .filter(([_, val]) => val > 0)
      .map(([kode, val]) => ({ 
        kode_gejala: kode, 
        cf_user: val 
      }));

    if (formattedSymptoms.length === 0) {
      alert("Pilih minimal satu gejala ya! ✨");
      return;
    }

    setLoading(true);
    setHasil(null);
    try {
      const response = await axios.post('http://localhost:5000/api/diagnose', {
        selectedSymptoms: formattedSymptoms
      });
      
      // Jika backend sukses mengembalikan data
      if (response.data.status === "success") {
        // Kita simpan seluruh response.data (isinya diagnosa dan detail_lain)
        setHasil(response.data);
      } else {
        // Jika status "empty" atau tidak ada penyakit cocok
        setHasil({
            diagnosa: {
                penyakit: "TIDAK TERDETEKSI",
                keyakinan: "0%",
                penjelasan_ai: "Gejala yang kamu masukkan belum mencukupi untuk mendiagnosa penyakit dalam basis pengetahuan kami."
            },
            detail_lain: []
        });
      }
    } catch (err) {
      console.error("Error Diagnosa:", err);
      alert("Terjadi kesalahan sistem saat menghubungi backend.");
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER LANDING PAGE ---
  if (showLanding) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center p-6 font-sans">
        <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-pink-100">
          <div className="md:w-1/2 bg-gradient-to-br from-[#FB6F92] to-[#FFB3C1] p-12 flex flex-col justify-center text-white relative">
            <div className="absolute top-10 left-10 text-4xl opacity-20 rotate-12">🌸</div>
            <div className="absolute bottom-10 right-10 text-4xl opacity-20 -rotate-12">✨</div>
            <h2 className="text-4xl font-black mb-4 leading-tight">Halo, selamat datang!</h2>
            <p className="text-pink-50 font-medium leading-relaxed opacity-90 text-sm">
              Sistem Pakar Diagnosa Kail membantu kamu menganalisis kemungkinan keracunan makanan berdasarkan Certainty Factor.
            </p>
          </div>

          <div className="md:w-1/2 p-12 flex flex-col justify-center text-center md:text-left">
            <h1 className="text-3xl font-black text-gray-800 mb-6 leading-tight">Mulai pemeriksaan kesehatan hari ini</h1>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3 text-gray-600 text-sm font-semibold">
                <span className="bg-pink-100 p-2 rounded-xl">📋</span>
                Input Gejala & Keyakinan
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm font-semibold">
                <span className="bg-pink-100 p-2 rounded-xl">📊</span>
                Hitung Certainty Factor
              </div>
            </div>

            <button 
              onClick={() => setShowLanding(false)}
              className="bg-[#FB6F92] hover:bg-[#ff5d87] text-white font-black py-4 px-8 rounded-2xl shadow-[0_10px_20px_rgba(251,111,146,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
            >
              Mulai Diagnosa ✨
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER HALAMAN DIAGNOSA ---
  return (
    <div className="min-h-screen bg-[#FFF0F3] py-12 px-4 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => setShowLanding(true)}
          className="mb-8 text-pink-400 font-bold text-sm flex items-center gap-2 hover:text-pink-600 transition-colors group"
        >
          <span className="bg-white p-2 rounded-full shadow-sm group-hover:bg-pink-50">←</span> 
          Kembali ke Beranda
        </button>

        <header className="bg-white rounded-[3rem] p-10 shadow-sm border-b-8 border-pink-200 text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#FB6F92] mb-3">Diagnosa Kail</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Certainty Factor Expert System</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* List Gejala */}
          <div className="lg:col-span-8 bg-white rounded-[2.5rem] shadow-xl p-8 border border-pink-50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-gray-700">Daftar Gejala</h3>
              <span className="bg-pink-50 text-pink-500 text-[10px] font-black px-3 py-1 rounded-lg">
                {listGejala.length} Gejala Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {listGejala.map(g => (
                <div key={g.kode_gejala} className="bg-white border-2 border-gray-100 hover:border-pink-200 p-5 rounded-3xl transition-all shadow-sm group">
                  <p className="text-[10px] font-black text-pink-300 uppercase mb-1 tracking-wider">
                    {g.kode_gejala}
                  </p>
                  <p className="text-sm font-bold text-gray-700 mb-4 h-10 line-clamp-2 leading-snug group-hover:text-pink-600">
                    {g.nama_gejala}
                  </p>
                  <select 
                    value={userChoices[g.kode_gejala] || 0}
                    onChange={(e) => handleChoice(g.kode_gejala, e.target.value)}
                    className="w-full bg-gray-50 rounded-2xl py-2.5 px-4 text-xs font-bold text-gray-500 outline-none border-none focus:ring-2 focus:ring-pink-100"
                  >
                    <option value="0">Tidak Mengalami</option>
                    <option value="0.4">Sedikit Yakin</option>
                    <option value="0.6">Cukup Yakin</option>
                    <option value="0.8">Yakin</option>
                    <option value="1.0">Sangat Yakin</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Action & Result (DIPERBAIKI PEMANGGILAN DATANYA) */}
          <div className="lg:col-span-4 space-y-6">
            <button 
              onClick={kirimDiagnosa}
              disabled={loading}
              className={`w-full py-6 rounded-3xl font-black text-lg text-white shadow-lg transition-all uppercase tracking-widest ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-br from-[#FB6F92] to-[#FFB3C1] hover:shadow-pink-200'}`}
            >
              {loading ? "Menganalisis..." : "Diagnosa Sekarang"}
            </button>

            {hasil && hasil.diagnosa && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-8 text-white shadow-2xl animate-in zoom-in-95 duration-500">
                <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-2">Hasil Diagnosa Utama</p>
                
                {/* Menampilkan Penyakit Utama menggunakan hasil.diagnosa */}
                <h2 className="text-2xl font-black mb-1 uppercase tracking-tight">
                  {hasil.diagnosa.penyakit}
                </h2>
                
                {/* Menampilkan Persentase Keyakinan Utama */}
                <p className="text-indigo-200 text-xs font-bold mb-6 italic">
                  Tingkat Keyakinan: {hasil.diagnosa.keyakinan}
                </p>
                
                <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/10 mb-6">
                  <p className="text-xs font-black uppercase text-indigo-100 mb-2">Informasi & Saran AI:</p>
                  <p className="text-sm leading-relaxed text-indigo-50">
                    {hasil.diagnosa.penjelasan_ai || "Gunakan hasil ini sebagai referensi awal, segera hubungi tenaga medis jika gejala berlanjut."}
                  </p>
                </div>

                {/* Menampilkan Daftar Kemungkinan Lain */}
                {hasil.detail_lain && hasil.detail_lain.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-[10px] font-black uppercase opacity-60 mb-3 tracking-widest">Kemungkinan Lainnya:</p>
                        <div className="space-y-2">
                        {hasil.detail_lain.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="font-bold opacity-90">{item.penyakit}</span>
                                <span className="bg-white/20 px-2 py-1 rounded-lg font-mono text-[10px]">{item.keyakinan}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #FFF0F3; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFB3C1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FB6F92; }
      `}} />
    </div>
  );
};

export default App;