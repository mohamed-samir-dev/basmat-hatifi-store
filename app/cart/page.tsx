"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoCartOutline, IoChevronBack } from "react-icons/io5";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CartItem from "./components/CartItem";
import CustomerForm from "./components/CustomerForm";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const total = mounted ? totalPrice() : 0;
  const count = mounted ? totalItems() : 0;

  if (!mounted) return null;

  if (items.length === 0)
    return (
      <main className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-5 px-4" dir="rtl">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
          <IoCartOutline size={36} className="text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-gray-800 text-lg font-bold">السلة فارغة</p>
          <p className="text-gray-400 text-sm mt-1">لم تضف أي منتجات بعد</p>
        </div>
        <button onClick={() => router.push("/")} className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition">
          تصفح المنتجات
        </button>
      </main>
    );

  return (
    <main className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
              <IoChevronBack size={18} className="text-gray-600 rotate-180" />
            </Link>
            <div>
              <h1 className="text-base font-extrabold text-gray-900">سلة التسوق</h1>
              <p className="text-xs text-gray-500">{count} منتج</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 pt-4 space-y-3">
        {items.map(({ product, qty }) => (
          <CartItem
            key={product._id}
            product={product}
            qty={qty}
            onUpdateQty={updateQty}
            onRemove={removeItem}
          />
        ))}

        <div className="bg-gray-900 rounded-2xl p-3 sm:p-4 space-y-2.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">المجموع</span>
            <span className="text-gray-200 font-bold">{fmt(total)} ر.س</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300">التوصيل</span>
            <span className="text-green-400 font-bold text-xs">مجاني</span>
          </div>
          <div className="border-t border-gray-700 pt-2.5 flex justify-between items-center">
            <span className="text-white font-bold text-sm">الإجمالي</span>
            <span className="text-white text-lg font-extrabold">{fmt(total)} <span className="text-xs font-medium text-gray-300">ر.س</span></span>
          </div>
        </div>

        <p className="text-sm font-extrabold text-gray-800 pt-2 pr-1">بيانات العميل</p>

        <CustomerForm
          total={total}
          itemCount={count}
          initialData={customer}
          onSubmit={(info: CustomerInfo) => {
            setCustomer(info);
            router.push("/checkout");
          }}
        />
      </div>
    </main>
  );
}
