"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface Aduan {
  id: number;
  id_residen: string;
  kategori_isu: string;
  nota_tambahan: string;
  url_gambar: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [aduan, setAduan] = useState<Aduan[]>([]);

  useEffect(() => {
    fetchAduan();
  }, []);

  async function fetchAduan() {
    const { data, error } = await supabase
      .from('aduan')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setAduan(data);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin BBSAP</h1>
      <div className="grid gap-4">
        {aduan.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-600">
            <div className="flex justify-between">
              <span className="font-bold text-lg">{item.id_residen}</span>
              <span className="text-sm bg-yellow-100 px-2 rounded">{item.status}</span>
            </div>
            <p className="text-sm text-gray-600">Kategori: {item.kategori_isu}</p>
            <p className="mt-2">{item.nota_tambahan}</p>
            {item.url_gambar && (
              <a href={item.url_gambar} target="_blank" className="text-blue-600 underline text-sm mt-2 block">
                Lihat Gambar Bukti
              </a>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
