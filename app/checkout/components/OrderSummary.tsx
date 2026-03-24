const fmt = (n: number) => n.toLocaleString("ar-SA");

export default function OrderSummary({ total, downPayment }: { total: number; downPayment: number }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-200">
        <span className="text-xs sm:text-sm text-gray-800 font-medium">مجموع السلة</span>
        <span className="text-xs sm:text-sm font-semibold text-gray-900">{fmt(total)} ريـــال</span>
      </div>
      <div className="flex justify-between items-center px-4 sm:px-5 py-3.5 sm:py-4 border-b border-gray-200">
        <span className="text-xs sm:text-sm text-gray-800 font-medium">الدفعة الأولى</span>
        <span className="text-xs sm:text-sm font-semibold text-gray-900">{fmt(downPayment)} ريـــال</span>
      </div>
    </div>
  );
}
