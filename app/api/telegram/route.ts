import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id_residen, kategori_isu, nota_tambahan, image } = body;

    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json({ error: 'Kunci Telegram tidak dijumpai' }, { status: 500 });
    }

    // Format mesej teks
    const message = `🚨 *ADUAN BAHARU (BBSAP)*\n\n📌 *Kategori:* ${kategori_isu}\n🏠 *ID Residen:* ${id_residen}\n📝 *Nota:* ${nota_tambahan || 'Tiada'}`;

    // Jika ada imej (Base64)
    if (image) {
      // Telegram API 'sendPhoto' memerlukan 'photo' sebagai URL atau file_id.
      // Untuk Base64, cara paling stabil adalah menghantarnya sebagai FormData
      // namun atas kekangan persekitaran Edge Function, kita guna pendekatan URL/Blob.
      
      const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          photo: image, // Telegram API akan cuba memproses Base64 jika format betul
          caption: message,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }
    } else {
      // Jika tiada imej, hantar teks biasa
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Telegram API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
