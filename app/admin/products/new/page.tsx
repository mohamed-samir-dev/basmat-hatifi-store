"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type SubCat = { name: string; category: string };

export default function NewProductPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<SubCat[]>([]);

  const [form, setForm] = useState({
    name: "",
    originalPrice: "",
    salePrice: "",
    category: "",
    description: "",
    inStock: "true",
  });

  useEffect(() => {
    fetch("/api/admin/sub-categories", { credentials: "include" })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setCategories(data));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/products/upload-image", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الرفع");
      setImageUrl(data.url);
      toast.success("تم رفع الصورة ✅");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "فشل رفع الصورة");
      setImagePreview("");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.originalPrice) return toast.error("الاسم والسعر مطلوبان");
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name,
        originalPrice: Number(form.originalPrice),
        price: Number(form.salePrice || form.originalPrice),
        category: form.category,
        description: form.description,
        inStock: form.inStock === "true",
      };
      if (form.salePrice) body.salePrice = Number(form.salePrice);
      if (imageUrl) {
        body.image = imageUrl;
        body.images = [imageUrl];
      }

      const res = await fetch("/api/admin/products", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الحفظ");
      toast.success("تم إضافة المنتج بنجاح ✅");
      router.push("/admin/products");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "فشل الحفظ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div dir="rtl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/admin/products")} className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
          ← رجوع للمنتجات
        </button>
        <h1 className="text-2xl font-bold text-gray-800">إضافة منتج جديد</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* العمود الأيمن - الصورة */}
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">صورة المنتج</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors h-56"
            >
              {imagePreview ? (
                <div className="relative w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="preview" className="w-full h-full object-contain rounded-xl" />
                  {uploading && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
                      <span className="text-sm text-blue-600 font-medium">جاري الرفع...</span>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <span className="text-5xl text-gray-200 mb-3">📷</span>
                  <span className="text-sm text-gray-500">اضغط لاختيار صورة</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP</span>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            {imageUrl && !uploading && (
              <p className="text-xs text-green-600 mt-2 flex items-center gap-1">✅ تم رفع الصورة بنجاح</p>
            )}
          </div>

          {/* العمود الأيسر - البيانات */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* الاسم */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="مثال: iPhone 15 Pro Max"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* الأسعار */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر الأساسي (ر.س) *</label>
                <input
                  name="originalPrice"
                  type="number"
                  min="0"
                  step="any"
                  value={form.originalPrice}
                  onChange={handleChange}
                  required
                  placeholder="مثال: 5000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">السعر الأصلي للمنتج (يُشطب عليه عند وجود خصم)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">سعر البيع بعد الخصم (ر.س)</label>
                <input
                  name="salePrice"
                  type="number"
                  min="0"
                  step="any"
                  value={form.salePrice}
                  onChange={handleChange}
                  placeholder="مثال: 4500"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-400 mt-1">اتركه فارغ لو مفيش خصم - هذا السعر اللي يدفعه العميل</p>
              </div>
            </div>

            {/* التصنيف والحالة */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- اختر تصنيف --</option>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select
                  name="inStock"
                  value={form.inStock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">متوفر</option>
                  <option value="false">غير متوفر</option>
                </select>
              </div>
            </div>

            {/* الوصف */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="وصف المنتج..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

          </div>
        </div>

        {/* أزرار */}
        <div className="flex gap-3 pt-5 mt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {saving ? "جاري الحفظ..." : "حفظ المنتج"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-8 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}
