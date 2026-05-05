import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [listGejala, setListGejala] = useState([]);
  const [userChoices, setUserChoices] = useState([]); // Simpan format: [{kode_gejala: 'G01', cf_user: 0.8}]
  const [hasil, setHasil] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const val = parseFloat(nilai);
    // Update atau tambah pilihan gejala user
    setUserChoices(prev => {
      const existing = prev.find(item => item.kode_gejala === kode);
      if (existing) {
        return prev.map(item => item.kode_gejala === kode ? { ...item, cf_user: val } : item);
      }
      return [...prev, { kode_gejala: kode, cf_user: val }];
    });
  };

  const kirimDiagnosa = async () => {
    setLoading(true);
    try {
      // Kirim ke backend yang punya logika CF + Gemini
      const response = await axios.post('http://localhost:5000/api/diagnose', {
        selectedSymptoms: userChoices.filter(s => s.cf_user > 0)
      });
      setHasil(response.data);
    } catch (err) {
      alert("Terjadi kesalahan saat diagnosa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 border-4 border-pink-200">
        <h1 className="text-3xl font-bold text-pink-400 text-center mb-2">🌸 Diagnosa Kail 🌸</h1>
        
        <div className="space-y-4 max-h-96 overflow-y-auto mb-8 pr-2">
          {listGejala.map(g => (
            <div key={g.kode_gejala} className="p-4 bg-pink-50 rounded-2xl border border-pink-100">
              <span className="font-semibold text-pink-500">{g.kode_gejala} - {g.nama_gejala}</span>
              <select 
                onChange={(e) => handleChoice(g.kode_gejala, e.target.value)}
                className="w-full mt-2 bg-white border-2 border-pink-200 rounded-lg p-2"
              >
                <option value="0">Tidak Mengalami / Tidak Tahu</option>
                <option value="0.4">Sedikit Yakin</option>
                <option value="0.6">Cukup Yakin</option>
                <option value="0.8">Yakin</option>
                <option value="1.0">Sangat Yakin</option>
              </select>
            </div>
          ))}
        </div>

        <button 
          onClick={kirimDiagnosa}
          disabled={loading}
          className="w-full bg-pink-400 text-white font-bold py-4 rounded-2xl shadow-lg"
        >
          {loading ? "Sedang Menganalisis AI..." : "Mulai Diagnosa ✨"}
        </button>

        {hasil && (
          <div className="mt-8 p-6 bg-purple-50 rounded-3xl border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-purple-600 mb-2">{hasil.penyakit} ({hasil.keyakinan})</h2>
            <div className="prose text-gray-700 bg-white p-4 rounded-xl shadow-sm italic">
              {hasil.edukasi_gemini}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;