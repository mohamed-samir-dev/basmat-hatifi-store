"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";

const AUTO_PLAY_MS = 4000;
const SWIPE_THRESHOLD = 50;

export default function BannerSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((i: number) => {
    setCurrent((i + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    intervalRef.current = setInterval(() => setCurrent(c => (c + 1) % images.length), AUTO_PLAY_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [images.length]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) goTo(current + (diff > 0 ? 1 : -1));
  };

  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-3xl shadow-2xl group">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(${current * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {images.map((src, i) => (
            <div key={i} className="min-w-full relative aspect-[2/1] sm:aspect-[2.2/1]">
              <Image src={src} alt={`banner ${i + 1}`} fill className="object-cover" priority={i === 0} unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => goTo(current - 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 backdrop-blur-sm text-teal-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
              aria-label="السابق"
            >
              <IoChevronForward size={20} />
            </button>
            <button
              onClick={() => goTo(current + 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/80 backdrop-blur-sm text-teal-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
              aria-label="التالي"
            >
              <IoChevronBack size={20} />
            </button>
          </>
        )}

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-6 h-2.5 bg-white" : "w-2.5 h-2.5 bg-white/50 hover:bg-white/70"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
