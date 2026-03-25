"use client";
import { useCompany } from "./hooks/useCompany";
import CompanyFields from "./components/CompanyFields";
import CompanyImages from "./components/CompanyImages";

export default function CompanyPage() {
  const { data, loading, saving, handleChange, handleImageChange, handleImageDelete, handleSave } = useCompany();

  if (loading) return <div className="text-center py-20 text-gray-500 text-xl">جاري التحميل...</div>;

  return (
    <div className="pt-2">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">بيانات الشركة</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-5">
        <CompanyFields data={data} onChange={handleChange} />
        <CompanyImages data={data} onImageChange={handleImageChange} onImageDelete={handleImageDelete} />
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-3 rounded-lg transition disabled:opacity-50"
        >
          {saving ? "جاري الحفظ..." : "حفظ البيانات"}
        </button>
      </div>
    </div>
  );
}
