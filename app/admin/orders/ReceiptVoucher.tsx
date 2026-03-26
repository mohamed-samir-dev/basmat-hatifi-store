"use client";
import { useEffect, useState } from "react";

type OrderItem = { productId: string; name: string; price: number; quantity: number };
type Order = {
  _id: string; orderId: string; customer: string; whatsapp: string;
  address: string; installmentType: "installment" | "full"; months: number;
  total: number; downPayment: number; items: OrderItem[]; createdAt: string;
};
type Company = { nameAr: string; currencyAr: string; };

function toArabicWords(n: number): string {
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة",
    "عشرة", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر",
    "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
  const tens = ["", "", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const hundreds = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
  if (n === 0) return "صفر";
  if (n < 0) return "سالب " + toArabicWords(-n);
  let result = "";
  if (n >= 1000) {
    const t = Math.floor(n / 1000);
    result += (t === 1 ? "ألف" : t === 2 ? "ألفان" : t <= 10 ? toArabicWords(t) + " آلاف" : toArabicWords(t) + " ألف") + " ";
    n %= 1000;
    if (n > 0) result += "و";
  }
  if (n >= 100) { result += hundreds[Math.floor(n / 100)] + " "; n %= 100; if (n > 0) result += "و"; }
  if (n >= 20) { result += tens[Math.floor(n / 10)] + " "; n %= 10; if (n > 0) result += "و"; }
  if (n > 0) result += ones[n] + " ";
  return result.trim();
}

const PRINT_STYLE = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial, sans-serif; background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; direction: rtl; }
.cheque { width: 680px; border: 2px solid #1a1a1a; border-radius: 8px; overflow: hidden; }
.cheque-header { background: #1a1a1a; color: #fff; display: flex; justify-content: space-between; align-items: center; padding: 10px 18px; }
.cheque-header .title { font-size: 18px; font-weight: 900; letter-spacing: 1px; }
.cheque-header .no { font-size: 12px; opacity: .75; }
.cheque-body { padding: 18px 20px; }
.field-row { display: flex; align-items: stretch; border: 1px solid #d1d5db; border-radius: 6px; margin-bottom: 10px; overflow: hidden; }
.field-label { background: #f3f4f6; font-weight: 700; font-size: 12px; color: #374151; padding: 8px 12px; white-space: nowrap; display: flex; align-items: center; border-left: 1px solid #d1d5db; min-width: 130px; }
.field-value { padding: 8px 12px; font-size: 13px; color: #111; flex: 1; display: flex; align-items: center; }
.field-value.amount { font-size: 16px; font-weight: 900; color: #1a1a1a; }
.field-value.words { font-weight: 700; color: #1a1a1a; background: #fffbeb; }
.amount-badge { background: #1a1a1a; color: #fff; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 4px; margin-right: 8px; }
.cheque-footer { border-top: 2px dashed #d1d5db; margin: 6px 0 0; padding: 14px 20px 18px; display: flex; justify-content: space-between; }
.sign-box { text-align: center; }
.sign-line { width: 140px; border-top: 1px solid #1a1a1a; padding-top: 6px; font-size: 11px; color: #6b7280; margin-top: 36px; }
@media print { body { padding: 0; min-height: unset; } }
`;

export default function ReceiptVoucher({ orderId, onClose }: { orderId: string; onClose: () => void }) {
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
  const currency = company.currencyAr || "ريال";
  const amount = order.installmentType === "installment" ? order.downPayment : order.total;
  const productNames = order.items.map((i) => i.name).join("، ");
  const amountWords = toArabicWords(amount) + " فقط لا غير";
  const aboutText = `قيمة ${order.installmentType === "installment" ? "دفعة من " : ""}ثمن جهاز/أجهزة: ${productNames}`;

  function getHtmlContent() {
    return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"/><title>سند قبض - ${order.orderId}</title>
<style>${PRINT_STYLE}</style></head>
<body>
  <div class="cheque">
    <div class="cheque-header">
      <span class="title">سند قبض</span>
      <span class="no">No. #${order.orderId}</span>
    </div>
    <div class="cheque-body">
      <div class="field-row">
        <span class="field-label">المبلغ</span>
        <span class="field-value amount">${amount.toLocaleString("ar-SA")} <span class="amount-badge">${currency}</span></span>
      </div>
      <div class="field-row">
        <span class="field-label">استلمت من السيد</span>
        <span class="field-value">${order.customer}</span>
      </div>
      <div class="field-row">
        <span class="field-label">رقم الجوال</span>
        <span class="field-value">${order.whatsapp}</span>
      </div>
      <div class="field-row">
        <span class="field-label">العنوان</span>
        <span class="field-value">${order.address}</span>
      </div>
      <div class="field-row">
        <span class="field-label">وذلك عن</span>
        <span class="field-value">${aboutText}</span>
      </div>
      <div class="field-row">
        <span class="field-label">المبلغ بالحروف</span>
        <span class="field-value words">${amountWords} ${currency}</span>
      </div>
    </div>
    <div class="cheque-footer">
      <div class="sign-box"><div class="sign-line">الختم</div></div>
      <div class="sign-box"><div class="sign-line">توقيع المستلم</div></div>
    </div>
  </div>
</body></html>`;
  }

  function handlePrint() {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) {
      const blob = new Blob([getHtmlContent()], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `سند-قبض-${order.orderId}.html`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    const win = window.open("", "_blank", "width=760,height=620");
    if (!win) return;
    win.document.write(getHtmlContent());
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center" dir="rtl">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh]">

        {/* شريط التحكم */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 shrink-0 rounded-t-2xl sm:rounded-t-2xl">
          <span className="font-bold text-gray-700 text-sm">معاينة سند القبض</span>
          <div className="flex gap-2">
            <button onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              طباعة
            </button>
            <button onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
              إغلاق
            </button>
          </div>
        </div>

        {/* جسم السند - قابل للتمرير */}
        <div className="overflow-y-auto p-3 sm:p-5">
          <div className="border-2 border-gray-800 rounded-xl overflow-hidden">

            {/* هيدر الشيك */}
            <div className="bg-gray-900 text-white flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3">
              <span className="text-sm sm:text-base font-black tracking-wide">سند قبض</span>
              <span className="text-[11px] sm:text-xs opacity-70 font-mono">No. #{order.orderId}</span>
            </div>

            {/* حقول البيانات */}
            <div className="p-3 sm:p-4 space-y-2 sm:space-y-2.5">

              {/* المبلغ - بارز */}
              <div className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 text-gray-700 font-bold text-xs px-2 sm:px-3 flex items-center border-l border-gray-200 w-[90px] sm:w-[120px] shrink-0">
                  المبلغ
                </div>
                <div className="flex-1 px-2 sm:px-3 py-2 sm:py-2.5 flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black text-gray-900">{amount.toLocaleString("ar-SA")}</span>
                  <span className="bg-gray-900 text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded">{currency}</span>
                </div>
              </div>

              {[
                { label: "استلمت من السيد", value: order.customer },
                { label: "رقم الجوال", value: order.whatsapp },
                { label: "العنوان", value: order.address },
                { label: "وذلك عن", value: aboutText },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-stretch border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-100 text-gray-700 font-bold text-xs px-2 sm:px-3 flex items-center border-l border-gray-200 w-[90px] sm:w-[120px] shrink-0">
                    {label}
                  </div>
                  <div className="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-800 wrap-break-word min-w-0">{value}</div>
                </div>
              ))}

              {/* المبلغ بالحروف - مميز */}
              <div className="flex items-stretch border border-amber-300 rounded-lg overflow-hidden bg-amber-50">
                <div className="bg-amber-100 text-amber-800 font-bold text-xs px-2 sm:px-3 flex items-center border-l border-amber-300 w-[90px] sm:w-[120px] shrink-0">
                  المبلغ بالحروف
                </div>
                <div className="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-bold text-gray-900 wrap-break-word min-w-0">{amountWords} {currency}</div>
              </div>

            </div>

            {/* فوتر التوقيعات */}
            <div className="border-t-2 border-dashed border-gray-300 mx-3 sm:mx-4" />
            <div className="flex justify-between px-4 sm:px-6 py-4 sm:py-5">
              <div className="text-center">
                <div className="h-6 sm:h-8" />
                <div className="w-20 sm:w-28 border-t border-gray-800 pt-1.5 text-[10px] sm:text-[11px] text-gray-500">الختم</div>
              </div>
              <div className="text-center">
                <div className="h-6 sm:h-8" />
                <div className="w-24 sm:w-36 border-t border-gray-800 pt-1.5 text-[10px] sm:text-[11px] text-gray-500">توقيع المستلم</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
