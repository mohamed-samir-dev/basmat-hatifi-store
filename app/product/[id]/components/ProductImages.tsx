"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ProductImagesProps {
  images: string[];
  name: string;
  discountPercent?: number;
}

export default function ProductImages({ images, name, discountPercent = 0 }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const touchStart = useRef(0);

  const goTo = (i: number) => setSelectedImage((i + images.length) % images.length);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      {/* Main Image */}
      <div
        className="relative aspect-square bg-gradient-to-br from-slate-50 via-white to-teal-50/30 overflow-hidden"
        onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchStart.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50 && images.length > 1) goTo(selectedImage + (diff > 0 ? 1 : -1));
        }}
      >
        {/* Discount badge */}
        {discountPercent > 0 && (
          <div className="absolute z-10 top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-l from-red-500 to-rose-500 text-white text-[10px] sm:text-xs font-extrabold px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl shadow-lg">
            خصم {discountPercent}%
          </div>
        )}

        {/* Corner accent */}
        <div className="absolute top-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-teal-100/40 to-transparent rounded-br-[60px] pointer-events-none" />

        {images.length > 0 ? (
          <Image
            src={images[selectedImage]}
            alt={name}
            fill
            className="object-contain p-6 sm:p-10 transition-opacity duration-300"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200 text-5xl sm:text-7xl">📱</div>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/20 backdrop-blur-sm text-white text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-full">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 sm:gap-2.5 p-3 sm:p-4 bg-gray-50/50 overflow-x-auto scrollbar-hide justify-center">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative w-14 h-14 sm:w-[72px] sm:h-[72px] rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-200 ${
                i === selectedImage
                  ? "border-teal-500 shadow-md shadow-teal-100 scale-105"
                  : "border-gray-200 hover:border-teal-300 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
