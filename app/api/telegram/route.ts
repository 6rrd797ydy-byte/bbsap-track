import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { idResiden, kategori, nota, imageUrl } = await req.json();
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // 1. Hantar mesej teks
    const message = `🚨 *Aduan Baharu*\nID: ${idResiden}\nKategori: ${kategori}\nNota: ${nota}`;
    
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
    });

    // 2. Hantar gambar (Jika ada URL)
    if (imageUrl) {
      // Kita cuba hantar dengan parameter 'photo' yang lebih bersih
      const photoUrl = `https://api.telegram.org/bot${token}/sendPhoto?chat_id=${chatId}&photo=${encodeURIComponent(imageUrl)}`;
      
      const response = await fetch(photoUrl, { method: 'POST' });
      
      if (!response.ok) {
        const err = await response.text();
        console.error("Gagal hantar gambar:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 });
  }
}
