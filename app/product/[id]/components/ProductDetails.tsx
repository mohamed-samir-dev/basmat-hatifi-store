import { IoCheckmarkCircle, IoCardOutline, IoDocumentTextOutline, IoSettingsOutline } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("ar-SA");

const specLabels: [keyof NonNullable<Product["specs"]>, string][] = [
  ["screen", "الشاشة"], ["processor", "المعالج"], ["ram", "الرام"], ["storage", "التخزين"],
  ["rearCamera", "الكاميرا الخلفية"], ["frontCamera", "الكاميرا الأمامية"],
  ["battery", "البطارية"], ["batteryLife", "عمر البطارية"], ["charging", "الشحن"],
  ["os", "نظام التشغيل"], ["extras", "مميزات إضافية"],
];

interface ProductDetailsProps {
  installment?: Product["installment"];
  description?: string;
  specs?: Product["specs"];
}

export default function ProductDetails({ installment, description, specs }: ProductDetailsProps) {
  return (
    <div className="mt-5 sm:mt-8 space-y-4 sm:space-y-5">
      {/* ── Installment ── */}
      {installment?.available && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600">
            <IoCardOutline size={18} className="text-white" />
            <h3 className="text-sm sm:text-base font-bold text-white">التقسيط</h3>
          </div>
          <div className="p-4 sm:p-5">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3.5 sm:p-4 mb-3 sm:mb-4 border border-emerald-100/60">
              <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                احصل عليه بأقساط شهرية
                {installment.downPayment ? ` تبدأ بدفعة ${fmt(installment.downPayment)} ر.س والباقي أقساط` : ""}
              </p>
              {installment.note && <p className="text-[11px] sm:text-xs text-emerald-600 mt-1">{installment.note}</p>}
            </div>
            {installment.policy && (
              <div className="text-center mb-3 sm:mb-4">
                <span className="inline-block text-xs sm:text-sm font-bold text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full border border-amber-100">
                  ♕ {installment.policy} ♕
                </span>
              </div>
            )}
            {installment.conditions && installment.conditions.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-700 mb-2.5">الشروط الواجب توفرها للتقديم</p>
                <div className="flex flex-col gap-2">
                  {installment.conditions.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                      <IoCheckmarkCircle size={15} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Description ── */}
      {description && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600">
            <IoDocumentTextOutline size={18} className="text-white" />
            <h3 className="text-sm sm:text-base font-bold text-white">الوصف</h3>
          </div>
          <div className="p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
          </div>
        </div>
      )}

      {/* ── Specs ── */}
      {specs && Object.values(specs).some(Boolean) && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600">
            <IoSettingsOutline size={18} className="text-white" />
            <h3 className="text-sm sm:text-base font-bold text-white">المواصفات</h3>
          </div>
          <div className="p-3 sm:p-5">
            <div className="rounded-xl overflow-hidden border border-gray-100">
              {specLabels.map(([key, label], i) =>
                specs[key] ? (
                  <div key={key} className={`flex text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 ${i % 2 === 0 ? "bg-teal-50/40" : "bg-white"}`}>
                    <span className="text-gray-500 font-medium w-28 sm:w-36 shrink-0">{label}</span>
                    <span className="text-gray-800 flex-1 min-w-0 wrap-break-word">{specs[key]}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
