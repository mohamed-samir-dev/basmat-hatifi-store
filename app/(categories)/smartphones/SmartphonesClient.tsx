"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoHomeOutline, IoChevronBack, IoArrowForward, IoArrowBack } from "react-icons/io5";
import ProductCard from "../../components/products/ProductCard";
import type { Product } from "../../components/products/types";
import { sortProducts } from "../../lib/sortProducts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SmartphonesClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        const filtered = data.filter((p) =>
          p.category?.includes("ايفون") ||
          p.category?.includes("جالكسي") ||
          p.category?.toLowerCase().includes("iphone") ||
          p.category?.toLowerCase().includes("samsung")
        );
        setProducts(sortProducts(filtered));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-teal-100 mb-3 sm:mb-4">
            <Link href="/" className="hover:text-white transition flex items-center gap-1">
              <IoHomeOutline size={13} />
              الرئيسية
            </Link>
            <IoChevronBack size={11} className="opacity-60" />
            <span className="text-white font-medium">الهواتف الذكية</span>
          </nav>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white mb-1.5">الهواتف الذكية</h1>
          {!loading && products.length > 0 && (
            <p className="text-teal-100 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1 bg-white/15 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-white font-medium">
                {products.length} منتج متوفر
              </span>
            </p>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100">
                <div className="w-full aspect-square bg-gray-50 animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3.5 bg-gray-100 animate-pulse rounded-full w-3/4" />
                  <div className="h-3.5 bg-gray-100 animate-pulse rounded-full w-1/2" />
                </div>
                <div className="h-10 bg-gray-50 animate-pulse mx-3 mb-3 rounded-xl" />
              </div>
            ))}
          </div>
        ) : !products.length ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center text-4xl">📱</div>
            <div>
              <p className="text-gray-700 text-base font-bold mb-1">المنتجات ستُضاف قريباً</p>
              <p className="text-gray-400 text-sm">هذا القسم قيد التحضير، تابعنا للمزيد</p>
            </div>
            <Link href="/" className="mt-2 text-sm font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1 bg-teal-50 px-4 py-2 rounded-full transition-colors">
              <IoArrowForward size={14} />
              العودة إلى الرئيسية
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-10">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium disabled:opacity-30 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all"
                >
                  <IoArrowForward size={14} />
                  السابق
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => { setPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      page === n
                        ? "bg-gradient-to-br from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-200"
                        : "border border-gray-200 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-medium disabled:opacity-30 hover:bg-teal-50 hover:border-teal-300 hover:text-teal-700 transition-all"
                >
                  التالي
                  <IoArrowBack size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
