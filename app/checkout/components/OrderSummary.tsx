const fmt = (n: number) => n.toLocaleString("en-US");

export default function OrderSummary({ total, downPayment }: { total: number; downPayment: number }) {
  const remaining = total - downPayment;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-gray-500">مجموع السلة</span>
          <span className="text-gray-800 font-bold">{fmt(total)} ر.س</span>
        </div>
        {downPayment > 0 && (
          <>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500">الدفعة الأولى</span>
              <span className="text-gray-800 font-bold">{fmt(downPayment)} ر.س</span>
            </div>
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="text-gray-500">المتبقي للأقساط</span>
              <span className="text-gray-800 font-bold">{fmt(remaining > 0 ? remaining : 0)} ر.س</span>
            </div>
          </>
        )}
        <div className="flex justify-between items-center text-xs sm:text-sm">
          <span className="text-gray-500">التوصيل</span>
          <span className="text-emerald-600 font-bold text-xs">مجاني</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 p-4 flex justify-between items-center">
        <span className="text-white font-bold text-sm">المطلوب الآن</span>
        <span className="text-white text-lg sm:text-xl font-black">
          {fmt(downPayment > 0 ? downPayment : total)} <span className="text-xs font-medium text-teal-100">ر.س</span>
        </span>
      </div>
    </div>
  );
}
