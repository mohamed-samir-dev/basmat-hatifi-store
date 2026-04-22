"use client";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";

const AUTO_PLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function BannerSlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const touchStart = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback(
    (i: number, dir?: number) => {
      const next = (i + images.length) % images.length;
      setDirection(dir ?? (next > current ? 1 : -1));
      setCurrent(next);
      setProgress(0);
    },
    [images.length, current]
  );

  // Auto-play + progress bar
  useEffect(() => {
    const startTime = Date.now();
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min(elapsed / AUTO_PLAY_MS, 1));
    }, 30);
    intervalRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % images.length);
      setDirection(1);
    }, AUTO_PLAY_MS);
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, images.length]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > SWIPE_THRESHOLD)
      goTo(current + (diff > 0 ? 1 : -1), diff > 0 ? 1 : -1);
  };

  const variants = {
    enter: (d: number) => ({ x: `${d * 100}%`, opacity: 0, scale: 1.05 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: `${-d * 100}%`, opacity: 0, scale: 0.95 }),
  };

  return (
    <section className="w-full px-3 sm:px-6 lg:px-8 pt-4 pb-2" dir="rtl">
      <div
        className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-3xl group"
        style={{
          boxShadow:
            "0 25px 60px -12px rgba(13, 148, 136, 0.25), 0 0 0 1px rgba(13, 148, 136, 0.08)",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Slides */}
        <div className="relative aspect-[2/1] sm:aspect-[2.2/1]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={images[current]}
                alt={`banner ${current + 1}`}
                fill
                className="object-cover"
                priority={current === 0}
                unoptimized
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-teal-900/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Animated floating text */}
          <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-10 z-10 max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2
                  className="text-lg sm:text-2xl lg:text-3xl font-black text-white drop-shadow-lg leading-tight"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
                >
                  بصمة هاتفي المعتمد
                </h2>
                <p className="text-xs sm:text-sm text-white/80 mt-1 sm:mt-2 font-medium">
                  أفضل العروض على الأجهزة الذكية
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Decorative corner glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goTo(current + 1, 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
              aria-label="التالي"
            >
              <IoChevronForward size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goTo(current - 1, -1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
              aria-label="السابق"
            >
              <IoChevronBack size={20} />
            </motion.button>
          </>
        )}

        {/* Progress dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-1.5 rounded-full overflow-hidden transition-all duration-500"
                style={{ width: i === current ? 32 : 12 }}
              >
                <span className="absolute inset-0 bg-white/30 rounded-full" />
                {i === current && (
                  <motion.span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, #5eead4, #14b8a6, #0d9488)",
                      transformOrigin: "right",
                      scaleX: progress,
                    }}
                  />
                )}
                {i !== current && (
                  <span className="absolute inset-0 bg-white/40 rounded-full" />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Top shimmer line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-300/50 to-transparent" />
      </div>
    </section>
  );
}
