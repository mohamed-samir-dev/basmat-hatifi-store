"use client";
import { fields } from "../constants";
import type { CompanyData } from "../types";

interface CompanyFieldsProps {
  data: CompanyData;
  onChange: (key: string, value: string) => void;
}

const inputClass = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500";

function FieldInput({ fieldKey, data, onChange }: { fieldKey: string; data: CompanyData; onChange: (k: string, v: string) => void }) {
  const label = fields.find((f) => f.key === fieldKey)?.label;
  return (
    <div>
      <label className="block text-base font-semibold text-gray-700 mb-1">{label}</label>
      <input value={data[fieldKey] || ""} onChange={(e) => onChange(fieldKey, e.target.value)} className={inputClass} />
    </div>
  );
}

export default function CompanyFields({ data, onChange }: CompanyFieldsProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-5">
        {["nameAr", "nameEn"].map((k) => <FieldInput key={k} fieldKey={k} data={data} onChange={onChange} />)}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {["addressAr", "addressEn"].map((k) => <FieldInput key={k} fieldKey={k} data={data} onChange={onChange} />)}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {["phone", "whatsapp"].map((k) => <FieldInput key={k} fieldKey={k} data={data} onChange={onChange} />)}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {["website", "email"].map((k) => <FieldInput key={k} fieldKey={k} data={data} onChange={onChange} />)}
      </div>
      <div className="grid grid-cols-2 gap-5">
        {["currencyAr", "currencyEn"].map((k) => <FieldInput key={k} fieldKey={k} data={data} onChange={onChange} />)}
      </div>
      <div className="grid grid-cols-3 gap-5">
        {["taxNumber", "shippingCompany", "paymentMethod"].map((k) => <FieldInput key={k} fieldKey={k} data={data} onChange={onChange} />)}
      </div>
      <div>
        <label className="block text-base font-semibold text-gray-700 mb-1">التفاصيل</label>
        <textarea value={data.details || ""} onChange={(e) => onChange("details", e.target.value)}
          rows={3} className={inputClass} />
      </div>
    </div>
  );
}
