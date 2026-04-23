"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoArrowBack, IoArrowForward, IoEyeOutline, IoFlame, IoSparkles } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const fmt = (n: number) => n.toLocaleString("en-US");
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : `${API}${src.startsWith("/") ? src : "/" + src}`;

export default function SimilarProducts({ product }: { product: Product }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!product.category && !product.subCategory) return;
    fetch(`${API}/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        const all = (Array.isArray(data) ? data : []).filter((p) => p._id !== product._id);
        const similar = all.filter((p) => {
          const sameCat =
            (p.subCategory && p.subCategory === product.subCategory) ||
            (p.category && p.category === product.category);
          const diff = p.brand !== product.brand || p.name !== product.name;
          return sameCat && diff;
        });
        similar.sort(
          (a, b) =>
            (b.brand !== product.brand ? 1 : 0) - (a.brand !== product.brand ? 1 : 0)
        );
        setProducts(similar.slice(0, 8));
      })
      .catch(() => {});
  }, [product]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll, { passive: true });
    return () => el?.removeEventListener("scroll", checkScroll);
  }, [products]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <section className="mt-6 sm:mt-10 md:mt-16 mb-4 sm:mb-8">
      <style>{`
        @keyframes simReveal{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes floatArrow{0%,100%{transform:translateX(0)}50%{transform:translateX(-4px)}}
        .sim-item{animation:simReveal .45s cubic-bezier(.22,1,.36,1) both}
        .sim-item:nth-child(2){animation-delay:.04s}
        .sim-item:nth-child(3){animation-delay:.08s}
        .sim-item:nth-child(4){animation-delay:.12s}
        .sim-item:nth-child(5){animation-delay:.16s}
        .sim-item:nth-child(6){animation-delay:.2s}
        .sim-item:nth-child(7){animation-delay:.24s}
        .sim-item:nth-child(8){animation-delay:.28s}
        .sim-float-arrow{animation:floatArrow 1.5s ease-in-out infinite}
      `}</style>

      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-5 sm:mb-7 md:mb-9">
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-400 blur-md opacity-30" />
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <IoSparkles size={16} className="text-white sm:hidden" />
              <IoSparkles size={20} className="text-white hidden sm:block" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 sm:gap-2.5">
              <h2 className="text-sm sm:text-lg md:text-xl font-black text-gray-900">قد يعجبك أيضاً</h2>
              <span className="text-[8px] sm:text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100/60 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                {products.length} منتج
              </span>
            </div>
            <p className="text-[9px] sm:text-[11px] md:text-xs text-gray-400 mt-0.5 sm:mt-1">منتجات مختارة بعناية لك</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? "bg-white text-gray-600 shadow-lg shadow-black/[.04] border border-gray-100/80 hover:border-teal-200 hover:text-teal-600 hover:shadow-xl active:scale-95"
                : "bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed"
            }`}
          >
            <IoArrowForward size={14} className="sm:hidden" />
            <IoArrowForward size={16} className="hidden sm:block" />
          </button>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? "bg-white text-gray-600 shadow-lg shadow-black/[.04] border border-gray-100/80 hover:border-teal-200 hover:text-teal-600 hover:shadow-xl active:scale-95"
                : "bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed"
            }`}
          >
            <IoArrowBack size={14} className="sm:hidden" />
            <IoArrowBack size={16} className="hidden sm:block" />
          </button>
        </div>
      </div>

      {/* ─── Carousel ─── */}
      <div className="relative">
        <div className={`absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-[#f5f6f8] to-transparent z-10 pointer-events-none hidden sm:block transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"}`} />
        <div className={`absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-[#f5f6f8] to-transparent z-10 pointer-events-none hidden sm:block transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"}`} />

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-2 sm:pb-3 snap-x snap-mandatory scrollbar-hide -mx-1.5 sm:-mx-2 px-1.5 sm:px-2"
        >
          {products.map((p) => {
            const image = p.images?.[0] || p.image;
            const resolvedImage = image ? resolveImg(image) : undefined;
            const originalPrice = p.originalPrice || p.price || 0;
            const salePrice = p.salePrice && p.salePrice > 0 ? p.salePrice : undefined;
            const hasDiscount = salePrice != null && salePrice < originalPrice;
            const displayPrice = hasDiscount ? salePrice : originalPrice;
            const discountPct = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

            return (
              <Link
                key={p._id}
                href={`/product/${p._id}`}
                className="sim-item snap-start min-w-[150px] w-[150px] sm:min-w-[175px] sm:w-[175px] md:min-w-[210px] md:w-[210px] flex-shrink-0 group/card"
              >
                <div className="relative bg-white rounded-2xl sm:rounded-[22px] md:rounded-[24px] overflow-hidden border border-gray-100/60 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-900/[.08] hover:-translate-y-2 hover:border-teal-100/80">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 via-white to-slate-50">
                    {discountPct > 0 && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-0.5 sm:gap-1 bg-gradient-to-l from-rose-500 to-red-600 text-white text-[9px] sm:text-[10px] md:text-[11px] font-extrabold pl-1.5 pr-2 sm:pl-2 sm:pr-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg shadow-rose-500/25">
                        <IoFlame size={10} className="opacity-90 sm:hidden" />
                        <IoFlame size={12} className="opacity-90 hidden sm:block" />
                        <span>%{discountPct}-</span>
                      </div>
                    )}

                    {p.inStock && (
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex items-center gap-1 sm:gap-1.5 bg-white/90 backdrop-blur-sm px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg border border-gray-100/80">
                        <span className="relative flex h-1 w-1 sm:h-1.5 sm:w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1 w-1 sm:h-1.5 sm:w-1.5 bg-emerald-500" />
                        </span>
                        <span className="text-[7px] sm:text-[8px] md:text-[9px] font-bold text-emerald-600">متوفر</span>
                      </div>
                    )}

                    {resolvedImage ? (
                      <Image
                        src={resolvedImage}
                        alt={p.name}
                        fill
                        className="object-contain p-4 sm:p-6 md:p-7 transition-all duration-700 ease-out group-hover/card:scale-110"
                        sizes="(max-width: 640px) 150px, (max-width: 768px) 175px, 210px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl text-gray-200">📱</div>
                    )}

                    {/* Hover overlay - hidden on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500 items-end justify-center pb-4 sm:pb-5 hidden sm:flex">
                      <span className="flex items-center gap-1.5 text-white text-[10px] sm:text-[11px] md:text-xs font-bold bg-white/20 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/20 translate-y-3 group-hover/card:translate-y-0 transition-transform duration-500">
                        <IoEyeOutline size={13} className="sm:hidden" />
                        <IoEyeOutline size={14} className="hidden sm:block" />
                        عرض التفاصيل
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-4 md:p-[18px]">
                    {p.brand && (
                      <div className="mb-2 sm:mb-2.5">
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-extrabold text-white bg-gradient-to-l from-teal-600 to-emerald-600 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm">
                          {p.brand}
                        </span>
                      </div>
                    )}

                    <h3 className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-gray-800 line-clamp-2 leading-[1.5] sm:leading-[1.6] mb-2 sm:mb-3 group-hover/card:text-teal-700 transition-colors duration-300">
                      {p.name}
                    </h3>

                    {hasDiscount && (
                      <div className="mb-2 sm:mb-3">
                        <div className="h-[3px] sm:h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-l from-rose-400 to-red-400 rounded-full"
                            style={{ width: `${Math.min(discountPct * 1.5, 100)}%` }}
                          />
                        </div>
                        <p className="text-[8px] sm:text-[9px] text-rose-500 font-bold mt-0.5 sm:mt-1">
                          وفّر {fmt(originalPrice - salePrice)} ر.س
                        </p>
                      </div>
                    )}

                    <div className="flex items-end justify-between">
                      <div>
                        {hasDiscount && (
                          <span className="text-[9px] sm:text-[10px] text-gray-400 line-through block mb-0.5">
                            {fmt(originalPrice)} ر.س
                          </span>
                        )}
                        <div className="flex items-baseline gap-0.5 sm:gap-1">
                          <span className="text-sm sm:text-base md:text-lg font-black text-gray-900 tracking-tight">
                            {fmt(displayPrice)}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-semibold">ر.س</span>
                        </div>
                      </div>

                      <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg sm:rounded-xl bg-gray-50 border border-gray-100/80 flex items-center justify-center group-hover/card:bg-gradient-to-br group-hover/card:from-teal-500 group-hover/card:to-emerald-500 group-hover/card:border-transparent group-hover/card:shadow-lg group-hover/card:shadow-teal-500/20 transition-all duration-400">
                        <IoArrowBack
                          size={12}
                          className="text-gray-400 group-hover/card:text-white transition-colors duration-300 sm:hidden"
                        />
                        <IoArrowBack
                          size={14}
                          className="text-gray-400 group-hover/card:text-white transition-colors duration-300 hidden sm:block"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* See More */}
          <div className="snap-start min-w-[100px] w-[100px] sm:min-w-[120px] sm:w-[120px] md:min-w-[140px] md:w-[140px] flex-shrink-0 flex items-stretch">
            <Link
              href="/"
              className="flex-1 flex flex-col items-center justify-center gap-2.5 sm:gap-3 md:gap-4 rounded-2xl sm:rounded-[22px] border-2 border-dashed border-teal-200/60 bg-gradient-to-br from-teal-50/40 to-emerald-50/30 hover:border-teal-300 hover:from-teal-50 hover:to-emerald-50/60 transition-all duration-400 group/more"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white shadow-lg shadow-teal-100/40 border border-teal-100/50 flex items-center justify-center group-hover/more:shadow-xl group-hover/more:scale-110 transition-all duration-400">
                <IoArrowBack size={18} className="text-teal-600 sim-float-arrow sm:hidden" />
                <IoArrowBack size={22} className="text-teal-600 sim-float-arrow hidden sm:block" />
              </div>
              <div className="text-center">
                <p className="text-[11px] sm:text-[13px] font-black text-teal-700">المزيد</p>
                <p className="text-[8px] sm:text-[10px] text-teal-500/70 mt-0.5">اكتشف الكل</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
