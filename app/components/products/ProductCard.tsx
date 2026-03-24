import Image from "next/image";
import { IoCartOutline } from "react-icons/io5";
import type { Product } from "./types";

const fmt = (n: number) => n.toLocaleString("ar-SA");

export default function ProductCard({ product }: { product: Product }) {
  const { name, salePrice, discountPercent = 0, image } = product;
  const originalPrice = product.originalPrice ?? product.price ?? 0;
  const hasDiscount = salePrice && salePrice < originalPrice;

  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow flex flex-col" dir="rtl">
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <span className="absolute z-10 top-3 right-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
          {discountPercent}%-
        </span>
      )}

      {/* Image */}
      <div className="relative aspect-square bg-gray-50">
        {image ? (
          <Image src={image} alt={name} fill className="object-contain p-4" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">📱</div>
        )}
      </div>

      {/* Name + Price */}
      <div className="px-4 pt-4 pb-3 flex flex-col gap-2.5 flex-1">
        <h3 className="text-base font-bold text-gray-800 leading-relaxed line-clamp-2">{name}</h3>

        <div className="flex items-center gap-3 flex-wrap">
          {hasDiscount ? (
            <>
              <span className="text-base text-gray-400 line-through">{fmt(originalPrice)} ر.س</span>
              <span className="text-xl font-extrabold text-red-600">{fmt(salePrice)} ر.س</span>
            </>
          ) : (
            <span className="text-xl font-extrabold text-red-600">{fmt(originalPrice)} ر.س</span>
          )}
        </div>
      </div>

      {/* Cart Button */}
      <div className="border-t border-gray-200">
        <button className="w-full flex items-center justify-center gap-2 py-3.5 text-base text-emerald-600 hover:bg-emerald-50 transition-colors font-semibold">
          <IoCartOutline size={24} />
          أضف للسلة
        </button>
      </div>
    </div>
  );
}
