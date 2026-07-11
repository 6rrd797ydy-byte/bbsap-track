"use client";

import { useState } from "react";
import { Camera, MapPin, AlertTriangle, Send } from "lucide-react";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [idResiden, setIdResiden] = useState("");
  const [kategori, setKategori] = useState("");
  const [nota, setNota] = useState("");
  const [namaGambar, setNamaGambar] = useState("");
  const [fileBase64, setFileBase64] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNamaGambar(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setFileBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Menghantar data ke API Route kita sendiri
      const res = await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_residen: idResiden, 
          kategori_isu: kategori, 
          nota_tambahan: nota, 
          image: fileBase64 
        })
      });
      
      if (!res.ok) throw new Error("Gagal menghantar aduan");

      setSuccess(true);
      setIdResiden("");
      setKategori("");
      setNota("");
      setNamaGambar("");
      setFileBase64(null);
    } catch (error) {
      alert("Ralat: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 font-sans">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-xl font-bold mb-4 text-center">BBSAP-Track (Live)</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" required placeholder="ID Residen (1/25/2189)"
            value={idResiden} onChange={(e) => setIdResiden(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <select 
            required value={kategori} onChange={(e) => setKategori(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Pilih Kategori...</option>
            <option value="Kutipan Lewat">Kutipan Lewat</option>
            <option value="Lori Uzur">Lori Uzur</option>
          </select>
          <input type="file" onChange={handleImageChange} className="w-full" />
          <button 
            type="submit" disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-3 rounded font-bold"
          >
            {isSubmitting ? "Menghantar..." : "Hantar Aduan"}
          </button>
        </form>
      </div>
    </main>
  );
}
