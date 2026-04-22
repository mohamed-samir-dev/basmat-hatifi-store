"use client";

import { useState, useRef, useEffect } from "react";
import { IoCheckmarkCircle, IoDocumentTextOutline, IoListOutline, IoCardOutline, IoChevronDown } from "react-icons/io5";
import type { Product } from "../../../components/products/types";

const fmt = (n: number) => n.toLocaleString("ar-SA");

const specLabels: [keyof NonNullable<Product["specs"]>, string, string][] = [
  ["screen", "الشاشة", "📱"],
  ["processor", "المعالج", "⚡"],
  ["ram", "الرام", "🧠"],
  ["storage", "التخزين", "💾"],
  ["rearCamera", "الكاميرا الخلفية", "📸"],
  ["frontCamera", "الكاميرا الأمامية", "🤳"],
  ["battery", "البطارية", "🔋"],
  ["batteryLife", "عمر البطارية", "⏱️"],
  ["charging", "الشحن", "🔌"],
  ["os", "نظام التشغيل", "💻"],
  ["extras", "مميزات إضافية", "✨"],
];

interface ProductDetailsProps {
  installment?: Product["installment"];
  description?: string;
  specs?: Product["specs"];
}

type Tab = "specs" | "installment" | "description";

const tabMeta: Record<Tab, { icon: typeof IoListOutline; label: string }> = {
  specs: { icon: IoListOutline, label: "المواصفات" },
  description: { icon: IoDocumentTextOutline, label: "الوصف" },
  installment: { icon: IoCardOutline, label: "التقسيط" },
};

export default function ProductDetails({ installment, description, specs }: ProductDetailsProps) {
  const hasSpecs = specs && Object.values(specs).some(Boolean);
  const tabs: { key: Tab; show: boolean }[] = [
    { key: "specs", show: !!hasSpecs },
    { key: "description", show: !!description },
    { key: "installment", show: !!installment?.available },
  ];
  const visibleTabs = tabs.filter((t) => t.show);
  const [active, setActive] = useState<Tab>(visibleTabs[0]?.key || "specs");
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const idx = visibleTabs.findIndex((t) => t.key === active);
    const el = tabsRef.current[idx];
    if (el) {
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [active, visibleTabs.length]);

  if (!visibleTabs.length) return null;

  return (
    <div className="mt-8 sm:mt-12 bg-white rounded-3xl shadow-xl shadow-black/[.05] border border-gray-100/60 overflow-hidden">
      {/* ─── Tabs ─── */}
      <div className="relative border-b border-gray-100/80 overflow-x-auto scrollbar-hide">
        <div className="flex relative">
          {/* Sliding indicator */}
          <div
            className="absolute bottom-0 h-[3px] bg-gradient-to-l from-teal-500 to-emerald-500 rounded-full transition-all duration-400 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {visibleTabs.map((t, idx) => {
            const m = tabMeta[t.key];
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                ref={(el) => { tabsRef.current[idx] = el; }}
                onClick={() => setActive(t.key)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2.5 py-5 sm:py-6 text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isActive ? "text-teal-700" : "text-gray-400 hover:text-gray-500"
                }`}
              >
                <m.icon size={17} className={`transition-colors duration-300 ${isActive ? "text-teal-600" : ""}`} />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="p-5 sm:p-8">
        {/* Specs */}
        {active === "specs" && hasSpecs && (
          <div className="rounded-2xl overflow-hidden border border-gray-100/80">
            {specLabels.map(([key, label, emoji], i) =>
              specs[key] ? (
                <div
                  key={key}
                  className={`flex items-center text-xs sm:text-sm px-5 sm:px-6 py-4 sm:py-[18px] gap-4 transition-colors hover:bg-teal-50/30 ${
                    i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                  }`}
                >
                  <span className="text-base sm:text-lg">{emoji}</span>
                  <span className="text-gray-400 w-28 sm:w-40 shrink-0 font-semibold">{label}</span>
                  <span className="text-gray-800 flex-1 min-w-0 break-words font-semibold">{specs[key]}</span>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Description */}
        {active === "description" &&
          description &&
          (() => {
            const lines = description.split("\n").map((l) => l.trim()).filter(Boolean);
            const title = lines[0];
            const items = lines.slice(1);
            return (
              <div>
                {title && (
                  <div className="flex items-center gap-3.5 mb-6 pb-5 border-b border-gray-100/80">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-50 flex items-center justify-center shadow-sm border border-teal-100/50">
                      <IoDocumentTextOutline size={19} className="text-teal-600" />
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-gray-800">{title}</h3>
                  </div>
                )}
                {items.length > 0 && (
                  <div className="flex flex-col gap-2.5">
                    {items.map((line, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-3.5 px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl transition-colors hover:bg-teal-50/30 ${
                          i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                        }`}
                      >
                        <IoCheckmarkCircle size={17} className="text-teal-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                          {line.replace(/^[•\-\*]\s*/, "")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 bg-amber-50/80 border border-amber-100/60 rounded-2xl px-5 py-3.5 text-center">
                  <p className="text-[11px] sm:text-xs font-bold text-amber-700">
                    ⚠️ عدم استيفاء أي من الشروط أعلاه قد يؤدي إلى رفض الطلب
                  </p>
                </div>
              </div>
            );
          })()}

        {/* Installment */}
        {active === "installment" && installment?.available && (
          <div className="space-y-6">
            <div className="bg-gradient-to-l from-emerald-50/80 to-teal-50/60 rounded-2xl p-6 border border-emerald-100/40">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-sm">
                  <IoCardOutline size={18} className="text-emerald-600" />
                </div>
                <p className="text-sm sm:text-base font-bold text-emerald-800">احصل عليه بأقساط شهرية مريحة</p>
              </div>
              {installment.downPayment && (
                <p className="text-xs sm:text-sm text-emerald-700/80 mr-[52px]">مقدم {fmt(installment.downPayment)} ر.س والباقي أقساط</p>
              )}
              {installment.note && <p className="text-xs text-emerald-600/70 mt-2 mr-[52px]">{installment.note}</p>}
            </div>

            {installment.policy && (
              <div className="text-center py-3">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-700 bg-amber-50/80 px-5 py-2.5 rounded-full border border-amber-100/60">
                  ♕ {installment.policy} ♕
                </span>
              </div>
            )}

            {installment.conditions && installment.conditions.length > 0 && (
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-700 mb-4">شروط التقديم</p>
                <div className="flex flex-col gap-2.5">
                  {installment.conditions.map((c, i) => (
                    <div key={i} className="flex items-start gap-3.5 text-xs sm:text-sm text-gray-600 bg-gray-50/60 rounded-xl px-5 py-3.5 border border-gray-100/50 hover:bg-teal-50/30 transition-colors">
                      <IoCheckmarkCircle size={17} className="text-teal-500 shrink-0 mt-0.5" />
                      <span className="font-medium">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
