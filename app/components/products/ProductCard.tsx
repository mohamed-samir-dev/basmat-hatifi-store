"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoCartOutline, IoCheckmarkCircleOutline } from "react-icons/io5";
import type { Product } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function ProductCard({ product }: { product: Product }) {
  const { name, salePrice, discountPercent = 0, image } = product;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const hasDiscount = salePrice && salePrice < originalPrice;
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => router.push("/cart"), 800);
  };

  return (
    <Link href={`/product/${product._id}`} className="relative bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full" dir="rtl">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute z-10 top-2 right-2 bg-red-500 text-white text-[9px] sm:text-xs md:text-sm font-bold px-1.5 sm:px-2.5 md:px-3 py-0.5 rounded-full">
          {discountPercent}%-
        </span>
      )}

      {/* Image */}
      <div className="relative w-full" style={{ paddingBottom: "100%" }}>
        <div className="absolute inset-0 bg-gray-50">
          {image ? (
            <Image src={image} alt={name} fill className="object-contain p-2 sm:p-4" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl sm:text-5xl">📱</div>
          )}
        </div>
      </div>

      {/* Name + Price */}
      <div className="px-2 sm:px-3 pt-2 sm:pt-3 pb-1.5 sm:pb-2 flex flex-col gap-1 flex-1">
        <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-800 leading-snug line-clamp-2">{name}</h3>

        <div className="flex flex-col gap-0.5 mt-auto">
          {hasDiscount ? (
            <>
              <span className="text-[10px] sm:text-xs md:text-sm text-gray-400 line-through">{fmt(originalPrice)} ر.س</span>
              <span className="text-sm sm:text-base md:text-lg font-extrabold text-red-600">{fmt(salePrice)} ر.س</span>
            </>
          ) : (
            <span className="text-sm sm:text-base md:text-lg font-extrabold text-red-600">{fmt(originalPrice)} ر.س</span>
          )}
        </div>
      </div>

      {/* Cart Button */}
      <div className="border-t border-gray-100 mt-1">
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 md:py-5 text-sm sm:text-base md:text-xl transition-colors font-semibold ${
            added
              ? "bg-emerald-50 text-emerald-700"
              : "text-emerald-600 hover:bg-emerald-50"
          }`}
        >
          {added ? (
            <><IoCheckmarkCircleOutline size={16} className="sm:hidden" /><IoCheckmarkCircleOutline size={20} className="hidden sm:block md:hidden" /><IoCheckmarkCircleOutline size={24} className="hidden md:block" />تمت الإضافة</>
          ) : (
            <><IoCartOutline size={16} className="sm:hidden" /><IoCartOutline size={20} className="hidden sm:block md:hidden" /><IoCartOutline size={24} className="hidden md:block" />أضف للسلة</>
          )}
        </button>
      </div>
    </Link>
  );
}
