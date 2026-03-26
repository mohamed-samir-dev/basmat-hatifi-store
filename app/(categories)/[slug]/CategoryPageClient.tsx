"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "../../components/products/ProductCard";
import type { Product } from "../../components/products/types";
import { slugConfigs } from "../../lib/categoryConfig";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function filterProducts(products: Product[], slug: string): Product[] {
  const config = slugConfigs[slug];
  if (!config) return products;
  const { brand, category, nameIncludes } = config.filters;
  return products.filter((p) => {
    const matchBrand = brand ? p.brand?.toLowerCase() === brand.toLowerCase() : true;
    const matchCategory = category ? p.category === category : true;
    const matchName = nameIncludes?.length
      ? nameIncludes.some((kw) => p.name?.toLowerCase().includes(kw.toLowerCase()))
      : true;
    return matchBrand && matchCategory && matchName;
  });
}

export default function CategoryPageClient({ slug }: { slug: string }) {
  const config = slugConfigs[slug];

  if (!config) notFound();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const brand = config?.filters.brand ?? "";
    const query = brand ? `?brand=${brand}` : "";
    fetch(`${API}/api/products${query}`)
      .then((r) => r.json())
      .then((data: Product[]) => setProducts(filterProducts(data, slug)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, config?.filters.brand]);

  const label = config?.label ?? slug;
  const parentLabel = config?.parentLabel ?? "";
  const parentHref = config?.parentHref ?? "/";

  return (
    <main className="min-h-screen bg-gray-50" dir="rtl">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">
            <Link href="/" className="hover:text-purple-600 transition">الرئيسية</Link>
            <span>/</span>
            <Link href={parentHref} className="hover:text-purple-600 transition">{parentLabel}</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[140px] sm:max-w-none">{label}</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800">{label}</h1>
          <p className="text-xs sm:text-sm text-gray-500">جميع المنتجات المتوفرة</p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-52 sm:h-64 animate-pulse" />
            ))}
          </div>
        ) : !products.length ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <span className="text-5xl">📦</span>
            <p className="text-gray-500 text-base font-medium">المنتجات ستُضاف قريباً</p>
            <p className="text-gray-400 text-sm">هذا القسم قيد التحضير، تابعنا للمزيد</p>
            <Link href="/" className="mt-2 text-sm text-purple-600 hover:underline">← العودة إلى الرئيسية</Link>
          </div>
        ) : (
          <>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">{products.length} منتج</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {products.map((p) => (<ProductCard key={p._id} product={p} />))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
