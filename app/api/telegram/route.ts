import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { idResiden, kategori, nota, imageUrl } = await req.json();
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    const message = `🚨 *Aduan Baharu*\nID: ${idResiden}\nKategori: ${kategori}\nNota: ${nota}`;

    // Gunakan sendPhoto jika ada gambar, jika tidak gunakan sendMessage
    const endpoint = imageUrl 
      ? `https://api.telegram.org/bot${token}/sendPhoto` 
      : `https://api.telegram.org/bot${token}/sendMessage`;

    const payload = imageUrl 
      ? { chat_id: chatId, photo: imageUrl, caption: message, parse_mode: 'Markdown' }
      : { chat_id: chatId, text: message, parse_mode: 'Markdown' };

    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hantar telegram' }, { status: 500 });
  }
}
