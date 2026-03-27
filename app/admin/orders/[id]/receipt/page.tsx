"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

interface OrderItem { name: string; }
interface ReceiptData {
  order: { orderId: string; installmentType: string; downPayment: number; total: number; customer: string; whatsapp: string; address: string; items: OrderItem[]; };
  company: { currencyAr?: string; header?: string; footer?: string; stamp?: string; };
}

export default function ReceiptPrintPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ReceiptData | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/orders/${id}/invoice`).then((r) => r.json()),
    ]).then(([d]) => setData(d));
  }, [id]);

  useEffect(() => {
    if (data) setTimeout(() => window.print(), 500);
  }, [data]);

  if (!data) return <div style={{ textAlign: "center", padding: 40 }}>جاري التحميل...</div>;

  const { order, company } = data;
  const currency = company.currencyAr || "ريال";
  const amount = order.installmentType === "installment" ? order.downPayment : order.total;
  const amountWords = toArabicWords(amount) + " فقط لا غير";
  const aboutPrefix = `قيمة ${order.installmentType === "installment" ? "دفعة من " : ""}ثمن جهاز/أجهزة:`;
  const aboutItems = order.items.map((i: OrderItem) => i.name);

  const style = `
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: Arial, sans-serif; background: #fff; direction: rtl; padding: 24px; }
    @media print { body { padding: 0; } }
    ul { list-style: disc; padding-right: 20px !important; margin-top: 4px !important; }
    li { list-style: disc; }
  `;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: 24, maxWidth: 700, margin: "0 auto" }} dir="rtl">
      <style>{style}</style>
{/* header image*/}
      {company.header && (
        <img src={company.header} alt="header" style={{ width: "100%", marginBottom: 16 }} />
      )}

      {/* receipt box */}
      <div style={{ border: "2px solid #808080", borderRadius: 8, marginBottom: 16, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#808080", padding: "1px 50px", borderRadius: "0 0 6px 6px" }}>
            <span style={{ fontSize: 20, fontWeight: "bold", color: "#000000" }}>سند قبض</span>
          </div>
        </div>
        <span style={{ position: "absolute", top: 10, left: 16, fontSize: 16, fontWeight: "bold",color:"#990431" }}>No. #{order.orderId}</span>
        <div style={{ padding: "16px 20px" }}>
          <table style={{ borderCollapse: "collapse", fontSize: 15, width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", backgroundColor: "#808080",color:"#000000", fontWeight: "bold", whiteSpace: "nowrap" }}>المبلغ</td>
                <td style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", whiteSpace: "nowrap" }}>{amount}</td>
                <td style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", whiteSpace: "nowrap" }}>{currency}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", backgroundColor: "#808080",color:"#000000", fontWeight: "bold", whiteSpace: "nowrap" }}>استلمت من السيد</td>
                <td colSpan={2} style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", whiteSpace: "nowrap" }}>{order.customer}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", backgroundColor: "#808080",color:"#000000", fontWeight: "bold", whiteSpace: "nowrap" }}>رقم الجوال</td>
                <td colSpan={2} style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", whiteSpace: "nowrap" }}>{order.whatsapp}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", backgroundColor: "#808080",color:"#000000", fontWeight: "bold", whiteSpace: "nowrap" }}>العنوان</td>
                <td colSpan={2} style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", whiteSpace: "nowrap" }}>{order.address}</td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", backgroundColor: "#808080",color:"#000000", fontWeight: "bold", whiteSpace: "nowrap" }}>وذلك عن</td>
                <td colSpan={2} style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center" }}>
                  {aboutPrefix}
                  <ul style={{ margin: "4px 0 0 0", paddingRight: 20, textAlign: "right" }}>
                    {aboutItems.map((name: string, idx: number) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </td>
              </tr>
              <tr>
                <td style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center", backgroundColor: "#808080",color:"#000000", fontWeight: "bold", whiteSpace: "nowrap" }}>المبلغ بالحروف</td>
                <td colSpan={2} style={{ border: "1px solid #aaa", padding: "2px 12px", textAlign: "center" }}>{amountWords}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ border: "1px solid #aaa", borderRadius: 6, marginTop: 24, display: "flex", justifyContent: "space-between", padding: "12px 24px", minHeight: 80 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold", marginBottom: 8 }}>توقيع المستلم</div>
              <div style={{ borderBottom: "1px solid #aaa", width: 120, marginTop: 32 }}></div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: "bold", marginBottom: 8 }}>الختم</div>
              {company.stamp && <img src={company.stamp} alt="ختم" style={{ maxWidth: 100, maxHeight: 80, objectFit: "contain" }} />}
            </div>
          </div>
        </div>
      </div>

      {/* footer image*/}
      {company.footer && (
        <img src={company.footer} alt="footer" style={{ width: "100%" }} />
      )}
    </div>
  );
}
