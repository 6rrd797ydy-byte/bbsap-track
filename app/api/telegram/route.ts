import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { zon_lorong, kategori_isu, nota_tambahan, id_residen } = body;

    // Mengambil kunci dari persekitaran Vercel
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: 'Kunci Telegram tidak dijumpai' }, { status: 500 });
    }

    // Format mesej yang akan dihantar ke Grup Telegram
    const message = `🚨 *ADUAN BAHARU (BBSAP)*\n\n📌 *Kategori:* ${kategori_isu}\n🏠 *Lokasi:* ${zon_lorong} (ID: ${id_residen})\n📝 *Nota:* ${nota_tambahan || 'Tiada'}\n\nSila buat semakan di sistem.`;

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      throw new Error('Gagal menghantar ke Telegram');
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
