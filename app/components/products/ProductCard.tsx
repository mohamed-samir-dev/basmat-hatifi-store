"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IoCartOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : `${API}${src.startsWith("/") ? src : "/" + src}`;

export default function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { name, discountPercent = 0 } = product;
  const image = product.images?.[0] || product.image;
  const resolvedImage = image ? resolveImg(image) : undefined;
  const originalPrice = product.originalPrice || product.price || 0;
  const salePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : undefined;
  const hasDiscount = salePrice != null && salePrice < originalPrice;
  const displayPrice = hasDiscount ? salePrice : originalPrice;
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
        className="product-card group relative flex flex-col h-full rounded-2xl bg-white overflow-hidden transition-all duration-300"
        dir="rtl"
      >
        {/* ── Image ── */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-slate-50 via-white to-teal-50/40 overflow-hidden">
          {/* Corner decorative accent */}
          <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-100/50 to-transparent rounded-br-[40px] pointer-events-none" />

          {/* Discount ribbon */}
          {discountPercent > 0 && (
            <div className="absolute z-10 top-0 right-0 bg-gradient-to-l from-red-500 to-rose-500 text-white text-[9px] sm:text-[11px] font-extrabold px-3 sm:px-4 py-1 sm:py-1.5 rounded-bl-xl shadow-md">
              خصم {discountPercent}%
            </div>
          )}

          {resolvedImage ? (
            <Image
              src={resolvedImage}
              alt={name}
              fill
              className="object-contain p-4 sm:p-5 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl">📱</div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col flex-1 px-2.5 sm:px-3 pt-2.5 sm:pt-3 pb-1.5 gap-1">
          <h3 className="text-[11px] sm:text-[13px] md:text-sm font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-teal-700 transition-colors">
            {name}
          </h3>

          {/* Price row */}
          <div className="mt-auto flex items-baseline gap-1.5 flex-wrap">
            <span className="text-[15px] sm:text-lg md:text-xl font-black text-teal-700">
              {fmt(displayPrice)}
            </span>
            <span className="text-[9px] sm:text-[11px] font-semibold text-teal-600/70">ر.س</span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through mr-1">
                {fmt(originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* ── Cart button - always visible ── */}
        <div className="p-2.5 sm:p-3 pt-1.5">
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
