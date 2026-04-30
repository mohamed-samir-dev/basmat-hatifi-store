"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { IoChevronBack, IoChevronForward, IoExpand } from "react-icons/io5";

interface ProductImagesProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductImages({ images, name, discountPercent = 0 }: ProductImagesProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const touchStart = useRef(0);

  const goTo = (i: number) => setSelected((i + images.length) % images.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="flex flex-col gap-2.5 sm:gap-3 md:gap-4">
      {/* Main Image Card */}
      <div className="relative bg-white rounded-2xl sm:rounded-[24px] md:rounded-[28px] overflow-hidden shadow-lg sm:shadow-xl shadow-black/[.05] border border-gray-100/50">
        {/* Corner decorations - hidden on small screens for performance */}
        <div className="absolute top-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-gradient-to-br from-teal-50/50 to-transparent rounded-br-[60px] sm:rounded-br-[100px] pointer-events-none z-[1] hidden sm:block" />
        <div className="absolute bottom-0 right-0 w-24 sm:w-36 h-24 sm:h-36 bg-gradient-to-tl from-emerald-50/30 to-transparent rounded-tl-[50px] sm:rounded-tl-[80px] pointer-events-none z-[1] hidden sm:block" />

        <div
          className="relative aspect-[4/3.5] sm:aspect-[4/3] overflow-hidden cursor-zoom-in group"
          onClick={() => setZoomed(!zoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomed(false)}
          onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            const diff = touchStart.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50 && images.length > 1) goTo(selected + (diff > 0 ? 1 : -1));
          }}
        >
          {/* Discount badge */}
          {discountPercent > 0 && (
            <div className="absolute z-10 top-2.5 right-2.5 sm:top-4 sm:right-4 md:top-5 md:right-5">
              <div className="bg-gradient-to-l from-rose-500 to-red-600 text-white text-[10px] sm:text-[11px] md:text-xs font-extrabold px-2.5 sm:px-3.5 md:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg shadow-rose-500/30 flex items-center gap-1 sm:gap-1.5">
                <span className="opacity-80">خصم</span>
                <span className="text-xs sm:text-sm font-black">{discountPercent}%</span>
              </div>
            </div>
          )}

          {/* Zoom hint - desktop only */}
          <div className="absolute z-10 bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-5 md:right-5 items-center gap-1.5 bg-black/5 backdrop-blur-md text-gray-500 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] md:text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
            <IoExpand size={12} className="sm:hidden" />
            <IoExpand size={13} className="hidden sm:block" />
            اضغط للتكبير
          </div>

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute z-10 top-2.5 left-2.5 sm:top-4 sm:left-4 md:top-5 md:left-5 bg-black/5 backdrop-blur-md text-gray-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] md:text-[11px] font-bold">
              {selected + 1} / {images.length}
            </div>
          )}

          {images.length > 0 ? (
            <Image
              src={images[selected]}
              alt={name}
              fill
              className="object-contain p-3 sm:p-5 md:p-8 lg:p-10 transition-all duration-500 ease-out"
              style={
                zoomed
                  ? { transform: "scale(2.2)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : {}
              }
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 58vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl sm:text-6xl">📱</div>
          )}

          {/* Nav arrows - tablet+ only */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(selected - 1); }}
                className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-xl hover:text-teal-600 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
              >
                <IoChevronForward size={16} className="md:hidden" />
                <IoChevronForward size={18} className="hidden md:block" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(selected + 1); }}
                className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-xl hover:text-teal-600 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
              >
                <IoChevronBack size={16} className="md:hidden" />
                <IoChevronBack size={18} className="hidden md:block" />
              </button>
            </>
          )}

          {/* Dots (mobile only) */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white/70 backdrop-blur-xl px-2.5 py-1.5 rounded-full sm:hidden shadow-sm">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setSelected(i); }}
                  className={`rounded-full transition-all duration-300 ${
                    i === selected ? "w-4 h-1.5 bg-teal-600" : "w-1.5 h-1.5 bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-2.5 md:gap-3 overflow-x-auto scrollbar-hide justify-start sm:justify-center px-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative w-14 h-14 sm:w-[68px] sm:h-[68px] md:w-20 md:h-20 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 transition-all duration-300 ${
                i === selected
                  ? "ring-2 sm:ring-[2.5px] ring-teal-500 ring-offset-2 sm:ring-offset-[3px] shadow-lg shadow-teal-200/40 scale-105 bg-white"
                  : "ring-1 ring-gray-200/80 opacity-50 hover:opacity-90 hover:ring-teal-300 bg-white hover:shadow-md"
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-1.5 sm:p-2 md:p-2.5" sizes="(max-width: 640px) 56px, (max-width: 768px) 68px, 80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
