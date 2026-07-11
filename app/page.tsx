"use client";

import { useState } from "react";
import { Camera, MapPin, AlertTriangle, Send } from "lucide-react";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi kelewatan penghantaran ke Supabase (akan diganti dengan kod backend sebenar nanti)
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header Rasmi */}
        <div className="bg-slate-800 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-tight">BBSAP-Track</h1>
          <p className="text-sm text-slate-300 mt-1">Sistem Aduan Kutipan Sisa Pepejal</p>
        </div>

        {/* Borang Aduan */}
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
              
              {/* ID Residen */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">ID Log Masuk (No Rumah)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    required
                    placeholder="Cth: 1/25/2189" 
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Format: [Fasa]/[Lorong]/[NoRumah]</p>
              </div>

              {/* Kategori Isu */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori Isu</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AlertTriangle className="h-5 w-5 text-slate-400" />
                  </div>
                  <select 
                    required
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 text-sm appearance-none bg-white"
                  >
                    <option value="">Sila Pilih Kategori...</option>
                    <option value="Kutipan Lewat">Kutipan Terlepas / Lewat</option>
                    <option value="Lori Uzur">Tumpahan Air / Lori Uzur</option>
                    <option value="Tong Rosak">Tong Sampah Rosak / Pecah</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
              </div>

              {/* Muat Naik Gambar */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Gambar Bukti (Jika Ada)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:bg-slate-50 transition">
                  <div className="space-y-1 text-center">
                    <Camera className="mx-auto h-8 w-8 text-slate-400" />
                    <div className="flex text-sm text-slate-600 justify-center">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Muat Naik Imej</span>
                        <input type="file" className="sr-only" accept="image/*" />
                      </label>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG sehingga 5MB</p>
                  </div>
                </div>
              </div>

              {/* Butang Hantar */}
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                {isSubmitting ? (
                  'Menghantar...'
                ) : (
                  <>
                    Hantar Aduan <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );