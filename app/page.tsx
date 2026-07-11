"use client";

import { useState } from "react";
import { Camera, MapPin, AlertTriangle, Send } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idResiden, setIdResiden] = useState("");
  const [kategori, setKategori] = useState("");
  const [nota, setNota] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // 1. Muat naik gambar ke Supabase Storage (jika ada)
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('bukti_aduan')
          .upload(fileName, file);
        
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('bukti_aduan').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      // 2. Simpan rekod ke Table 'aduan'
      const { error: dbError } = await supabase.from('aduan').insert([{
        id_residen: idResiden,
        kategori_isu: kategori,
        nota_tambahan: nota,
        url_gambar: imageUrl,
        status: 'Pending'
      }]);

      if (dbError) throw dbError;

      // 3. Tembak API Route Telegram
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idResiden, kategori, nota, imageUrl })
      });

      alert("Aduan Berjaya Dihantar!");
      setIdResiden("");
      setKategori("");
      setNota("");
      setFile(null);
    } catch (err: any) {
      alert("Ralat: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-bold mb-4">BBSAP-Track</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="ID Residen" required className="w-full p-2 border rounded" onChange={(e) => setIdResiden(e.target.value)} value={idResiden} />
          <select required className="w-full p-2 border rounded" onChange={(e) => setKategori(e.target.value)} value={kategori}>
            <option value="">Pilih Kategori...</option>
            <option value="Kutipan Lewat">Kutipan Lewat</option>
            <option value="Lain-lain">Lain-lain</option>
          </select>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full" />
          <textarea placeholder="Nota" className="w-full p-2 border rounded" onChange={(e) => setNota(e.target.value)} value={nota} />
          <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-3 rounded">
            {isSubmitting ? "Menghantar..." : "Hantar Aduan"}
          </button>
        </form>
      </div>
    </main>
  );
}
