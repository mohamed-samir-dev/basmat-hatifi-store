"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoCartOutline, IoArrowForward, IoHomeOutline, IoBagHandleOutline } from "react-icons/io5";
import CheckoutStepper from "../components/CheckoutStepper";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;
  const installmentMonths = mounted ? Math.max(...items.map((i) => i.product.installment?.months ?? 0)) || undefined : undefined;

  if (!mounted) return null;

  if (items.length === 0)
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center gap-5 px-4" dir="rtl">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center">
          <IoCartOutline size={36} className="text-teal-400" />
        </div>
        <div className="text-center">
          <p className="text-gray-800 text-lg font-bold">السلة فارغة</p>
          <p className="text-gray-400 text-sm mt-1">لم تضف أي منتجات بعد</p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-8 py-3 rounded-full font-bold text-sm hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg shadow-teal-200/50"
        >
          تصفح المنتجات
        </button>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24" dir="rtl">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 sticky top-0 z-10 shadow-md">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="w-8 h-8 sm:w-9 sm:h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition text-white">
              <IoArrowForward size={18} />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <IoBagHandleOutline size={18} />
                سلة التسوق
              </h1>
              <p className="text-[11px] sm:text-xs text-teal-100">{count} منتج</p>
            </div>
          </div>
          <Link href="/" className="w-8 h-8 sm:w-9 sm:h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition text-white">
            <IoHomeOutline size={16} />
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        <CheckoutStepper active="cart" />
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-0 sm:pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">

          {/* ── Cart Items (order 1 always) ── */}
          <div className="lg:col-span-3 order-1">
            <h2 className="text-sm sm:text-base font-extrabold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full" />
              المنتجات ({count})
            </h2>
            <div className="space-y-2.5">
              {items.map(({ product, qty }) => (
                <CartItem
                  key={product._id}
                  product={product}
                  qty={qty}
                  onUpdateQty={updateQty}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </div>

          {/* ── Order Summary (order 2 on mobile, stays right on desktop) ── */}
          <div className="lg:col-span-2 order-2 lg:order-3 lg:row-span-2">
            <div className="lg:sticky lg:top-20">
              <h2 className="text-sm sm:text-base font-extrabold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full" />
                ملخص الطلب
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Items summary */}
                <div className="p-4 space-y-3">
                  {items.map(({ product, qty }) => {
                    const price = product.salePrice ?? product.originalPrice ?? product.price;
                    return (
                      <div key={product._id} className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600 truncate max-w-[60%]">{product.name} × {qty}</span>
                        <span className="text-gray-800 font-bold shrink-0">{fmt(price * qty)} ر.س</span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-t border-gray-100 bg-gray-50/50 p-4 space-y-2.5">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-500">المجموع الفرعي</span>
                    <span className="text-gray-700 font-bold">{fmt(total)} ر.س</span>
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-gray-500">التوصيل</span>
                    <span className="text-emerald-600 font-bold text-xs">مجاني</span>
                  </div>
                </div>

                {/* Grand total */}
                <div className="bg-gradient-to-r from-teal-700 to-emerald-700 p-4 flex justify-between items-center">
                  <span className="text-white font-bold text-sm">الإجمالي</span>
                  <span className="text-white text-lg sm:text-xl font-black">
                    {fmt(total)} <span className="text-xs font-medium text-teal-100">ر.س</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Customer Form (order 3 on mobile, order 2 on desktop) ── */}
          <div className="lg:col-span-3 order-3 lg:order-2">
            <h2 className="text-sm sm:text-base font-extrabold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full" />
              بيانات العميل
            </h2>
            <CustomerForm
              total={total}
              itemCount={count}
              initialData={customer}
              installmentMonths={installmentMonths}
              onSubmit={(info: CustomerInfo) => {
                setCustomer(info);
                router.push("/checkout");
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
