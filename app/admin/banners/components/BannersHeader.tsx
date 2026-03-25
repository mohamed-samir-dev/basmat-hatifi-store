"use client";
import { LABELS } from "../constants";

interface BannersHeaderProps {
  activeCount: number;
  filled: number;
  total: number;
  addingBanner: boolean;
  onAdd: () => void;
}

export default function BannersHeader({ activeCount, filled, total, addingBanner, onAdd }: BannersHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 shadow-sm px-8 py-6 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">إدارة البانرات</h1>
        <p className="text-gray-500 mt-1 text-sm">ارفع وعدّل صور البانرات التي تظهر في الصفحة الرئيسية</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{activeCount}</div>
            <div className="text-xs text-indigo-400 font-medium">مفعّل</div>
          </div>
          <div className="w-px h-8 bg-indigo-200" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">{filled - activeCount}</div>
            <div className="text-xs text-gray-400 font-medium">موقوف</div>
          </div>
          <div className="w-px h-8 bg-indigo-200" />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-300">{total - filled}</div>
            <div className="text-xs text-gray-300 font-medium">فارغ</div>
          </div>
        </div>
        {total < LABELS.length && (
          <button
            onClick={onAdd}
            disabled={addingBanner}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl transition shadow-sm disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {addingBanner ? "جاري الإضافة..." : "إضافة بانر"}
          </button>
        )}
      </div>
    </div>
  );
}
