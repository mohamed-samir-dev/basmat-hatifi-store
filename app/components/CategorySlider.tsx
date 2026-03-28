"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

const AUTO_PLAY_MS = 2500;
const SWIPE_THRESHOLD = 40;
const GAP = 12;

type Category = { name: string; count: number; image: string; href: string };

function getVisibleCount(width: number) {
  if (width < 400) return 3;
  if (width < 640) return 4;
  if (width < 1024) return 5;
  return 7;
}

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // حساب عرض الـ item بناءً على عرض الـ container
  const getItemWidth = useCallback(() => {
    if (!containerRef.current) return 0;
    const w = containerRef.current.offsetWidth;
    const count = getVisibleCount(w);
    return (w - GAP * (count - 1)) / count;
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    const itemW = getItemWidth();
    containerRef.current.scrollLeft = index * (itemW + GAP);
  }, [getItemWidth]);

  const goTo = useCallback((index: number) => {
    if (!containerRef.current) return;
    const w = containerRef.current.offsetWidth;
    const count = getVisibleCount(w);
    const max = Math.max(0, categories.length - count);
    const clamped = Math.max(0, Math.min(index, max));
    setCurrent(clamped);
    scrollToIndex(clamped);
  }, [categories.length, scrollToIndex]);

  // resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const count = getVisibleCount(el.offsetWidth);
      setVisibleCount(count);
      // إعادة الـ scroll للـ position الصح بعد resize
      const itemW = getItemWidth();
      el.scrollLeft = current * (itemW + GAP);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [current, getItemWidth]);

  // autoplay
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        if (!containerRef.current) return prev;
        const count = getVisibleCount(containerRef.current.offsetWidth);
        const max = Math.max(0, categories.length - count);
        const next = prev >= max ? 0 : prev + 1;
        scrollToIndex(next);
        return next;
      });
    }, AUTO_PLAY_MS);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [categories.length, scrollToIndex]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) goTo(current + (diff > 0 ? 1 : -1));
  };

  const max = Math.max(0, categories.length - visibleCount);
  const dots = max + 1;
  const itemW = `calc((100% - ${GAP * (visibleCount - 1)}px) / ${visibleCount})`;

  return (
    <div className="flex flex-col items-center gap-4" dir="rtl">
      <div
        ref={containerRef}
        className="w-full overflow-hidden"
        style={{ direction: "ltr" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex" style={{ gap: GAP }}>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="shrink-0 flex flex-col items-center gap-2 group"
              style={{ width: itemW }}
            >
              <div className="w-full aspect-square rounded-full bg-gray-100 border-2 border-gray-200 group-hover:border-purple-400 overflow-hidden relative transition-all duration-200 shadow-sm group-hover:shadow-md">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    loading="eager"
                    unoptimized
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width:400px) 30vw, (max-width:640px) 22vw, (max-width:1024px) 18vw, 13vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors w-full">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {dots > 1 && (
        <div className="flex gap-2">
          {Array.from({ length: dots }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-5 h-2 bg-purple-600" : "w-2 h-2 bg-gray-300 hover:bg-purple-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
