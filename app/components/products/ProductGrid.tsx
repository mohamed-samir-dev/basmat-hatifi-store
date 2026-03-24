"use client";
import { useEffect, useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import type { Product } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function CategoryRow({ category, items }: { category: string; items: Product[] }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6" dir="rtl">
        <div className="flex-1 h-px bg-gray-300" />
        <h2 className="text-sm sm:text-lg font-bold text-gray-700 whitespace-nowrap px-2 sm:px-3">{category}</h2>
        <div className="flex-1 h-px bg-gray-300" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {items.map((p) => (
          <ProductCard key={p._id} product={p} />
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
