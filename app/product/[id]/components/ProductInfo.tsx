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
    <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:sticky lg:top-[72px]">
      {/* ─── Price Card ─── */}
      <div className="relative bg-white rounded-2xl sm:rounded-[24px] md:rounded-[28px] overflow-hidden shadow-lg sm:shadow-xl shadow-black/[.04] border border-gray-100/50">
        {/* Top accent line */}
        <div className="h-[3px] sm:h-1 bg-gradient-to-l from-teal-500 via-emerald-500 to-teal-400" />

        <div className="p-4 sm:p-5 md:p-7">
          {/* Stock + Brand */}
          <div className="flex items-center justify-between mb-4 sm:mb-5 gap-2">
            <div className={`inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] md:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl ${
              inStock
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100/60"
                : "bg-red-50 text-red-500 border border-red-100/60"
            }`}>
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${inStock ? "bg-emerald-400" : "bg-red-400"}`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
              </span>
              {inStock ? "متوفر الآن" : "غير متوفر"}
            </div>
            {brand && (
              <span className="text-[9px] sm:text-[10px] md:text-[11px] font-extrabold text-white bg-gradient-to-l from-teal-600 to-emerald-600 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl tracking-wide uppercase shadow-sm shrink-0">
                {brand}
              </span>
            )}
          </div>

          {/* Name (mobile/tablet only - desktop shows in hero) */}
          <h2 className="lg:hidden text-base sm:text-lg md:text-xl font-black text-gray-900 leading-relaxed mb-3 sm:mb-4">{name}</h2>

          {/* Tags (mobile/tablet only) */}
          {(color || storage || network) && (
            <div className="lg:hidden flex gap-1.5 sm:gap-2 mb-4 sm:mb-5 flex-wrap">
              {[color, storage, network].filter(Boolean).map((t, i) => (
                <span key={i} className="text-[10px] sm:text-[11px] font-semibold text-gray-500 bg-gray-50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-gray-100">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Price Section */}
          <div className="relative bg-gradient-to-l from-slate-50/80 via-gray-50/60 to-slate-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-5">
            {hasDiscount ? (
              <div className="space-y-2 sm:space-y-2.5">
                <div className="flex items-baseline gap-1.5 sm:gap-2">
                  <span className="text-[1.6rem] sm:text-[2rem] md:text-[2.5rem] font-black text-gray-900 leading-none tracking-tight">{fmt(salePrice)}</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-400">ر.س</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                  <span className="text-xs sm:text-sm text-gray-400 line-through decoration-gray-300">{fmt(originalPrice)} ر.س</span>
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-extrabold text-white bg-gradient-to-l from-rose-500 to-red-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg shadow-sm shadow-red-200/50">
                    خصم {savingsPercent}% • وفّر {fmt(originalPrice - salePrice)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="text-[1.6rem] sm:text-[2rem] md:text-[2.5rem] font-black text-gray-900 leading-none tracking-tight">{fmt(originalPrice)}</span>
                <span className="text-xs sm:text-sm font-bold text-gray-400">ر.س</span>
              </div>
            )}
            {taxIncluded && <p className="text-[9px] sm:text-[10px] text-gray-400 mt-2 sm:mt-2.5">شامل ضريبة القيمة المضافة</p>}
          </div>

          {/* Installment */}
          {installment?.available && (
            <div className="bg-gradient-to-l from-amber-50/80 to-orange-50/50 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 sm:py-4 border border-amber-100/50 mb-4 sm:mb-5">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0 shadow-sm">
                  <IoFlash size={14} className="text-amber-600 sm:hidden" />
                  <IoFlash size={17} className="text-amber-600 hidden sm:block" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs md:text-sm text-amber-800 font-bold truncate">
                    تقسيط متاح {installment.downPayment ? `• مقدم ${fmt(installment.downPayment)} ر.س` : ""}
                  </p>
                  {installment.note && <p className="text-[9px] sm:text-[10px] text-amber-600/70 mt-0.5 truncate">{installment.note}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Cart Button (Desktop) */}
          <div className="hidden lg:block">
            {!addedToCart ? (
              <button
                onClick={onAddToCart}
                className="group w-full relative overflow-hidden bg-gradient-to-l from-teal-600 via-teal-600 to-emerald-600 text-white font-bold text-sm md:text-base py-4 md:py-[18px] rounded-xl md:rounded-2xl flex items-center justify-center gap-2.5 sm:gap-3 transition-all shadow-xl shadow-teal-600/20 hover:shadow-2xl hover:shadow-teal-600/30 active:scale-[.98]"
              >
                <span className="absolute inset-0 bg-gradient-to-l from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <IoCartOutline size={20} className="relative transition-transform group-hover:scale-110 group-hover:-rotate-6 md:hidden" />
                <IoCartOutline size={22} className="relative transition-transform group-hover:scale-110 group-hover:-rotate-6 hidden md:block" />
                <span className="relative">أضف للسلة</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2.5 sm:gap-3">
                <div className="flex items-center justify-center gap-2 sm:gap-2.5 text-emerald-700 bg-emerald-50 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-emerald-200/60">
                  <IoCheckmarkDoneCircle size={18} className="sm:hidden" />
                  <IoCheckmarkDoneCircle size={20} className="hidden sm:block" />
                  <span className="text-xs sm:text-sm font-bold">تمت الإضافة للسلة بنجاح</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    onClick={() => router.back()}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-lg sm:rounded-xl border border-gray-200/60 transition-colors"
                  >
                    متابعة التسوق
                  </button>
                  <button
                    onClick={() => router.push("/cart")}
                    className="bg-gradient-to-l from-teal-600 to-emerald-600 text-white font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 shadow-md shadow-teal-200/40 transition-all hover:shadow-lg"
                  >
                    <IoBagCheckOutline size={14} className="sm:hidden" />
                    <IoBagCheckOutline size={16} className="hidden sm:block" />
                    عرض السلة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Trust Features Grid ─── */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {[
          { icon: IoCarOutline, label: freeDelivery ? "توصيل مجاني" : "توصيل مدفوع", sub: deliveryTime, bg: "bg-teal-50", iconColor: "text-teal-600" },
          { icon: IoShieldCheckmark, label: "ضمان حاسبات العرب", sub: "سنتين", bg: "bg-blue-50", iconColor: "text-blue-600" },
          { icon: IoStorefront, label: inStock ? "متوفر بالمخزون" : "غير متوفر", sub: null, bg: inStock ? "bg-emerald-50" : "bg-red-50", iconColor: inStock ? "text-emerald-600" : "text-red-500" },
          { icon: IoTimeOutline, label: "شحن سريع", sub: "خلال 24-48 ساعة", bg: "bg-violet-50", iconColor: "text-violet-600" },
        ].map((f, i) => (
          <div key={i} className="group bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${f.bg} flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <f.icon size={16} className={`${f.iconColor} sm:hidden`} />
              <f.icon size={19} className={`${f.iconColor} hidden sm:block`} />
            </div>
            <p className="text-[10px] sm:text-[11px] md:text-xs font-bold text-gray-800 leading-snug">{f.label}</p>
            {f.sub && <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 mt-0.5 sm:mt-1">{f.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
