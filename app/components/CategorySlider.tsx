"use client";
import Image from "next/image";
import Link from "next/link";

type Category = { name: string; count: number; image: string; href: string };

export default function CategorySlider({ categories }: { categories: Category[] }) {
  const items = [...categories, ...categories];

  return (
    <div className="w-full overflow-hidden relative" dir="ltr" style={{ maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)" }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee-track">
        {items.map((cat, i) => (
          <Link
            key={`${cat.name}-${i}`}
            href={cat.href}
            className="shrink-0 flex flex-col items-center gap-2.5 group mx-2 sm:mx-3"
            style={{ width: 100 }}
          >
            <div className="w-[72px] h-[72px] sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 group-hover:border-teal-400 group-hover:from-teal-100 group-hover:to-emerald-100 overflow-hidden relative transition-all duration-300 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  unoptimized
                  className="object-contain p-2.5 group-hover:scale-110 transition-transform duration-300"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
              )}
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-gray-600 text-center leading-tight line-clamp-2 group-hover:text-teal-700 transition-colors w-full" dir="rtl">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
