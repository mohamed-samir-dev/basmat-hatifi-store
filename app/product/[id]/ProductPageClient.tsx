"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoArrowForward, IoShareSocial } from "react-icons/io5";
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
  const [scrolled, setScrolled] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  if (loading)
    return (
      <main className="min-h-screen bg-[#f8f9fb]" dir="rtl">
        <div className="h-[340px] sm:h-[400px] bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 animate-pulse" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7 bg-white rounded-3xl p-4 shadow-xl">
              <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-xl space-y-4">
                <div className="h-5 w-24 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-7 w-4/5 bg-gray-100 rounded-full animate-pulse" />
                <div className="h-10 w-2/5 bg-gray-100 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb]">
        <p className="text-gray-400 text-lg">المنتج غير موجود</p>
      </div>
    );

  const resolveImg = (src: string) =>
    src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;
  const merged = [...(product.images || []), ...(product.image ? [product.image] : [])];
  const allImages = [...new Set(merged)].map(resolveImg);

  const handleShare = async () => {
    try {
      await navigator.share({ title: product.name, url: window.location.href });
    } catch {}
  };

  return (
    <>
      <style>{`
        @keyframes meshFloat{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(.97)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleUp{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .pdp-mesh-1{animation:meshFloat 8s ease-in-out infinite}
        .pdp-mesh-2{animation:meshFloat 10s ease-in-out infinite reverse}
        .pdp-mesh-3{animation:meshFloat 12s ease-in-out infinite 2s}
        .pdp-slide{animation:slideUp .55s cubic-bezier(.22,1,.36,1) both}
        .pdp-pop{animation:scaleUp .5s cubic-bezier(.22,1,.36,1) both}
        .pdp-nav-glass{background:rgba(255,255,255,.08);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.12)}
        .pdp-nav-solid{background:rgba(255,255,255,.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);box-shadow:0 1px 3px rgba(0,0,0,.06),0 8px 24px rgba(0,0,0,.04)}
        .pdp-cta-shine{background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);background-size:200% 100%;animation:shimmer 2.5s infinite}
      `}</style>

      <main className="min-h-screen pb-28 sm:pb-8" dir="rtl" style={{ background: "#f8f9fb" }}>
        {/* ─── Sticky Nav ─── */}
        <div className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? "pdp-nav-solid" : ""}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                  scrolled
                    ? "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80"
                    : "pdp-nav-glass text-white hover:bg-white/15"
                }`}
              >
                <IoArrowForward size={19} />
              </button>
              <h1
                className={`text-sm font-bold truncate max-w-[180px] sm:max-w-xs transition-all duration-300 ${
                  scrolled ? "text-gray-800 opacity-100 translate-y-0" : "text-white/0 -translate-y-2"
                }`}
              >
                {product.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                  scrolled
                    ? "bg-gray-100/80 text-gray-700 hover:bg-gray-200/80"
                    : "pdp-nav-glass text-white hover:bg-white/15"
                }`}
              >
                <IoShareSocial size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Hero with Mesh Gradient ─── */}
        <div className="-mt-[56px] pt-[56px] relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0c4a4e 0%, #0a6b5a 35%, #147a6e 65%, #0f5e52 100%)" }}>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="pdp-mesh-1 absolute w-[500px] h-[500px] rounded-full opacity-30" style={{ background: "radial-gradient(circle, rgba(16,185,129,.4) 0%, transparent 70%)", top: "-15%", right: "-10%" }} />
            <div className="pdp-mesh-2 absolute w-[400px] h-[400px] rounded-full opacity-25" style={{ background: "radial-gradient(circle, rgba(20,184,166,.5) 0%, transparent 70%)", bottom: "-10%", left: "-5%" }} />
            <div className="pdp-mesh-3 absolute w-[300px] h-[300px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, rgba(52,211,153,.3) 0%, transparent 70%)", top: "30%", left: "40%" }} />
            <div className="absolute inset-0" style={{ background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-20 sm:pb-28 text-center">
            {product.brand && (
              <div className="pdp-slide mb-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-white/90 bg-white/[.12] backdrop-blur-md px-4 py-2 rounded-full border border-white/[.15] tracking-wide uppercase">
                  {product.brand}
                </span>
              </div>
            )}
            <h2 className="pdp-slide text-2xl sm:text-4xl lg:text-[2.75rem] font-black text-white leading-[1.3] mb-3 tracking-tight" style={{ animationDelay: ".06s", textShadow: "0 2px 20px rgba(0,0,0,.15)" }}>
              {product.name}
            </h2>
            {(product.color || product.storage || product.network) && (
              <div className="pdp-slide flex gap-2 justify-center flex-wrap mt-3" style={{ animationDelay: ".12s" }}>
                {[product.color, product.storage, product.network].filter(Boolean).map((t, i) => (
                  <span key={i} className="text-[11px] sm:text-xs text-white/75 bg-white/[.08] backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/[.1] font-medium">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Curved bottom */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-[40px] sm:h-[60px]">
              <path d="M0,40 C360,80 720,0 1080,50 C1260,65 1380,55 1440,40 L1440,80 L0,80Z" fill="#f8f9fb" />
            </svg>
          </div>
        </div>

        {/* ─── Content ─── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
            <div className="lg:col-span-7 pdp-pop">
              <ProductImages images={allImages} name={product.name} discountPercent={product.discountPercent} />
            </div>
            <div className="lg:col-span-5 pdp-pop" style={{ animationDelay: ".1s" }}>
              <ProductInfo
                product={product}
                addedToCart={addedToCart}
                onAddToCart={() => { addItem(product); setAddedToCart(true); }}
              />
            </div>
          </div>

          <ProductDetails installment={product.installment} description={product.description} specs={product.specs} />
          <SimilarProducts product={product} />
        </div>

        {/* ─── Mobile Floating CTA ─── */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
          <div className="bg-white/[.97] backdrop-blur-2xl border-t border-gray-200/60 px-4 py-3.5 shadow-[0_-4px_24px_rgba(0,0,0,.06)]">
            <div className="flex items-center gap-3" dir="rtl">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 truncate mb-0.5">{product.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-gray-900">
                    {(product.salePrice ?? product.originalPrice ?? 0).toLocaleString("en-US")}
                  </span>
                  <span className="text-[11px] font-bold text-gray-500">ر.س</span>
                </div>
              </div>
              {!addedToCart ? (
                <button
                  onClick={() => { addItem(product); setAddedToCart(true); }}
                  className="relative overflow-hidden bg-gradient-to-l from-teal-600 to-emerald-600 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-teal-600/25 active:scale-[.97] transition-transform"
                >
                  <span className="absolute inset-0 pdp-cta-shine" />
                  <span className="relative">أضف للسلة</span>
                </button>
              ) : (
                <button
                  onClick={() => router.push("/cart")}
                  className="bg-emerald-600 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center gap-2"
                >
                  <span>عرض السلة</span>
                  <span className="text-emerald-200">✓</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
