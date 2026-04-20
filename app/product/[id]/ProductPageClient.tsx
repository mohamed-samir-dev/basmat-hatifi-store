"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowForward, IoHomeOutline, IoChevronBack } from "react-icons/io5";
import type { Product } from "../../components/products/types";
import { useCartStore } from "../../store/cartStore";
import ProductImages from "./components/ProductImages";
import ProductInfo from "./components/ProductInfo";
import ProductDetails from "./components/ProductDetails";
import SimilarProducts from "./components/SimilarProducts";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductPageClient({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 h-14" />
        <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="aspect-square bg-gray-50 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
                <div className="h-4 w-20 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-5 w-1/3 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1,2,3,4].map(i => <div key={i} className="h-16 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
              </div>
              <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    );

  if (!product)
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-teal-50 flex items-center justify-center text-4xl">📦</div>
          <p className="text-gray-700 font-bold text-lg">المنتج غير موجود</p>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 bg-teal-50 px-4 py-2 rounded-full hover:bg-teal-100 transition">
            <IoArrowForward size={14} />
            العودة للرئيسية
          </Link>
        </div>
      </main>
    );

  const resolveImg = (src: string) =>
    src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;

  const allImages = (product.images?.length ? product.images : product.image ? [product.image] : []).map(resolveImg);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-16" dir="rtl">
      {/* ── Sticky Header ── */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition text-white shrink-0"
          >
            <IoArrowForward size={18} />
          </button>
          <h1 className="text-xs sm:text-sm font-semibold text-white/90 truncate flex-1">{product.name}</h1>
          <Link href="/" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition text-white shrink-0">
            <IoHomeOutline size={16} />
          </Link>
        </div>
      </div>

      {/* ── Breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 pt-4 pb-2">
        <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-400">
          <Link href="/" className="hover:text-teal-600 transition flex items-center gap-1">
            <IoHomeOutline size={12} />
            الرئيسية
          </Link>
          {product.category && (
            <>
              <IoChevronBack size={10} className="opacity-50" />
              <span className="text-gray-400">{product.category}</span>
            </>
          )}
          <IoChevronBack size={10} className="opacity-50" />
          <span className="text-gray-600 truncate max-w-[150px] sm:max-w-none">{product.name}</span>
        </nav>
      </div>

      {/* ── Product Content ── */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
          <ProductImages images={allImages} name={product.name} discountPercent={product.discountPercent} />
          <ProductInfo
            product={product}
            addedToCart={addedToCart}
            onAddToCart={() => { addItem(product); setAddedToCart(true); }}
          />
        </div>
        <ProductDetails installment={product.installment} description={product.description} specs={product.specs} />
        <SimilarProducts product={product} />
      </div>
    </main>
  );
}
