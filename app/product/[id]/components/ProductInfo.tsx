"use client";

import { useRouter } from "next/navigation";
import {
  IoCartOutline,
  IoShieldCheckmark,
  IoTimeOutline,
  IoCarOutline,
  IoCheckmarkDoneCircle,
  IoFlash,
  IoStorefront,
  IoBagCheckOutline,
} from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("en-US");

interface ProductInfoProps {
  product: Product;
  addedToCart: boolean;
  onAddToCart: () => void;
}

export default function ProductInfo({ product, addedToCart, onAddToCart }: ProductInfoProps) {
  const router = useRouter();
  const { name, brand, color, storage, network, salePrice, taxIncluded, installment, freeDelivery, deliveryTime, inStock } = product;
  const originalPrice = product.originalPrice || product.price || 0;
  const hasDiscount = salePrice != null && salePrice > 0 && salePrice < originalPrice;
  const savingsPercent = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* ─── Main Card ─── */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-black/[.05] border border-gray-100/60 relative overflow-hidden">
        {/* Subtle corner accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-gradient-to-br from-teal-50 to-transparent rounded-full pointer-events-none" />

        <div className="relative">
          {/* Stock + Brand row */}
          <div className="flex items-center justify-between mb-5">
            <div className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 rounded-xl ${
              inStock
                ? "bg-emerald-50/80 text-emerald-600 border border-emerald-100/60"
                : "bg-red-50/80 text-red-500 border border-red-100/60"
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${inStock ? "bg-emerald-400" : "bg-red-400"}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
              </span>
              {inStock ? "متوفر الآن" : "غير متوفر"}
            </div>
            {brand && (
              <span className="text-[11px] sm:text-xs font-bold text-teal-700 bg-teal-50/80 px-3.5 py-2 rounded-xl border border-teal-100/60">
                {brand}
              </span>
            )}
          </div>

          {/* Name */}
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-gray-900 leading-relaxed mb-3">{name}</h2>

          {/* Tags */}
          {(color || storage || network) && (
            <div className="flex gap-2 mb-6 flex-wrap">
              {[color, storage, network].filter(Boolean).map((t, i) => (
                <span key={i} className="text-[11px] sm:text-xs font-semibold text-gray-500 bg-gray-50 px-3.5 py-1.5 rounded-xl border border-gray-100">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-l from-transparent via-gray-200/80 to-transparent mb-6" />

          {/* Price */}
          <div className="mb-1">
            {hasDiscount ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-[2rem] sm:text-4xl font-black text-gray-900 leading-none tracking-tight">{fmt(salePrice)}</span>
                  <span className="text-sm font-bold text-gray-400 mb-0.5">ر.س</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-sm text-gray-400 line-through decoration-gray-300">{fmt(originalPrice)} ر.س</span>
                  <span className="text-[11px] font-extrabold text-white bg-gradient-to-l from-rose-500 to-red-500 px-3 py-1 rounded-lg shadow-sm shadow-red-200">
                    {savingsPercent}%- وفّر {fmt(originalPrice - salePrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-[2rem] sm:text-4xl font-black text-gray-900 leading-none tracking-tight">{fmt(originalPrice)}</span>
                <span className="text-sm font-bold text-gray-400 mb-0.5">ر.س</span>
              </div>
            )}
          </div>
          {taxIncluded && <p className="text-[11px] text-gray-400 mt-2">شامل ضريبة القيمة المضافة</p>}

          {/* Installment */}
          {installment?.available && (
            <div className="mt-5 bg-gradient-to-l from-emerald-50/80 to-teal-50/60 rounded-2xl px-4 py-4 border border-emerald-100/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shrink-0 shadow-sm">
                  <IoFlash size={17} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-emerald-800 font-bold">
                    تقسيط متاح {installment.downPayment ? `• مقدم ${fmt(installment.downPayment)} ر.س` : ""}
                  </p>
                  {installment.note && <p className="text-[11px] text-emerald-600/80 mt-0.5">{installment.note}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Features ─── */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: IoCarOutline, label: freeDelivery ? "توصيل مجاني" : "توصيل مدفوع", sub: deliveryTime, color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100/50" },
          { icon: IoShieldCheckmark, label: "ضمان حاسبات العرب", sub: "سنتين", color: "text-sky-600", bg: "bg-sky-50", border: "border-sky-100/50" },
          { icon: IoStorefront, label: inStock ? "متوفر بالمخزون" : "غير متوفر", sub: null, color: inStock ? "text-emerald-600" : "text-red-500", bg: inStock ? "bg-emerald-50" : "bg-red-50", border: inStock ? "border-emerald-100/50" : "border-red-100/50" },
          { icon: IoTimeOutline, label: "شحن سريع", sub: "خلال 24-48 ساعة", color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100/50" },
        ].map((f, i) => (
          <div key={i} className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100/60 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}>
            <div className={`w-10 h-10 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center shrink-0`}>
              <f.icon size={18} className={f.color} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-gray-800 leading-snug">{f.label}</p>
              {f.sub && <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">{f.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Cart ─── */}
      <div className="hidden lg:block">
        {!addedToCart ? (
          <button
            onClick={onAddToCart}
            className="group w-full relative overflow-hidden bg-gradient-to-l from-teal-600 via-teal-600 to-emerald-600 text-white font-bold text-sm sm:text-base py-4.5 sm:py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-teal-600/20 hover:shadow-2xl hover:shadow-teal-600/30 active:scale-[.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <IoCartOutline size={22} className="relative transition-transform group-hover:scale-110 group-hover:-rotate-6" />
            <span className="relative">أضف للسلة</span>
          </button>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center gap-2.5 text-emerald-700 bg-emerald-50 py-4 rounded-2xl border border-emerald-200/60">
              <IoCheckmarkDoneCircle size={20} />
              <span className="text-sm font-bold">تمت الإضافة للسلة بنجاح</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.back()}
                className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm py-3.5 rounded-xl border border-gray-200/60 transition-colors"
              >
                متابعة التسوق
              </button>
              <button
                onClick={() => router.push("/cart")}
                className="bg-gradient-to-l from-teal-600 to-emerald-600 text-white font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-teal-200/40 transition-all hover:shadow-lg"
              >
                <IoBagCheckOutline size={16} />
                عرض السلة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
