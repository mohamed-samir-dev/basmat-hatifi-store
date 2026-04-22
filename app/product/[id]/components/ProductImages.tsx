"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface ProductImagesProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductImages({ images, name, discountPercent = 0 }: ProductImagesProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchStart = useRef(0);

  const goTo = (i: number) => setSelected((i + images.length) % images.length);

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-black/[.06] border border-gray-100/60">
      {/* Main Image */}
      <div
        className="relative aspect-square overflow-hidden cursor-zoom-in group"
        style={{ background: "linear-gradient(145deg, #fafbfc 0%, #f0f4f5 50%, #f5f8f8 100%)" }}
        onClick={() => setZoomed(!zoomed)}
        onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50 && images.length > 1) goTo(selected + (diff > 0 ? 1 : -1));
        }}
      >
        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute z-10 top-4 right-4 sm:top-5 sm:right-5">
            <div className="bg-rose-500 text-white text-[11px] sm:text-xs font-extrabold px-3.5 py-1.5 rounded-2xl shadow-lg shadow-rose-500/30 flex items-center gap-1">
              <span className="opacity-80">خصم</span>
              <span>{discountPercent}%</span>
            </div>
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-teal-50/60 to-transparent rounded-br-[80px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-emerald-50/40 to-transparent rounded-tl-[60px] pointer-events-none" />

        {images.length > 0 ? (
          <Image
            src={images[selected]}
            alt={name}
            fill
            className={`object-contain p-8 sm:p-12 transition-all duration-500 ease-out ${zoomed ? "scale-150" : "group-hover:scale-105"}`}
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-6xl">📱</div>
        )}

        {/* Nav arrows (desktop) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(selected - 1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
            >
              <IoChevronForward size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(selected + 1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
            >
              <IoChevronBack size={16} />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/10 backdrop-blur-md px-3 py-1.5 rounded-full">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setSelected(i); }}
                className={`rounded-full transition-all duration-300 ${
                  i === selected ? "w-5 h-2 bg-white" : "w-2 h-2 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 p-4 sm:p-5 overflow-x-auto scrollbar-hide justify-center bg-gray-50/40">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-16 h-16 sm:w-[76px] sm:h-[76px] rounded-2xl overflow-hidden shrink-0 transition-all duration-300 ${
                i === selected
                  ? "ring-2 ring-teal-500 ring-offset-2 shadow-lg shadow-teal-100/50 scale-105"
                  : "ring-1 ring-gray-200 opacity-60 hover:opacity-100 hover:ring-teal-300"
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
