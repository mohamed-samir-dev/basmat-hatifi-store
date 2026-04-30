"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  IoCartOutline,
  IoCheckmarkCircleOutline,
  IoFlash,
  IoCarOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : `${API}${src.startsWith("/") ? src : "/" + src}`;

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { name, discountPercent = 0, brand, color, storage, inStock, installment, freeDelivery, warrantyYears } = product;
  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice || product.price || 0;
  const salePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : undefined;
  const hasDiscount = salePrice != null && salePrice < originalPrice;
  const displayPrice = hasDiscount ? salePrice : originalPrice;
  const savings = hasDiscount ? originalPrice - salePrice : 0;
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setToast(true);
    setTimeout(() => {
      setToast(false);
      setAdded(false);
      window.scrollTo(0, 0);
      router.push("/cart");
    }, 1000);
  };

  const tags = [color, storage].filter(Boolean);

  return (
    <>
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-base font-medium animate-fade-in-down">
          <IoCheckmarkCircleOutline size={18} />
          تمت إضافة المنتج للسلة
        </div>
      )}

      <Link
        href={`/product/${product._id}`}
        className="product-card group relative flex flex-col h-full rounded-[20px] sm:rounded-[24px] bg-white overflow-hidden"
        dir="rtl"
      >


        {/* ── Image Section ── */}
        <div className="relative w-full aspect-[4/3] sm:aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-white to-slate-50">
          {/* Discount badge - premium ribbon style */}
          {discountPercent > 0 && (
            <div className="absolute z-10 top-2.5 right-2.5 sm:top-3 sm:right-3">
              <div className="relative bg-gradient-to-l from-rose-500 to-red-600 text-white text-[9px] sm:text-[11px] font-black px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg shadow-lg shadow-red-500/30">
                <IoFlash size={10} className="inline-block ml-0.5 -mt-0.5" />
                {discountPercent}%−
              </div>
            </div>
          )}

          {/* Stock indicator */}
          <div className={`absolute z-10 top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[8px] sm:text-[10px] font-bold backdrop-blur-xl border ${
            inStock
              ? "bg-emerald-50/80 text-emerald-700 border-emerald-200/60"
              : "bg-red-50/80 text-red-600 border-red-200/60"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
            {inStock ? "متوفر" : "نفذ"}
          </div>

          {/* Installment badge */}
          {installment?.available && (
            <div className="absolute z-10 bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 flex items-center gap-1 bg-gradient-to-l from-amber-500 to-orange-500 text-white px-2 sm:px-2.5 py-1 rounded-lg text-[8px] sm:text-[10px] font-bold shadow-lg shadow-amber-500/25">
              <IoFlash size={10} />
              تقسيط
            </div>
          )}

          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={name}
              fill
              className="object-contain p-4 sm:p-8"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl">📱</div>
          )}
        </div>

        {/* ── Separator line ── */}
        <div className="h-[1px] bg-gradient-to-l from-transparent via-teal-200/60 to-transparent mx-4" />

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 px-3 sm:px-4 pt-3 sm:pt-4 pb-2 gap-1.5 sm:gap-2">
          {/* Brand + Tags */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {brand && (
              <span className="text-[9px] sm:text-[11px] font-extrabold text-white bg-gradient-to-l from-teal-600 to-emerald-600 px-2 sm:px-2.5 py-0.5 rounded-md tracking-wide uppercase shadow-sm">
                {brand}
              </span>
            )}
            {tags.map((t, i) => (
              <span key={i} className="text-[9px] sm:text-[11px] font-semibold text-white bg-gradient-to-l from-teal-600 to-emerald-600  px-1.5 sm:px-2 py-0.5 rounded-md">
                {t}
              </span>
            ))}
          </div>

          {/* Name */}
          <h3 className="text-[12px] sm:text-[14px] font-bold text-gray-800 leading-[1.6] line-clamp-2 group-hover:text-teal-700 transition-colors duration-300">
            {name}
          </h3>

          <div className="flex-1" />

          {/* Price section */}
          <div className="bg-gradient-to-l from-slate-50/80 to-gray-50/80 rounded-xl p-2 sm:p-2.5 -mx-0.5">
            <div className="flex items-end justify-between gap-1">
              <div className="flex flex-col">
                {hasDiscount && (
                  <span className="text-[9px] sm:text-[11px] text-gray-400 line-through decoration-red-400/60">
                    {fmt(originalPrice)} ر.س
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-[17px] sm:text-[22px] font-black text-gray-900 tracking-tight leading-none">
                    {fmt(displayPrice)}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-bold text-gray-400">ر.س</span>
                </div>
              </div>
              {hasDiscount && savings > 0 && (
                <span className="text-[8px] sm:text-[10px] font-extrabold text-white bg-gradient-to-l from-rose-500 to-red-500 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg shadow-sm shadow-red-500/20">
                  وفّر {fmt(savings)}
                </span>
              )}
            </div>
          </div>

          {/* Warranty + Delivery badges */}
          {(warrantyYears > 0 || freeDelivery) && (
            <div className="flex items-center gap-1.5 sm:gap-2.5 pt-1">
              {warrantyYears > 0 && (
                <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-bold text-violet-600 bg-violet-50 px-1.5 sm:px-2 py-0.5 rounded-md">
                  <IoShieldCheckmarkOutline size={10} className="sm:hidden" />
                  <IoShieldCheckmarkOutline size={12} className="hidden sm:block" />
                  {warrantyYears} سنة
                </span>
              )}
              {freeDelivery && (
                <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 sm:px-2 py-0.5 rounded-md">
                  <IoCarOutline size={10} className="sm:hidden" />
                  <IoCarOutline size={12} className="hidden sm:block" />
                  توصيل مجاني
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Cart button ── */}
        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          <button
            onClick={handleAddToCart}
            className={`cart-btn ${added ? "added" : ""}`}
          >
            {added ? (
              <>
                <IoCheckmarkCircleOutline size={16} className="sm:hidden" />
                <IoCheckmarkCircleOutline size={18} className="hidden sm:block" />
                تمت الإضافة
              </>
            ) : (
              <>
                <IoCartOutline size={16} className="sm:hidden" />
                <IoCartOutline size={18} className="hidden sm:block" />
                أضف للسلة
              </>
            )}
          </button>
        </div>
      </Link>
    </>
  );
}
