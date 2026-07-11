"use client";

import { useState } from "react";
import { Camera, MapPin, AlertTriangle, Send } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Pembolehubah (State) untuk menyimpan input pengguna
  const [idResiden, setIdResiden] = useState("");
  const [kategori, setKategori] = useState("");
  const [nota, setNota] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Pecahkan ID untuk dapatkan nama zon (Contoh: "1/25/2189" -> "Lorong 1/25")
    const pecahan = idResiden.split('/');
    const zonLorong = pecahan.length >= 2 ? `Lorong ${pecahan[0]}/${pecahan[1]}` : "Tidak Diketahui";

    // Menghantar data ke Supabase (Jadual 'aduan')
    const { error } = await supabase
      .from('aduan')
      .insert([
        {
          id_residen: idResiden,
          zon_lorong: zonLorong,
          kategori_isu: kategori,
          nota_tambahan: nota,
          status: 'Pending'
        }
      ]);

    setIsSubmitting(false);

    if (error) {
      alert("Ralat sistem: " + error.message);
    } else {
      setSuccess(true);
      setIdResiden("");
      setKategori("");
      setNota("");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-slate-800 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-tight">BBSAP-Track</h1>
          <p className="text-sm text-slate-300 mt-1">Sistem Aduan Kutipan Sisa Pepejal</p>
        </div>

        <div className="p-6">
          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-green-800">Aduan Diterima!</h2>
              <p className="text-sm text-green-600 mt-2">Wakil residen akan menyemak laporan anda sebentar lagi.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-6 w-full bg-slate-800 text-white py-2 rounded-lg font-medium hover:bg-slate-700 transition"
              >
                Buat Aduan Baharu
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">ID Log Masuk (No Rumah)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={idResiden}
                    onChange={(e) => setIdResiden(e.target.value)}
                    placeholder="Cth: 1/25/2189" 
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori Isu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AlertTriangle className="h-5 w-5 text-slate-400" />
                  </div>
                  <select 
                    required
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm appearance-none bg-white"
                  >
                    <option value="">Sila Pilih Kategori...</option>
                    <option value="Kutipan Lewat">Kutipan Terlepas / Lewat</option>
                    <option value="Tumpahan Air/Lori Uzur">Tumpahan Air / Lori Uzur</option>
                    <option value="Tong Sampah Rosak">Tong Sampah Rosak / Pecah</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nota Tambahan</label>
                <textarea 
                  rows={2}
                  value={nota}
                  onChange={(e) => setNota(e.target.value)}
                  placeholder="Butiran tambahan (pilihan)"
                  className="block w-full p-3 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors`}
              >
                {isSubmitting ? 'Menghantar Data....' : <>Hantar Aduan <Send className="ml-2 h-4 w-4" /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}