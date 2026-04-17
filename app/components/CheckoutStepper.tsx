"use client";

import { IoCartOutline, IoCardOutline, IoCheckmarkCircleOutline } from "react-icons/io5";

const steps = [
  { key: "cart", label: "السلة", icon: IoCartOutline },
  { key: "payment", label: "الدفع", icon: IoCardOutline },
  { key: "confirm", label: "التأكيد", icon: IoCheckmarkCircleOutline },
];

export default function CheckoutStepper({ active }: { active: "cart" | "payment" | "confirm" }) {
  const activeIdx = steps.findIndex(s => s.key === active);

  return (
    <div className="flex items-center justify-center gap-0 py-4" dir="rtl">
      {steps.map((step, i) => {
        const done = i < activeIdx;
        const current = i === activeIdx;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all ${
                  current
                    ? "bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-200/50 scale-110"
                    : done
                    ? "bg-teal-100 text-teal-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon size={current ? 22 : 20} />
              </div>
              <span
                className={`text-[11px] sm:text-xs font-bold transition-colors ${
                  current ? "text-teal-700" : done ? "text-teal-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`w-12 sm:w-20 h-0.5 rounded-full mx-2 sm:mx-3 mb-5 transition-colors ${
                  i < activeIdx ? "bg-teal-400" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
