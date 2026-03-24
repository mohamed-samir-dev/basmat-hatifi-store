import Link from "next/link";
import Image from "next/image";
import { IoCartOutline } from "react-icons/io5";
import type { Product } from "./types";

const fmt = (n: number) => n.toLocaleString("ar-SA");

export default function ProductCard({ product }: { product: Product }) {
  const { name, salePrice, discountPercent = 0, image } = product;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const hasDiscount = salePrice && salePrice < originalPrice;

  return (
    <Link href={`/product/${product._id}`} className="relative bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow flex flex-col h-full" dir="rtl">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute z-10 top-2 right-2 bg-red-500 text-white text-[10px] sm:text-sm font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">
          {discountPercent}%-
        </span>
      )}

      {/* Image */}
      <div className="relative aspect-square bg-gray-50">
        {image ? (
          <Image src={image} alt={name} fill className="object-contain p-2 sm:p-4" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl sm:text-5xl">📱</div>
        )}
      </div>

      {/* Name + Price */}
      <div className="px-2 sm:px-4 pt-2 sm:pt-4 pb-2 sm:pb-3 flex flex-col gap-1 sm:gap-2 flex-1">
        <h3 className="text-xs sm:text-base font-bold text-gray-800 leading-snug line-clamp-2">{name}</h3>

        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-3">
          {hasDiscount ? (
            <>
              <span className="text-[10px] sm:text-sm text-gray-400 line-through">{fmt(originalPrice)} ر.س</span>
              <span className="text-sm sm:text-xl font-extrabold text-red-600">{fmt(salePrice)} ر.س</span>
            </>
          ) : (
            <span className="text-sm sm:text-xl font-extrabold text-red-600">{fmt(originalPrice)} ر.س</span>
          )}
        </div>
      </div>

      {/* Cart Button */}
      <div className="border-t border-gray-200">
        <button onClick={(e) => e.preventDefault()} className="w-full flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3.5 text-xs sm:text-base text-emerald-600 hover:bg-emerald-50 transition-colors font-semibold">
          <IoCartOutline size={16} className="sm:hidden" />
          <IoCartOutline size={22} className="hidden sm:block" />
          أضف للسلة
        </button>
      </div>
    </Link>
  );
}
