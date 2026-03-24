"use client";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { IoChevronForward, IoChevronBack } from "react-icons/io5";
import ProductCard from "./ProductCard";
import type { Product } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function CategoryRow({ category, items }: { category: string; items: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 260;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }, []);

  return (
    <div className="mb-10">
      {/* Category Divider */}
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6" dir="rtl">
        <button onClick={() => scroll("right")} className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition shrink-0">
          <IoChevronForward size={16} className="sm:hidden" />
          <IoChevronForward size={22} className="hidden sm:block" />
        </button>
        <div className="flex-1 h-px bg-gray-300" />
        <h2 className="text-sm sm:text-lg font-bold text-gray-700 whitespace-nowrap px-2 sm:px-3">{category}</h2>
        <div className="flex-1 h-px bg-gray-300" />
        <button onClick={() => scroll("left")} className="w-7 h-7 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-gray-300 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition shrink-0">
          <IoChevronBack size={16} className="sm:hidden" />
          <IoChevronBack size={22} className="hidden sm:block" />
        </button>
      </div>

      {/* Scrollable Products */}
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto scrollbar-hide scroll-smooth pb-2" dir="rtl">
        {items.map((p) => (
          <div key={p._id} className="w-[85vw] min-[301px]:w-[42vw] sm:w-[260px] sm:min-w-[260px] max-w-[300px] shrink-0">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach((p) => {
      const cat = p.category || "أخرى";
      (map[cat] ??= []).push(p);
    });
    return map;
  }, [products]);

  if (loading) return <p className="text-center text-gray-400 py-10">جاري التحميل...</p>;
  if (!products.length) return <p className="text-center text-gray-400 py-10">لا توجد منتجات حالياً</p>;

  return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8 overflow-hidden">
      {Object.entries(grouped).map(([category, items]) => (
        <CategoryRow key={category} category={category} items={items} />
      ))}
    </section>
  );
}
