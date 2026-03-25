"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const AUTO_PLAY_MS = 4000;
const SWIPE_THRESHOLD = 50;

export default function Banner() {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`${API}/api/admin/banners`)
      .then((r) => r.json())
      .then((data: { url: string; active: boolean }[]) => {
        if (Array.isArray(data))
          setImages(data.filter((b) => b.url && b.active).map((b) => `${API}${b.url}`));
      })
      .catch(() => setImages(["/banner1.webp", "/banner2.webp"]));
  }, []);

  const goTo = useCallback((i: number) => {
    if (!images.length) return;
    setCurrent((i + images.length) % images.length);
  }, [images]);

  const resetAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => goTo(current + 1), AUTO_PLAY_MS);
  }, [current, goTo]);

  useEffect(() => {
    if (!images.length) return;
    resetAutoPlay();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetAutoPlay, images]);

  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) goTo(current + (diff > 0 ? 1 : -1));
  };

  if (!images.length) return null;

  return (
    <section className="w-full flex justify-center py-6 px-4">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(${current * 100}%)` }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {images.map((src, i) => (
            <div key={i} className="min-w-full relative aspect-[1.8/1]">
              <Image src={src} alt={`banner ${i + 1}`} fill className="object-cover" priority={i === 0} unoptimized />
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i === current ? "bg-white" : "bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
