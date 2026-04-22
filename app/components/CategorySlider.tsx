"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

type Category = { name: string; count: number; image: string; href: string };

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const items = [...categories, ...categories];

  return (
    <div
      className="w-full overflow-hidden relative"
      dir="ltr"
      style={{
        maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
      }}
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-track">
        {items.map((cat, i) => (
          <motion.div
            key={`${cat.name}-${i}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: (i % categories.length) * 0.05 }}
            className="shrink-0 mx-2 sm:mx-3"
          >
            <Link
              href={cat.href}
              className="flex flex-col items-center gap-3 group"
              style={{ width: 120 }}
            >
              <div className="relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] rounded-2xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_8px_30px_-4px_rgba(13,148,136,0.35)]">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-emerald-50 border border-teal-100/80 rounded-2xl group-hover:border-teal-300 transition-colors duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-2xl" />
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-contain p-3 relative z-[1] group-hover:scale-110 transition-transform duration-300"
                    sizes="110px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl relative z-[1]">🛍️</div>
                )}
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-600 text-center leading-tight line-clamp-2 group-hover:text-teal-700 transition-colors duration-300 w-full" dir="rtl">
                {cat.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
