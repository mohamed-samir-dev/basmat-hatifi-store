"use client";

import { useState, useMemo } from "react";
import { IoPersonOutline, IoCardOutline, IoLogoWhatsapp, IoCalendarOutline } from "react-icons/io5";
import type { CustomerInfo } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

interface CustomerFormProps {
  total: number;
  itemCount: number;
  initialData?: CustomerInfo | null;
  installmentMonths?: number;
  onSubmit: (info: CustomerInfo) => void;
}

export default function CustomerForm({ total, itemCount, initialData, installmentMonths, onSubmit }: CustomerFormProps) {
  const MONTHS_OPTIONS = Array.from({ length: installmentMonths ?? 24 }, (_, i) => i + 1);
  const minDownPayment = 1000 * itemCount;
  const DOWN_PAYMENT_OPTIONS = [minDownPayment, minDownPayment + 500, minDownPayment + 1000];
  const [name, setName] = useState(initialData?.name ?? "");
  const [nationalId, setNationalId] = useState(initialData?.nationalId ?? "");
  const [whatsapp, setWhatsapp] = useState(initialData?.whatsapp ?? "");
  const [address, setAddress] = useState(initialData?.address ?? "");
  const [installmentType, setInstallmentType] = useState<"full" | "installment">(initialData?.installmentType ?? "installment");
  const [months, setMonths] = useState(initialData?.months ?? 24);
  const [downPaymentExtra, setDownPaymentExtra] = useState<number>(0);
  const downPayment = minDownPayment + downPaymentExtra;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const monthlyPayment = useMemo(() => {
    if (installmentType === "full") return 0;
    const remaining = total - downPayment;
    return remaining > 0 ? Math.ceil(remaining / months) : 0;
  }, [total, months, installmentType, downPayment]);

  const schedule = useMemo(() => {
    const now = new Date();
    return Array.from({ length: months }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() + i + 1, now.getDate());
      return {
        index: i + 1,
        date: `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`,
        amount: monthlyPayment,
      };
    });
  }, [months, monthlyPayment]);

  const inputClass = (field: string) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none transition placeholder:text-gray-400 ${
      errors[field]
        ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-200 bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
    }`;

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "مطلوب";
    if (!nationalId.trim()) newErrors.nationalId = "مطلوب";
    else if (nationalId.trim().length !== 10) newErrors.nationalId = "رقم الهوية يجب أن يكون 10 أرقام";
    if (!whatsapp.trim()) newErrors.whatsapp = "مطلوب";
    else if (!/^05\d{8}$/.test(whatsapp.trim())) newErrors.whatsapp = "يبدأ بـ 05 ويتكون من 10 أرقام";
    if (!address.trim()) newErrors.address = "مطلوب";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ name, nationalId, whatsapp, address, installmentType, months, downPayment });
    }
  };

  return (
    <>
      {/* ── Personal Info ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <IoPersonOutline size={15} className="text-teal-600" />
          <span className="text-xs sm:text-sm font-bold text-gray-700">المعلومات الشخصية</span>
        </div>
        <div className="p-3 sm:p-4 space-y-3">
          <Field label="الاسم كاملاً" error={errors.name}>
            <input value={name} onChange={(e) => { setName(e.target.value.replace(/[^a-zA-Z\u0600-\u06FF\s]/g, "")); setErrors((p) => ({ ...p, name: "" })); }} placeholder="محمد أحمد" className={inputClass("name")} />
          </Field>
          <Field label="رقم الهوية / الإقامة" error={errors.nationalId}>
            <input value={nationalId} onChange={(e) => { setNationalId(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); setErrors((p) => ({ ...p, nationalId: "" })); }} placeholder="10XXXXXXXX" maxLength={10} className={inputClass("nationalId")} />
          </Field>
        </div>
      </div>

      {/* ── Contact Info ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-3">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <IoLogoWhatsapp size={15} className="text-teal-600" />
          <span className="text-xs sm:text-sm font-bold text-gray-700">معلومات التواصل</span>
        </div>
        <div className="p-3 sm:p-4 space-y-3">
          <Field label="رقم الواتساب" error={errors.whatsapp}>
            <input type="tel" value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value.replace(/[^0-9]/g, "").slice(0, 10)); setErrors((p) => ({ ...p, whatsapp: "" })); }} placeholder="05XXXXXXXX" className={inputClass("whatsapp")} dir="ltr" />
          </Field>
          <Field label="العنوان" error={errors.address}>
            <input value={address} onChange={(e) => { setAddress(e.target.value); setErrors((p) => ({ ...p, address: "" })); }} placeholder="المدينة - الحي - الشارع" className={inputClass("address")} />
          </Field>
        </div>
      </div>

      {/* ── Payment Method ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-3">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
          <IoCardOutline size={15} className="text-teal-600" />
          <span className="text-xs sm:text-sm font-bold text-gray-700">طريقة الدفع</span>
        </div>
        <div className="p-3 sm:p-4 space-y-3">
          {/* Payment type cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setInstallmentType("full")}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                installmentType === "full"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className={`text-xs sm:text-sm font-bold ${installmentType === "full" ? "text-teal-700" : "text-gray-600"}`}>سداد كامل</p>
              <p className={`text-[10px] sm:text-xs mt-0.5 ${installmentType === "full" ? "text-teal-600" : "text-gray-400"}`}>دفع المبلغ مرة واحدة</p>
            </button>
            <button
              type="button"
              onClick={() => setInstallmentType("installment")}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                installmentType === "installment"
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p className={`text-xs sm:text-sm font-bold ${installmentType === "installment" ? "text-teal-700" : "text-gray-600"}`}>تقسيط</p>
              <p className={`text-[10px] sm:text-xs mt-0.5 ${installmentType === "installment" ? "text-teal-600" : "text-gray-400"}`}>أقساط شهرية مريحة</p>
            </button>
          </div>

          {installmentType === "installment" && (
            <div className="space-y-3 pt-1">
              <Field label="عدد الأشهر">
                <select
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 bg-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition cursor-pointer"
                >
                  {MONTHS_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m} شهر</option>
                  ))}
                </select>
              </Field>

              <Field label="الدفعة الأولى">
                <select
                  value={String(downPaymentExtra)}
                  onChange={(e) => setDownPaymentExtra(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-900 bg-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition cursor-pointer"
                >
                  {DOWN_PAYMENT_OPTIONS.map((v) => (
                    <option key={v} value={v - minDownPayment}>{fmt(v)} ر.س</option>
                  ))}
                  <option value={total - minDownPayment}>الدفع بالكامل ({fmt(total)} ر.س)</option>
                </select>
              </Field>

              {/* Monthly payment highlight */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-xl p-3 sm:p-4 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-teal-700">القسط الشهري</span>
                <span className="text-base sm:text-lg font-black text-teal-700">{fmt(monthlyPayment)} <span className="text-xs font-medium text-teal-600/70">ر.س</span></span>
              </div>

              {/* Schedule table */}
              {months > 0 && (
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                    <IoCalendarOutline size={14} className="text-teal-600" />
                    <span className="text-xs font-bold text-gray-600">جدول الأقساط</span>
                  </div>
                  <div className="max-h-52 overflow-y-auto scrollbar-visible">
                    <table className="w-full text-xs sm:text-sm">
                      <thead className="sticky top-0">
                        <tr className="bg-gray-50/90 backdrop-blur-sm">
                          <th className="py-2 px-3 text-right font-bold text-gray-500 w-12">#</th>
                          <th className="py-2 px-3 text-right font-bold text-gray-500">التاريخ</th>
                          <th className="py-2 px-3 text-right font-bold text-gray-500">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((row, i) => (
                          <tr key={row.index} className={`${i % 2 === 0 ? "bg-white" : "bg-teal-50/30"} border-t border-gray-50`}>
                            <td className="py-2 px-3 text-gray-400 font-bold">{row.index}</td>
                            <td className="py-2 px-3 text-gray-700">{row.date}</td>
                            <td className="py-2 px-3 font-bold text-gray-900">{fmt(row.amount)} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Submit ── */}
      <button
        onClick={handleSubmit}
        className="w-full mt-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] text-white font-bold py-3.5 sm:py-4 rounded-2xl transition-all text-sm sm:text-base shadow-lg shadow-teal-200/50"
      >
        متابعة الطلب
      </button>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
        {label} {error !== undefined && <span className="text-red-400 text-[10px]">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-[11px] font-bold mt-1">{error}</p>}
    </div>
  );
}
