"use client";
import { imageFields, toFullUrl } from "../constants";
import type { CompanyData } from "../types";

interface CompanyImagesProps {
  data: CompanyData;
  onImageChange: (key: string, file: File) => void;
}

export default function CompanyImages({ data, onImageChange }: CompanyImagesProps) {
  return (
    <div className="grid grid-cols-4 gap-5">
      {imageFields.map(({ key, label }) => (
        <div key={key}>
          <label className="block text-base font-semibold text-gray-700 mb-1">{label}</label>
          {data[key] && (
            <img src={toFullUrl(data[key])} alt={label} className="h-14 object-contain mb-2 rounded border" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && onImageChange(key, e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"
          />
        </div>
      ))}
    </div>
  );
}
