"use client";
import { useEffect, useState } from "react";

type OrderItem = { productId: string; name: string; price: number; quantity: number };
type Order = {
  _id: string; orderId: string; customer: string; whatsapp: string;
  address: string; installmentType: "installment" | "full"; months: number;
  monthlyPayment: number; total: number; downPayment: number;
  items: OrderItem[]; createdAt: string;
};
type Company = { nameAr: string; currencyAr: string; phone: string };

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

export default function InstallmentContract({ orderId, onClose }: { orderId: string; onClose: () => void }) {
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
  const remaining = order.total - (order.downPayment || 0);
  const monthly = order.monthlyPayment || (order.months > 0 ? Math.ceil(remaining / order.months) : remaining);

  const now = new Date(order.createdAt);
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const dayName = days[now.getDay()];
  const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getDate()).padStart(2, "0")}`;

  // تاريخ أول قسط (شهر بعد تاريخ الطلب)
  const firstPayment = new Date(now);
  firstPayment.setMonth(firstPayment.getMonth() + 1);
  const firstPaymentStr = `${firstPayment.getFullYear()}/${String(firstPayment.getMonth() + 1).padStart(2, "0")}/${String(firstPayment.getDate()).padStart(2, "0")}`;

  const productNames = order.items.map((i) => i.name).join("، ");

  function getHtmlContent(): string {
    const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8"/>
  <title>عقد تقسيط - ${order.orderId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: "Arial", sans-serif; font-size: 14px; color: #1a1a1a; padding: 40px 50px; direction: rtl; line-height: 2; }
    .title { text-align: center; font-size: 22px; font-weight: 900; margin-bottom: 6px; letter-spacing: 1px; }
    .subtitle { text-align: center; font-size: 13px; color: #555; margin-bottom: 28px; }
    .divider { border: none; border-top: 2px solid #1a1a1a; margin: 16px 0; }
    .row { display: flex; gap: 6px; margin-bottom: 10px; font-size: 14px; }
    .label { font-weight: 700; white-space: nowrap; }
    .value { flex: 1; min-width: 120px; }
    .body-text { font-size: 14px; line-height: 2.2; margin: 18px 0; text-align: justify; }
    .sign-row { display: flex; justify-content: space-between; margin-top: 50px; }
    .sign-box { text-align: center; width: 180px; }
    .sign-line { border-top: 1px solid #1a1a1a; margin-top: 40px; padding-top: 6px; font-size: 12px; color: #555; }
    @media print { body { padding: 20px 30px; } }
  </style>
</head>
<body>
  <div class="title">عقد بيع بالتقسيط</div>
  <div class="subtitle">${company.nameAr || ""}</div>
  <hr class="divider"/>

  <div class="row"><span class="label">اليوم :</span><span class="value">${dayName}</span></div>
  <div class="row"><span class="label">التاريخ :</span><span class="value">${dateStr}</span></div>
  <div class="row"><span class="label">${company.nameAr || "المؤسسة"} برقم جوال :/</span><span class="value">${company.phone || ""}</span><span class="label">وعنوانه :/</span><span class="value">${""}</span></div>

  <hr class="divider"/>

  <div class="body-text">
    نعم أنا السيد :/ <strong>${order.customer}</strong><br/>
    أُقر وأعترف وأنا في حالتي الشرعية وبكامل قواي العقلية بأني في ذمتي للمؤسسة المدعوة :/ <strong>${company.nameAr}</strong><br/>
    مبلغ وقدره :/ <strong>${remaining.toLocaleString("ar-SA")} ( ${toArabicWords(remaining)} ) ${currency} فقط.</strong><br/>
    وذلك قيمة عن ما تبقى من ثمن جهاز/أجهزة :/ <strong>${productNames}</strong><br/><br/>
    على أن يُدفع المبلغ على أقساط شهرية متتالية ومستمرة بدون انقطاع بما فيها شهر رمضان والأعياد<br/>
    قيمة الدفعة الشهرية :/ <strong>${monthly.toLocaleString("ar-SA")} ( ${toArabicWords(monthly)} ) ${currency} فقط</strong> اعتباراً من تاريخ :/ <strong>${firstPaymentStr}</strong><br/><br/>
    نهاية المبلغ المذكور أعلاه وأنني بسداد الأقساط في موعدها بدون تأخر عن أي قسط عن موعده المحدد فإني ملتزم التزاماً
    تاماً بسداد المبلغ المتبقي كاملاً دفعة واحدة.<br/><br/>
    كما أنني أُقر على نفسي بأنه لا يوجد التزامات مالية ولا كفالات غرامية وقد أذنت والله خير الشاهدين لاسم :/ <strong>${order.customer}</strong>
  </div>

  <hr class="divider"/>

  <div class="sign-row">
    <div class="sign-box">
      <div class="sign-line">التوقيع :/ ........................</div>
    </div>
    <div class="sign-box">
      <div class="sign-line">الختم</div>
    </div>
  </div>
</body>
</html>`;
    return html;
  }

  function handlePrint() {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile) {
      const blob = new Blob([getHtmlContent()], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `عقد-تقسيط-${order.orderId}.html`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    win.document.write(getHtmlContent());
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 600);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 overflow-y-auto py-4 px-2 sm:py-6 sm:px-4" dir="rtl">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">

        {/* شريط التحكم */}
        <div className="flex items-center justify-between px-3 py-3 sm:px-5 bg-gray-50 border-b border-gray-200">
          <span className="text-xs sm:text-sm font-bold text-gray-700">معاينة عقد التقسيط</span>
          <div className="flex gap-2">
            <button onClick={handlePrint}
              className="bg-purple-500 hover:bg-purple-600 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              طباعة
            </button>
            <button onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-lg transition-colors">
              إغلاق
            </button>
          </div>
        </div>

        {/* محتوى العقد */}
        <div className="p-4 sm:p-8 font-[Arial] text-[13px] sm:text-[14px] leading-loose text-gray-900">
          <h2 className="text-center text-lg sm:text-xl font-black mb-1 tracking-wide">عقد بيع بالتقسيط</h2>
          <p className="text-center text-xs text-gray-500 mb-4 sm:mb-6">{company.nameAr}</p>
          <hr className="border-gray-800 mb-3 sm:mb-4"/>

          <div className="flex gap-2 mb-2"><span className="font-bold whitespace-nowrap">اليوم :</span><span className="flex-1">{dayName}</span></div>
          <div className="flex gap-2 mb-2"><span className="font-bold whitespace-nowrap">التاريخ :</span><span className="flex-1">{dateStr}</span></div>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-2 mb-2">
            <span className="font-bold">{company.nameAr} برقم جوال :/</span>
            <span className="sm:flex-1">{company.phone}</span>
            <span className="font-bold">وعنوانه :/</span>
            <span className="sm:flex-1"></span>
          </div>

          <hr className="border-gray-800 my-3 sm:my-4"/>

          <p className="text-justify leading-[2.2] sm:leading-[2.4]">
            نعم أنا السيد :/ <strong>{order.customer}</strong><br/>
            أُقر وأعترف وأنا في حالتي الشرعية وبكامل قواي العقلية بأني في ذمتي للمؤسسة المدعوة :/ <strong>{company.nameAr}</strong><br/>
            مبلغ وقدره :/ <strong>{remaining.toLocaleString("ar-SA")} ( {toArabicWords(remaining)} ) {currency} فقط.</strong><br/>
            وذلك قيمة عن ما تبقى من ثمن جهاز/أجهزة :/ <strong>{productNames}</strong><br/>
            على أن يُدفع المبلغ على أقساط شهرية متتالية ومستمرة بدون انقطاع بما فيها شهر رمضان والأعياد<br/>
            قيمة الدفعة الشهرية :/ <strong>{monthly.toLocaleString("ar-SA")} ( {toArabicWords(monthly)} ) {currency} فقط</strong> اعتباراً من تاريخ :/ <strong>{firstPaymentStr}</strong><br/>
            نهاية المبلغ المذكور أعلاه وأنني بسداد الأقساط في موعدها بدون تأخر عن أي قسط عن موعده المحدد فإني ملتزم التزاماً تاماً بسداد المبلغ المتبقي كاملاً دفعة واحدة.<br/>
            كما أنني أُقر على نفسي بأنه لا يوجد التزامات مالية ولا كفالات غرامية وقد أذنت والله خير الشاهدين لاسم :/ <strong>{order.customer}</strong>
          </p>

          <hr className="border-gray-800 mt-4 sm:mt-6 mb-6 sm:mb-10"/>

          <div className="flex justify-between mt-8 sm:mt-12">
            <div className="text-center w-32 sm:w-44">
              <div className="border-t border-gray-800 pt-2 text-xs text-gray-500">التوقيع :/ ........................</div>
            </div>
            <div className="text-center w-32 sm:w-44">
              <div className="border-t border-gray-800 pt-2 text-xs text-gray-500">الختم</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
