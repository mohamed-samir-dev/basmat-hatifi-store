"use client";
import { useEffect, useState } from "react";

type OrderItem = { productId: string; name: string; price: number; quantity: number };
type Order = {
  _id: string; orderId: string; customer: string; whatsapp: string;
  address: string; installmentType: "installment" | "full"; months: number;
  total: number; downPayment: number; items: OrderItem[];
  paymentMethod?: string; shippingCost?: number; trackingNumber?: string;
  deliveryTime?: string; createdAt: string;
};
type Company = {
  nameAr: string; nameEn: string; taxNumber: string; addressAr: string;
  email: string; phone: string; currencyAr: string; qrImage: string; qrLink: string;
  img1: string; link1: string; link1Type: string; file1: string;
  shippingCompany: string; paymentMethod: string;
};

export default function InvoicePrint({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [data, setData] = useState<{ order: Order; company: Company } | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${orderId}/invoice`)
      .then((r) => r.json())
      .then(setData);
  }, [orderId]);

  if (!data) return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const { order, company } = data;
  const remaining = order.total - (order.downPayment || 0);
  const currency = company.currencyAr || "ريال";

  const dateStr = new Intl.DateTimeFormat("ar-SA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(new Date(order.createdAt));

  function handlePrint() {
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    const items = order.items.map(item =>
      `<div class="product-item">
        <div class="product-name">${item.name}</div>
        <div class="product-meta">الكمية: ${item.quantity} &nbsp;&nbsp; السعر: ${item.price} ${currency}</div>
      </div>`
    ).join("");
    const installmentRows = order.installmentType === "installment" ? `
      <div class="row"><span class="label">الدفعة الأولى:</span><span>${order.downPayment} ${currency}</span></div>
      <div class="row"><span class="label">المتبقي:</span><span>${remaining} ${currency}</span></div>
    ` : "";
    const installmentNote = order.installmentType === "installment" && order.months > 0
      ? `<div class="row"><span class="label">نظام التقسيط:</span><span>الباقي أقساط على ${order.months} شهر</span></div>` : "";
    const summaryInstallment = order.installmentType === "installment" ? `
      <div class="row bold"><span class="label">الدفعة الأولى:</span><span>${order.downPayment} ${currency}</span></div>
      <div class="row bold"><span class="label">المتبقي:</span><span>${remaining} ${currency}</span></div>
    ` : "";
    const rawHref = company.link1Type === "file" ? company.file1 : company.link1;
    const img1Href = rawHref && !rawHref.startsWith("http") ? `https://${rawHref}` : rawHref;
    const img1Html = company.img1
      ? img1Href
        ? `<div class="qr-wrap"><a href="${img1Href}" target="_blank"><img src="${company.img1}" /></a><div class="qr-label">شهادة وزارة التجارة</div></div>`
        : `<div class="qr-wrap"><img src="${company.img1}" /><div class="qr-label">شهادة وزارة التجارة</div></div>`
      : "";
    const qrImages = [
      company.qrImage ? `<div class="qr-wrap"><img src="${company.qrImage}" /><div class="qr-label">QR المتجر</div></div>` : "",
      img1Html,
    ].join("");

    win.document.write(`<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8" />
  <title>فاتورة - ${order.orderId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 13px; color: #1f2937; padding: 24px; direction: rtl; }
    .header { text-align: center; border-bottom: 2px solid #1f2937; padding-bottom: 14px; margin-bottom: 14px; }
    .header h1 { font-size: 17px; font-weight: 800; }
    .header p { color: #6b7280; margin-top: 4px; font-size: 12px; }
    .section { border: 1px solid #d1d5db; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; }
    .section-title { font-weight: 800; color: #374151; margin-bottom: 8px; }
    .row { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 4px; font-size: 13px; }
    .label { color: #6b7280; flex-shrink: 0; }
    .bold { font-weight: 700; }
    .summary { border: 2px solid #1f2937; background: #f9fafb; }
    .product-item { margin-bottom: 8px; }
    .product-name { font-weight: 600; }
    .product-meta { color: #6b7280; font-size: 12px; margin-top: 2px; }
    .qr-wrap { display: inline-block; text-align: center; margin-left: 12px; }
    .qr-wrap img { width: 75px; height: 75px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 4px; display: block; }
    .qr-label { font-size: 11px; color: #9ca3af; margin-top: 3px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📄 تفاصيل الطلب</h1>
    <p>${dateStr}</p>
    <p style="font-weight:700;margin-top:4px">رقم الطلب: ${order.orderId}</p>
  </div>

  <div class="section">
    <div class="section-title">🏪 مصدر من:</div>
    <div class="row"><span class="label">المتجر الإلكتروني:</span><span>${company.nameAr}${company.nameEn ? " | " + company.nameEn : ""}</span></div>
    ${company.taxNumber ? `<div class="row"><span class="label">الرقم الضريبي:</span><span>${company.taxNumber}</span></div>` : ""}
    ${company.addressAr ? `<div class="row"><span class="label">الدولة:</span><span>${company.addressAr}</span></div>` : ""}
    ${company.email ? `<div class="row"><span class="label">الإيميل:</span><span>${company.email}</span></div>` : ""}
  </div>

  <div class="section">
    <div class="section-title">👤 مصدر إلى:</div>
    <div class="row"><span class="label">الاسم:</span><span>${order.customer || "—"}</span></div>
    <div class="row"><span class="label">العنوان:</span><span>${order.address || "—"}</span></div>
    <div class="row"><span class="label">رقم الجوال:</span><span>${order.whatsapp || "—"}</span></div>
  </div>

  <div class="section">
    <div class="section-title">🚚 تفاصيل الشحن:</div>
    <div class="row"><span class="label">بواسطة:</span><span>${company.shippingCompany || "مندوب توصيل"}</span></div>
    <div class="row"><span class="label">رقم الشحنة:</span><span>#${order.orderId}</span></div>
    <div class="row"><span class="label">وقت التوصيل المتوقع:</span><span>من (8 إلى 48 ساعة)</span></div>
  </div>

  <div class="section">
    <div class="section-title">💳 تفاصيل الدفع:</div>
    <div class="row"><span class="label">المبلغ:</span><span>${order.total} ${currency}</span></div>
    ${installmentRows}
    <div class="row"><span class="label">طريقة الدفع:</span><span>${company.paymentMethod || "بطاقة بنكية"}</span></div>
    ${installmentNote}
  </div>

  <div class="section">
    <div class="section-title">📦 تفاصيل المنتج:</div>
    ${items}
  </div>

  <div class="section summary">
    <div class="section-title">💰 ملخص الطلب:</div>
    <div class="row bold"><span class="label">إجمالي الطلب:</span><span>${order.total} ${currency}</span></div>
    ${summaryInstallment}
  </div>

  <div class="section">
    <div class="section-title">📌 ملاحظات:</div>
    <p style="color:#4b5563;margin-bottom:8px">لزيارة المتجر امسح الكود</p>
    <p style="color:#4b5563;margin-bottom:10px">للاطلاع على شهادة المتجر لدى وزارة التجارة امسح الكود</p>
    ${qrImages}
  </div>
</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  }

  const img1RawHref = company.link1Type === "file" ? company.file1 : company.link1;
  const img1Href = img1RawHref && !img1RawHref.startsWith("http") ? `https://${img1RawHref}` : img1RawHref;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" dir="rtl">
      {/* backdrop close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh]">

        {/* هيدر ثابت */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
          <span className="font-bold text-gray-800 text-sm">📄 فاتورة #{order.orderId}</span>
          <div className="flex gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              طباعة
            </button>
            <button onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        {/* المحتوى قابل للسكرول */}
        <div className="overflow-y-auto flex-1 p-4 space-y-3 text-sm">

          {/* رأس */}
          <div className="text-center pb-3 border-b-2 border-gray-800">
            <p className="text-gray-500 text-xs">{dateStr}</p>
            <p className="font-bold text-gray-800 mt-0.5 text-xs" dir="ltr">#{order.orderId}</p>
          </div>

          {/* مصدر من */}
          <Section title="🏪 مصدر من">
            <Row label="المتجر" value={`${company.nameAr}${company.nameEn ? ` | ${company.nameEn}` : ""}`} />
            {company.taxNumber && <Row label="الرقم الضريبي" value={company.taxNumber} />}
            {company.addressAr && <Row label="الدولة" value={company.addressAr} />}
            {company.email && <Row label="الإيميل" value={company.email} />}
          </Section>

          {/* مصدر إلى */}
          <Section title="👤 مصدر إلى">
            <Row label="الاسم" value={order.customer} />
            <Row label="العنوان" value={order.address} />
            <Row label="الجوال" value={order.whatsapp} />
          </Section>

          {/* الشحن */}
          <Section title="🚚 الشحن">
            <Row label="بواسطة" value={company.shippingCompany || "مندوب توصيل"} />
            <Row label="رقم الشحنة" value={`#${order.orderId}`} />
            <Row label="وقت التوصيل" value="من (8 إلى 48 ساعة)" />
          </Section>

          {/* الدفع */}
          <Section title="💳 الدفع">
            <Row label="المبلغ" value={`${order.total} ${currency}`} />
            {order.installmentType === "installment" && (
              <>
                <Row label="الدفعة الأولى" value={`${order.downPayment} ${currency}`} />
                <Row label="المتبقي" value={`${remaining} ${currency}`} />
              </>
            )}
            <Row label="طريقة الدفع" value={company.paymentMethod || "بطاقة بنكية"} />
            {order.installmentType === "installment" && order.months > 0 && (
              <Row label="التقسيط" value={`${order.months} شهر`} />
            )}
          </Section>

          {/* المنتجات */}
          <Section title="📦 المنتجات">
            {order.items.map((item, i) => (
              <div key={i} className={`${i > 0 ? "mt-2 pt-2 border-t border-gray-100" : ""}`}>
                <p className="font-semibold text-gray-800 leading-snug">{item.name}</p>
                <div className="flex gap-4 text-gray-500 text-xs mt-0.5">
                  <span>الكمية: <b className="text-gray-700">{item.quantity}</b></span>
                  <span>السعر: <b className="text-gray-700">{item.price} {currency}</b></span>
                </div>
              </div>
            ))}
          </Section>

          {/* الملخص */}
          <div className="border-2 border-gray-800 rounded-xl p-3 bg-gray-50 space-y-1.5">
            <p className="font-extrabold text-gray-700 text-xs mb-2">💰 ملخص الطلب</p>
            <Row label="الإجمالي" value={`${order.total} ${currency}`} bold />
            {order.installmentType === "installment" && (
              <>
                <Row label="الدفعة الأولى" value={`${order.downPayment} ${currency}`} bold />
                <Row label="المتبقي" value={`${remaining} ${currency}`} bold />
              </>
            )}
          </div>

          {/* ملاحظات */}
          <Section title="📌 ملاحظات">
            <div className="flex gap-4 flex-wrap justify-center pt-1">
              {company.qrImage && (
                <div className="text-center">
                  <img src={company.qrImage} alt="QR" className="w-16 h-16 sm:w-20 sm:h-20 object-contain border border-gray-200 rounded-lg mx-auto" />
                  <p className="text-xs text-gray-400 mt-1">QR المتجر</p>
                </div>
              )}
              {company.img1 && (
                <div className="text-center">
                  {img1Href ? (
                    <a href={img1Href} target="_blank" rel="noopener noreferrer">
                      <img src={company.img1} alt="شهادة وزارة التجارة" className="w-16 h-16 sm:w-20 sm:h-20 object-contain border border-gray-200 rounded-lg mx-auto cursor-pointer hover:opacity-80 transition-opacity" />
                    </a>
                  ) : (
                    <img src={company.img1} alt="شهادة وزارة التجارة" className="w-16 h-16 sm:w-20 sm:h-20 object-contain border border-gray-200 rounded-lg mx-auto" />
                  )}
                  <p className="text-xs text-gray-400 mt-1">شهادة وزارة التجارة</p>
                </div>
              )}
            </div>
          </Section>

        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-gray-200 rounded-xl p-3 space-y-1.5">
      <p className="font-extrabold text-gray-700 text-xs mb-2">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value?: string | number; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-gray-500 shrink-0">{label}:</span>
      <span className={`text-right ${bold ? "font-bold text-gray-900" : "text-gray-800"}`}>{value || "—"}</span>
    </div>
  );
}
