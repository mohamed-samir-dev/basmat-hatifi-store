"use client";

import { useState, useRef, useEffect } from "react";
import { IoCheckmarkCircle, IoDocumentTextOutline, IoListOutline, IoCardOutline, IoSparkles, IoRocketOutline, IoDiamondOutline } from "react-icons/io5";
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
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, visibleTabs.length]);

  if (!visibleTabs.length) return null;

  return (
    <div className="mt-6 sm:mt-8 md:mt-14 relative bg-white rounded-2xl sm:rounded-[24px] md:rounded-[28px] shadow-lg sm:shadow-xl shadow-black/[.04] border border-gray-100/50 overflow-hidden">
      {/* ─── Tabs ─── */}
      <div className="relative border-b border-gray-100/80 overflow-x-auto scrollbar-hide bg-gray-50/30">
        <div className="flex relative">
          <div
            className="absolute bottom-0 h-[2.5px] sm:h-[3px] bg-gradient-to-l from-teal-500 to-emerald-500 rounded-t-full transition-all duration-400 ease-out"
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
                className={`flex-1 min-w-[90px] sm:min-w-[120px] flex items-center justify-center gap-1.5 sm:gap-2.5 py-3.5 sm:py-5 md:py-6 text-[11px] sm:text-xs md:text-sm font-bold transition-all duration-300 ${
                  isActive ? "text-teal-700 bg-white/60" : "text-gray-400 hover:text-gray-500 hover:bg-white/30"
                }`}
              >
                <m.icon size={14} className={`transition-colors duration-300 sm:hidden ${isActive ? "text-teal-600" : ""}`} />
                <m.icon size={17} className={`transition-colors duration-300 hidden sm:block ${isActive ? "text-teal-600" : ""}`} />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="p-3.5 sm:p-5 md:p-8">
        {/* Specs */}
        {active === "specs" && hasSpecs && (
          <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100/80">
            {specLabels.map(([key, label, emoji], i) =>
              specs[key] ? (
                <div
                  key={key}
                  className={`flex items-start sm:items-center text-[11px] sm:text-xs md:text-sm px-3 sm:px-5 md:px-6 py-3 sm:py-4 md:py-[18px] gap-2.5 sm:gap-4 transition-colors hover:bg-teal-50/40 ${
                    i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                  }`}
                >
                  <span className="text-sm sm:text-base md:text-lg w-5 sm:w-7 text-center shrink-0">{emoji}</span>
                  <span className="text-gray-400 w-20 sm:w-28 md:w-40 shrink-0 font-semibold">{label}</span>
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
            const accentColors = [
              { bg: "from-teal-500/10 to-emerald-500/5", border: "border-teal-200/40", dot: "bg-teal-500", text: "text-teal-700", num: "from-teal-500 to-emerald-500" },
              { bg: "from-blue-500/10 to-indigo-500/5", border: "border-blue-200/40", dot: "bg-blue-500", text: "text-blue-700", num: "from-blue-500 to-indigo-500" },
              { bg: "from-violet-500/10 to-purple-500/5", border: "border-violet-200/40", dot: "bg-violet-500", text: "text-violet-700", num: "from-violet-500 to-purple-500" },
              { bg: "from-amber-500/10 to-orange-500/5", border: "border-amber-200/40", dot: "bg-amber-500", text: "text-amber-700", num: "from-amber-500 to-orange-500" },
              { bg: "from-rose-500/10 to-pink-500/5", border: "border-rose-200/40", dot: "bg-rose-500", text: "text-rose-700", num: "from-rose-500 to-pink-500" },
              { bg: "from-cyan-500/10 to-sky-500/5", border: "border-cyan-200/40", dot: "bg-cyan-500", text: "text-cyan-700", num: "from-cyan-500 to-sky-500" },
            ];
            return (
              <div className="relative">
                {/* Header */}
                {title && (
                  <div className="relative mb-5 sm:mb-7">
                    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-l from-slate-900 via-gray-900 to-slate-800 p-4 sm:p-5 md:p-6">
                      <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 20% 50%, rgba(20,184,166,.6) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(16,185,129,.4) 0%, transparent 50%)" }} />
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-l from-teal-400 via-emerald-400 to-cyan-400" />
                      <div className="relative flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-400/20 to-emerald-400/10 backdrop-blur-sm flex items-center justify-center border border-teal-400/20 shrink-0">
                          <IoDiamondOutline size={18} className="text-teal-300 sm:hidden" />
                          <IoDiamondOutline size={22} className="text-teal-300 hidden sm:block" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base md:text-lg font-black text-white leading-snug truncate">{title}</h3>
                          <p className="text-[10px] sm:text-[11px] text-teal-300/70 font-medium mt-0.5">تعرّف على أبرز المميزات</p>
                        </div>
                        <IoSparkles size={20} className="text-teal-400/40 mr-auto shrink-0 hidden sm:block" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Feature Cards Grid */}
                {items.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    {items.map((line, i) => {
                      const c = accentColors[i % accentColors.length];
                      const cleanLine = line.replace(/^[•\-\*]\s*/, "");
                      return (
                        <div
                          key={i}
                          className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} p-3.5 sm:p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-default`}
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                            <IoRocketOutline size={64} className="sm:hidden" />
                            <IoRocketOutline size={80} className="hidden sm:block" />
                          </div>
                          <div className="relative flex items-start gap-3 sm:gap-3.5">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br ${c.num} flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                              <span className="text-[10px] sm:text-[11px] font-black text-white">{i + 1}</span>
                            </div>
                            <p className="text-[11px] sm:text-xs md:text-sm text-gray-700 font-semibold leading-relaxed pt-1">
                              {cleanLine}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Bottom accent */}
                {items.length > 0 && (
                  <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-200 to-transparent" />
                    <IoCheckmarkCircle size={14} className="text-teal-400/60" />
                    <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">{items.length} ميزة</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent via-gray-200 to-transparent" />
                  </div>
                )}
              </div>
            );
          })()}

        {/* Installment */}
        {active === "installment" && installment?.available && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-l from-emerald-50/80 to-teal-50/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-100/40">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-sm shrink-0">
                  <IoCardOutline size={15} className="text-emerald-600 sm:hidden" />
                  <IoCardOutline size={18} className="text-emerald-600 hidden sm:block" />
                </div>
                <p className="text-xs sm:text-sm md:text-base font-bold text-emerald-800">احصل عليه بأقساط شهرية مريحة</p>
              </div>
              {installment.downPayment && (
                <p className="text-[11px] sm:text-xs md:text-sm text-emerald-700/80 mr-[42px] sm:mr-[52px]">مقدم {fmt(installment.downPayment)} ر.س والباقي أقساط</p>
              )}
              {installment.note && <p className="text-[10px] sm:text-xs text-emerald-600/70 mt-1.5 sm:mt-2 mr-[42px] sm:mr-[52px]">{installment.note}</p>}
            </div>

            {installment.policy && (
              <div className="text-center py-2 sm:py-3">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs md:text-sm font-bold text-amber-700 bg-amber-50/80 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full border border-amber-100/60">
                  ♕ {installment.policy} ♕
                </span>
              </div>
            )}

            {installment.conditions && installment.conditions.length > 0 && (
              <div>
                <p className="text-[11px] sm:text-xs md:text-sm font-bold text-gray-700 mb-3 sm:mb-4">شروط التقديم</p>
                <div className="flex flex-col gap-2 sm:gap-2.5">
                  {installment.conditions.map((c, i) => (
                    <div key={i} className="flex items-start gap-2.5 sm:gap-3.5 text-[11px] sm:text-xs md:text-sm text-gray-600 bg-gray-50/60 rounded-lg sm:rounded-xl px-3.5 sm:px-5 py-3 sm:py-3.5 border border-gray-100/50 hover:bg-teal-50/30 transition-colors">
                      <IoCheckmarkCircle size={15} className="text-teal-500 shrink-0 mt-0.5 sm:hidden" />
                      <IoCheckmarkCircle size={17} className="text-teal-500 shrink-0 mt-0.5 hidden sm:block" />
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
