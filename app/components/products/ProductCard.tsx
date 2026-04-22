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
        className="product-card group relative flex flex-col h-full rounded-2xl sm:rounded-[20px] bg-white overflow-hidden transition-all duration-300"
        dir="rtl"
      >
        {/* ── Image ── */}
        <div className="relative w-full aspect-[4/4.5] sm:aspect-square bg-white overflow-hidden">
          {/* Discount badge */}
          {discountPercent > 0 && (
            <div className="absolute z-10 top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 bg-gradient-to-l from-red-500 to-rose-500 text-white text-[9px] sm:text-[11px] font-extrabold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl shadow-lg shadow-red-500/20">
              {discountPercent}%-
            </div>
          )}

          {/* Stock indicator */}
          <div className={`absolute z-10 top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg text-[8px] sm:text-[10px] font-bold ${
            inStock
              ? "bg-emerald-50/90 text-emerald-600 border border-emerald-100/60"
              : "bg-red-50/90 text-red-500 border border-red-100/60"
          }`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${inStock ? "bg-emerald-400" : "bg-red-400"}`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
            </span>
            {inStock ? "متوفر" : "نفذ"}
          </div>

          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={name}
              fill
              className="object-contain p-4 sm:p-7 transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl">📱</div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-l from-transparent via-gray-100 to-transparent" />

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 px-3.5 sm:px-4 pt-3.5 sm:pt-4 pb-2.5 gap-2.5 sm:gap-2.5">
          {/* Brand */}
          {brand && (
            <span className="self-start text-[9px] sm:text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-teal-100/50">
              {brand}
            </span>
          )}

          {/* Name */}
          <h3 className="text-[13px] sm:text-sm font-bold text-gray-800 leading-relaxed line-clamp-2 group-hover:text-teal-700 transition-colors">
            {name}
          </h3>

          {/* Tags: color + storage */}
          {tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((t, i) => (
                <span key={i} className="text-[9px] sm:text-[11px] font-semibold text-gray-500 bg-gray-50 px-2 sm:px-2.5 py-0.5 rounded-md border border-gray-100">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Installment badge */}
          {installment?.available && (
            <div className="mt-auto">
              <span className="flex items-center gap-1 text-[8px] sm:text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md border border-amber-100/50 w-fit">
                <IoFlash size={10} className="text-amber-500" />
                تقسيط
              </span>
            </div>
          )}

          {/* Price */}
          <div className="pt-2.5 sm:pt-3 border-t border-gray-100/80">
            <div className="flex items-end justify-between gap-1">
              <div>
                {hasDiscount && (
                  <span className="text-[9px] sm:text-[11px] text-gray-400 line-through block mb-0.5">
                    {fmt(originalPrice)} ر.س
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-base sm:text-xl font-black text-red-600 tracking-tight">
                    {fmt(displayPrice)}
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-bold text-red-400">ر.س</span>
                </div>
              </div>
              {hasDiscount && savings > 0 && (
                <span className="text-[8px] sm:text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-rose-100/50 whitespace-nowrap">
                  وفّر {fmt(savings)}
                </span>
              )}
            </div>
          </div>

          {/* Warranty + Delivery row under price */}
          {(warrantyYears > 0 || freeDelivery) && (
            <div className="flex items-center gap-2.5 sm:gap-3.5 pt-2 mt-0.5 border-t border-dashed border-gray-100">
              {warrantyYears > 0 && (
                <span className="flex items-center gap-1.5 text-[9px] sm:text-[11px] font-bold text-violet-600">
                  <IoShieldCheckmarkOutline size={13} className="text-violet-500" />
                  ضمان {warrantyYears} سنة
                </span>
              )}
              {warrantyYears > 0 && freeDelivery && (
                <span className="w-px h-3.5 bg-gray-200" />
              )}
              {freeDelivery && (
                <span className="flex items-center gap-1.5 text-[9px] sm:text-[11px] font-bold text-sky-600">
                  <IoCarOutline size={13} className="text-sky-500" />
                  توصيل مجاني
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Cart button ── */}
        <div className="p-3.5 sm:p-4 pt-0">
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
