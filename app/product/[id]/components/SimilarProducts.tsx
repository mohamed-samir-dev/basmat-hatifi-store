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
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (!products.length) return null;

  return (
    <section className="mt-10 sm:mt-16 mb-8">
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

      {/* ─── Section Header ─── */}
      <div className="flex items-center justify-between mb-7 sm:mb-9">
        <div className="flex items-center gap-3.5">
          {/* Icon with double ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-400 blur-md opacity-30" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg">
              <IoSparkles size={20} className="text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-black text-gray-900">قد يعجبك أيضاً</h2>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100/60 px-2.5 py-1 rounded-full">
                {products.length} منتج
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1">منتجات مختارة بعناية لك</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? "bg-white text-gray-600 shadow-lg shadow-black/[.04] border border-gray-100/80 hover:border-teal-200 hover:text-teal-600 hover:shadow-xl hover:shadow-teal-500/[.06] active:scale-95"
                : "bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed"
            }`}
          >
            <IoArrowForward size={16} />
          </button>
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? "bg-white text-gray-600 shadow-lg shadow-black/[.04] border border-gray-100/80 hover:border-teal-200 hover:text-teal-600 hover:shadow-xl hover:shadow-teal-500/[.06] active:scale-95"
                : "bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed"
            }`}
          >
            <IoArrowBack size={16} />
          </button>
        </div>
      </div>

      {/* ─── Carousel ─── */}
      <div className="relative group/carousel">
        {/* Edge fades */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f8f9fb] via-[#f8f9fb]/80 to-transparent z-10 pointer-events-none hidden sm:block transition-opacity duration-300 ${
            canScrollRight ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f8f9fb] via-[#f8f9fb]/80 to-transparent z-10 pointer-events-none hidden sm:block transition-opacity duration-300 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide -mx-2 px-2"
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
                className="sim-item snap-start min-w-[175px] w-[175px] sm:min-w-[210px] sm:w-[210px] flex-shrink-0 group/card"
              >
                <div className="relative bg-white rounded-[20px] sm:rounded-[22px] overflow-hidden border border-gray-100/70 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-900/[.08] hover:-translate-y-2 hover:border-teal-100/80">
                  {/* ── Image Area ── */}
                  <div className="relative aspect-square overflow-hidden bg-[#f5f7f8]">
                    {/* Mesh bg */}
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{
                        background:
                          "radial-gradient(circle at 20% 80%, rgba(20,184,166,.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16,185,129,.06) 0%, transparent 50%)",
                      }}
                    />

                    {/* Discount badge */}
                    {discountPct > 0 && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-rose-500 text-white text-[10px] sm:text-[11px] font-extrabold pl-2 pr-2.5 py-1.5 rounded-xl shadow-lg shadow-rose-500/25">
                        <IoFlame size={12} className="opacity-90" />
                        <span>%{discountPct}-</span>
                      </div>
                    )}

                    {/* Stock dot */}
                    {p.inStock && (
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-100/80">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-bold text-emerald-600">متوفر</span>
                      </div>
                    )}

                    {resolvedImage ? (
                      <Image
                        src={resolvedImage}
                        alt={p.name}
                        fill
                        className="object-contain p-6 sm:p-7 transition-all duration-700 ease-out group-hover/card:scale-110 group-hover/card:rotate-1"
                        sizes="210px"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">
                        📱
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-teal-900/70 via-teal-900/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex items-end justify-center pb-5">
                      <span className="flex items-center gap-1.5 text-white text-[11px] sm:text-xs font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 translate-y-3 group-hover/card:translate-y-0 transition-transform duration-500">
                        <IoEyeOutline size={14} />
                        اطلع عليه
                      </span>
                    </div>
                  </div>

                  {/* ── Info ── */}
                  <div className="p-4 sm:p-[18px]">
                    {/* Brand pill */}
                    {p.brand && (
                      <div className="mb-2.5">
                        <span className="text-[9px] sm:text-[10px] font-bold text-teal-700 bg-teal-50/80 px-2.5 py-1 rounded-lg border border-teal-100/40">
                          {p.brand}
                        </span>
                      </div>
                    )}

                    {/* Name */}
                    <h3 className="text-[12px] sm:text-[13px] font-bold text-gray-800 line-clamp-2 leading-[1.6] mb-3 group-hover/card:text-teal-700 transition-colors duration-300">
                      {p.name}
                    </h3>

                    {/* Discount progress bar */}
                    {hasDiscount && (
                      <div className="mb-3">
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-l from-rose-400 to-red-400 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(discountPct * 1.5, 100)}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-rose-500 font-bold mt-1">
                          وفّر {fmt(originalPrice - salePrice)} ر.س
                        </p>
                      </div>
                    )}

                    {/* Price row */}
                    <div className="flex items-end justify-between">
                      <div>
                        {hasDiscount && (
                          <span className="text-[10px] text-gray-400 line-through block mb-0.5">
                            {fmt(originalPrice)} ر.س
                          </span>
                        )}
                        <div className="flex items-baseline gap-1">
                          <span className="text-base sm:text-lg font-black text-gray-900 tracking-tight">
                            {fmt(displayPrice)}
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold">ر.س</span>
                        </div>
                      </div>

                      {/* Arrow indicator */}
                      <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100/80 flex items-center justify-center group-hover/card:bg-gradient-to-br group-hover/card:from-teal-500 group-hover/card:to-emerald-500 group-hover/card:border-transparent group-hover/card:shadow-lg group-hover/card:shadow-teal-500/20 transition-all duration-400">
                        <IoArrowBack
                          size={14}
                          className="text-gray-400 group-hover/card:text-white transition-colors duration-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* ── See More ── */}
          <div className="snap-start min-w-[130px] w-[130px] sm:min-w-[140px] sm:w-[140px] flex-shrink-0 flex items-stretch">
            <Link
              href="/"
              className="flex-1 flex flex-col items-center justify-center gap-4 rounded-[20px] border-2 border-dashed border-teal-200/60 bg-gradient-to-br from-teal-50/40 to-emerald-50/30 hover:border-teal-300 hover:from-teal-50 hover:to-emerald-50/60 transition-all duration-400 group/more"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-teal-100/40 border border-teal-100/50 flex items-center justify-center group-hover/more:shadow-xl group-hover/more:shadow-teal-200/50 group-hover/more:scale-110 transition-all duration-400">
                <IoArrowBack
                  size={22}
                  className="text-teal-600 sim-float-arrow"
                />
              </div>
              <div className="text-center">
                <p className="text-[13px] font-black text-teal-700">المزيد</p>
                <p className="text-[10px] text-teal-500/70 mt-0.5">اكتشف الكل</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
