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
        className="product-card group relative flex flex-col h-full rounded-2xl sm:rounded-[22px] bg-white overflow-hidden transition-all duration-300"
        dir="rtl"
      >
        {/* ── Image section with overlay ── */}
        <div className="relative w-full aspect-[4/3] sm:aspect-square bg-white overflow-hidden">
          {/* Discount ribbon */}
          {discountPercent > 0 && (
            <div className="absolute z-10 top-0 right-0 bg-red-500 text-white text-[8px] sm:text-[11px] font-black px-2 sm:px-4 py-1 sm:py-2 rounded-bl-xl sm:rounded-bl-2xl shadow-md">
              {discountPercent}%−
            </div>
          )}

          {/* Stock dot - top left */}
          <div className={`absolute z-10 top-2 left-2 sm:top-3 sm:left-3 flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-[10px] font-bold backdrop-blur-md ${
            inStock
              ? "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20"
              : "bg-red-500/15 text-red-600 ring-1 ring-red-500/20"
          }`}>
            <span className={`h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
            {inStock ? "متوفر" : "نفذ"}
          </div>

          {/* Installment chip */}
          {installment?.available && (
            <div className="absolute z-10 bottom-2 left-2 sm:bottom-3 sm:left-3 flex items-center gap-1 bg-amber-500/15 backdrop-blur-md text-amber-700 ring-1 ring-amber-500/20 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[7px] sm:text-[10px] font-bold">
              <IoFlash size={9} className="sm:hidden" />
              <IoFlash size={10} className="hidden sm:block" />
              تقسيط
            </div>
          )}

          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={name}
              fill
              className="object-contain p-3 sm:p-8 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl">📱</div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 px-2.5 sm:p-4 pt-2 sm:pt-4 pb-1.5 gap-1 sm:gap-2">
          {/* Brand + Tags row */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            {brand && (
              <span className="text-[9px] sm:text-[11px] font-extrabold text-teal-600 bg-teal-500/8 px-1.5 sm:px-2 py-0.5 rounded-md tracking-wide uppercase">
                {brand}
              </span>
            )}
            {tags.map((t, i) => (
              <span key={i} className="text-[9px] sm:text-[11px] font-semibold text-teal-600 bg-teal-500/8  px-1 sm:px-1.5 py-0.5 rounded-md">
                {t}
              </span>
            ))}
          </div>

          {/* Name */}
          <h3 className="text-[12px] sm:text-[14px] font-bold text-gray-800 leading-[1.5] line-clamp-2 group-hover:text-teal-700 transition-colors">
            {name}
          </h3>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price block */}
          <div className="flex items-end justify-between gap-1">
            <div className="flex flex-col">
              {hasDiscount && (
                <span className="text-[9px] sm:text-[11px] text-gray-400 line-through decoration-red-300">
                  {fmt(originalPrice)} ر.س
                </span>
              )}
              <div className="flex items-baseline gap-0.5">
                <span className="text-[16px] sm:text-xl font-black text-gray-900 tracking-tight">
                  {fmt(displayPrice)}
                </span>
                <span className="text-[9px] sm:text-[11px] font-bold text-gray-400">ر.س</span>
              </div>
            </div>
            {hasDiscount && savings > 0 && (
              <span className="text-[8px] sm:text-[10px] font-extrabold text-white bg-red-500 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg shadow-sm">
                وفّر {fmt(savings)}
              </span>
            )}
          </div>

          {/* Warranty + Delivery */}
          {(warrantyYears > 0 || freeDelivery) && (
            <div className="flex items-center gap-1.5 sm:gap-3 pt-1 sm:pt-1.5 border-t border-dashed border-gray-100">
              {warrantyYears > 0 && (
                <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-bold text-violet-500">
                  <IoShieldCheckmarkOutline size={10} className="sm:hidden" />
                  <IoShieldCheckmarkOutline size={12} className="hidden sm:block" />
                  {warrantyYears} سنة
                </span>
              )}
              {freeDelivery && (
                <span className="flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[10px] font-bold text-sky-500">
                  <IoCarOutline size={10} className="sm:hidden" />
                  <IoCarOutline size={12} className="hidden sm:block" />
                  توصيل مجاني
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Cart button ── */}
        <div className="px-2.5 sm:px-4 pb-2.5 sm:pb-4">
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
