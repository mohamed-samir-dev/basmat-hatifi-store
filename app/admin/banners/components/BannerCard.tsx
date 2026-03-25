"use client";
import Image from "next/image";
import { API, LABELS } from "../constants";
import type { BannerItem } from "../types";

interface BannerCardProps {
  banner: BannerItem;
  index: number;
  isLoading: boolean;
  inputRef: (el: HTMLInputElement | null) => void;
  onUpload: (index: number, file: File) => void;
  onToggle: (index: number) => void;
  onDeleteImage: (index: number) => void;
  onDeleteSlot: (index: number) => void;
}

export default function BannerCard({
  banner, index, isLoading, inputRef, onUpload, onToggle, onDeleteImage, onDeleteSlot,
}: BannerCardProps) {
  const hasImage = !!banner.url;

  return (
    <div
      className={`group relative bg-white rounded-3xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
        !banner.active && hasImage ? "opacity-60" : ""
      } ${hasImage ? "border-indigo-100" : "border-gray-100"}`}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full shadow-sm ${
          hasImage && banner.active ? "bg-emerald-500 text-white"
          : hasImage && !banner.active ? "bg-orange-400 text-white"
          : "bg-gray-100 text-gray-400"
        }`}>
          {hasImage && banner.active ? "✓ مفعّل" : hasImage ? "⏸ موقوف" : "فارغ"}
        </span>
      </div>

      {/* Image Area */}
      <div
        className={`relative w-full aspect-2.5/1 cursor-pointer overflow-hidden ${
          hasImage ? "bg-gray-900" : "bg-linear-to-br from-gray-50 to-gray-100"
        }`}
        onClick={() => !isLoading && (document.querySelector(`input[data-idx="${index}"]`) as HTMLInputElement)?.click()}
      >
        {hasImage ? (
          <>
            <Image
              src={`${API}${banner.url}`}
              alt={LABELS[index] || `بانر ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 text-gray-800 text-sm font-semibold px-4 py-2 rounded-xl shadow">
                🖼 تغيير الصورة
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 group-hover:bg-indigo-50 transition-colors duration-300">
            <div className="w-12 h-12 rounded-2xl bg-gray-200 group-hover:bg-indigo-100 flex items-center justify-center transition-colors duration-300">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-sm text-gray-400 group-hover:text-indigo-500 font-medium transition-colors">اضغط لرفع صورة</span>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-[3px] border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-indigo-600 font-medium">جاري التحميل...</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${hasImage && banner.active ? "bg-emerald-400" : hasImage ? "bg-orange-400" : "bg-gray-300"}`} />
          <span className="font-semibold text-gray-700">{LABELS[index] || `بانر ${index + 1}`}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            data-idx={index}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && onUpload(index, e.target.files[0])}
          />
          <button
            onClick={() => (document.querySelector(`input[data-idx="${index}"]`) as HTMLInputElement)?.click()}
            disabled={isLoading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition disabled:opacity-40"
          >
            {hasImage ? "تغيير" : "رفع"}
          </button>
          {hasImage && (
            <>
              <button
                onClick={() => onToggle(index)}
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition disabled:opacity-40 ${
                  banner.active
                    ? "bg-orange-50 hover:bg-orange-100 text-orange-500"
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                }`}
              >
                {banner.active ? "إيقاف" : "تفعيل"}
              </button>
              <button
                onClick={() => onDeleteImage(index)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-medium rounded-xl transition disabled:opacity-40"
              >
                حذف الصورة
              </button>
            </>
          )}
          <button
            onClick={() => onDeleteSlot(index)}
            disabled={isLoading}
            title="حذف البانر بالكامل"
            className="p-2 bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded-xl transition disabled:opacity-40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
