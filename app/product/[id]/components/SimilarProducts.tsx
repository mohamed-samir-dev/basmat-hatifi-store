"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const fmt = (n: number) => n.toLocaleString("en-US");
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : `${API}${src.startsWith("/") ? src : "/" + src}`;

export default function SimilarProducts({ product }: { product: Product }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!product.category && !product.subCategory && !product.brand) return;

    fetch(`${API}/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        const all = (Array.isArray(data) ? data : []).filter(
          (p) => p._id !== product._id
        );

        // Score similarity
        const scored = all.map((p) => {
          let score = 0;
          if (p.brand && p.brand === product.brand) score += 3;
          if (p.subCategory && p.subCategory === product.subCategory) score += 2;
          if (p.category && p.category === product.category) score += 1;
          return { product: p, score };
        });

        scored.sort((a, b) => b.score - a.score);
        setProducts(
          scored.filter((s) => s.score > 0).slice(0, 6).map((s) => s.product)
        );
      })
      .catch(() => {});
  }, [product]);

  if (!products.length) return null;

  return (
    <section className="mt-12 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-teal-500 to-emerald-500" />
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            قد يعجبك أيضاً
          </h2>
        </div>
      </div>

      {/* Scrollable Row */}
      <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-1 px-1">
        {products.map((p) => {
          const image = p.images?.[0] || p.image;
          const resolvedImage = image ? resolveImg(image) : undefined;
          const originalPrice = p.originalPrice || p.price || 0;
          const salePrice = p.salePrice && p.salePrice > 0 ? p.salePrice : undefined;
          const hasDiscount = salePrice != null && salePrice < originalPrice;
          const displayPrice = hasDiscount ? salePrice : originalPrice;

          return (
            <Link
              key={p._id}
              href={`/product/${p._id}`}
              className="snap-start min-w-[150px] w-[150px] sm:min-w-[170px] sm:w-[170px] flex-shrink-0 group"
            >
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-teal-50/30 overflow-hidden">
                  {p.discountPercent > 0 && (
                    <span className="absolute top-1.5 right-1.5 z-10 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      -{p.discountPercent}%
                    </span>
                  )}
                  {resolvedImage ? (
                    <Image
                      src={resolvedImage}
                      alt={p.name}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                      sizes="170px"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-200">📱</div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5 space-y-1.5">
                  <h3 className="text-[11px] sm:text-xs font-semibold text-gray-700 line-clamp-2 leading-relaxed group-hover:text-teal-700 transition-colors">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm sm:text-[15px] font-black text-teal-700">
                      {fmt(displayPrice)}
                    </span>
                    <span className="text-[9px] text-teal-600/70 font-medium">ر.س</span>
                    {hasDiscount && (
                      <span className="text-[9px] text-gray-400 line-through mr-0.5">
                        {fmt(originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}

        {/* See More Card */}
        <div className="snap-start min-w-[100px] w-[100px] flex-shrink-0 flex items-center justify-center">
          <Link
            href="/"
            className="flex flex-col items-center gap-2 text-teal-600 hover:text-teal-700 transition"
          >
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center group-hover:bg-teal-100 transition">
              <IoChevronBack size={18} />
            </div>
            <span className="text-[11px] font-semibold">المزيد</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
