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

    // 2. Hantar sebagai DOKUMEN (Kaedah paling stabil)
    if (imageUrl) {
      // Telegram akan memuat turun fail dari URL ini dan menghantarnya sebagai dokumen
      const docUrl = `https://api.telegram.org/bot${token}/sendDocument`;
      
      await fetch(docUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          document: imageUrl,
          caption: "Gambar bukti aduan."
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal' }, { status: 500 });
  }
}