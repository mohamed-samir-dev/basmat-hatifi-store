"use client";

import { useRouter } from "next/navigation";
import { IoCartOutline, IoCheckmarkCircle, IoShieldCheckmark, IoTimeOutline, IoCarOutline, IoCheckmarkDoneCircle, IoBagCheckOutline } from "react-icons/io5";
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
  const originalPrice = product.originalPrice ?? 0;
  const hasDiscount = salePrice != null && salePrice > 0 && salePrice < originalPrice;

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* ── Name & Tags ── */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm">
        {brand && (
          <span className="inline-block text-[11px] sm:text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg mb-2">
            {brand}
          </span>
        )}
        <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-gray-900 leading-relaxed">{name}</h2>
        {(color || storage || network) && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {[color, storage, network].filter(Boolean).map((t, i) => (
              <span key={i} className="text-[11px] sm:text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── Price ── */}
      <div className="bg-gradient-to-br from-white to-teal-50/50 rounded-2xl border border-teal-100/60 p-4 sm:p-6 shadow-sm">
        <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-2xl sm:text-3xl font-black text-teal-700">{fmt(salePrice)}</span>
              <span className="text-sm sm:text-base font-bold text-teal-600/70">ر.س</span>
              <span className="text-sm sm:text-base text-gray-400 line-through mr-1">{fmt(originalPrice)} ر.س</span>
              <span className="text-[10px] sm:text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-lg">
                وفّر {fmt(originalPrice - salePrice)} ر.س
              </span>
            </>
          ) : (
            <>
              <span className="text-2xl sm:text-3xl font-black text-teal-700">{fmt(originalPrice)}</span>
              <span className="text-sm sm:text-base font-bold text-teal-600/70">ر.س</span>
            </>
          )}
        </div>
        {taxIncluded && <p className="text-[11px] sm:text-xs text-gray-400 mt-1.5">شامل الضريبة</p>}
        {installment?.available && (
          <div className="flex items-center gap-1.5 mt-3 bg-emerald-50 px-3 py-2 rounded-xl">
            <span className="text-sm">💳</span>
            <p className="text-[11px] sm:text-xs text-emerald-700 font-semibold">
              تقسيط متاح {installment.downPayment ? `- مقدم ${fmt(installment.downPayment)} ر.س` : ""} {installment.note || ""}
            </p>
          </div>
        )}
      </div>

      {/* ── Features Grid ── */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {[
          {
            icon: <IoCarOutline size={20} className="text-teal-500" />,
            title: freeDelivery ? "توصيل مجاني" : "توصيل مدفوع",
            sub: deliveryTime,
          },
          {
            icon: <IoShieldCheckmark size={20} className="text-teal-500" />,
            title: "ضمان حاسبات العرب سنتين",
          },
          {
            icon: <IoCheckmarkCircle size={20} className={inStock ? "text-emerald-500" : "text-red-400"} />,
            title: inStock ? "متوفر في المخزون" : "غير متوفر حالياً",
          },
          {
            icon: <IoTimeOutline size={20} className="text-teal-500" />,
            title: "شحن سريع",
          },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 px-3 sm:px-4 py-3 sm:py-3.5 flex items-center gap-2.5 sm:gap-3 shadow-sm hover:border-teal-200 hover:shadow-md transition-all duration-200">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-bold text-gray-700 truncate">{item.title}</p>
              {item.sub && <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">{item.sub}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* ── Cart Actions ── */}
      {!addedToCart ? (
        <button
          onClick={onAddToCart}
          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm sm:text-base py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-teal-200/50 hover:shadow-xl hover:shadow-teal-300/50 active:scale-[0.98]"
        >
          <IoCartOutline size={22} />
          أضف للسلة
        </button>
      ) : (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 py-3 rounded-2xl">
            <IoCheckmarkDoneCircle size={20} />
            <span className="text-xs sm:text-sm font-bold">تمت الإضافة للسلة بنجاح ✓</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => router.back()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm py-3 rounded-xl transition-colors"
            >
              متابعة التسوق
            </button>
            <button
              onClick={() => router.push("/cart")}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <IoBagCheckOutline size={17} />
              عرض السلة
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
