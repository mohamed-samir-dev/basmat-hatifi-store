"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API } from "../../lib/api";

type Product = {
  _id: string;
  name: string;
  category: string;
  originalPrice: number;
  salePrice?: number;
};

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  async function fetchProducts() {
    const res = await fetch(`${API}/api/products`, { credentials: "include" });
    if (res.ok) setProducts(await res.json());
  }

  useEffect(() => {
    fetch(`${API}/api/products`, { credentials: "include" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data) setProducts(data); });
  }, []);

  async function confirmDeleteAction() {
    if (!confirmDelete) return;
    const { id, name } = confirmDelete;
    setConfirmDelete(null);
    const res = await fetch(`${API}/api/products/${id}`, { method: "DELETE", credentials: "include" });
    const data = await res.json();
    if (!res.ok) return toast.error(data.message || "فشل الحذف");
    toast.success(`تم حذف "${name}" بنجاح ✅`);
    fetchProducts();
  }

  const filtered = products.filter(
    (p) => p.name?.includes(search) || p.category?.includes(search)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">الأصناف</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-gray-100">
          <span className="text-sm text-gray-500">
            إجمالي المنتجات: <span className="font-bold text-gray-700">{products.length}</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-72"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-sm text-right">
            <thead className="bg-gray-50 text-gray-600 font-semibold text-base">
              <tr>
                <th className="px-5 py-3 w-12">#</th>
                <th className="px-5 py-3 min-w-[200px]">الاسم</th>
                <th className="px-5 py-3 min-w-[140px]">التصنيف</th>
                <th className="px-5 py-3 min-w-[130px]">السعر</th>
                <th className="px-5 py-3 min-w-[100px]">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p, i) => (
                <tr key={p._id} className="hover:bg-gray-50 text-base">
                  <td className="px-5 py-3 text-gray-400 font-medium">{i + 1}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="px-5 py-3 text-gray-600">{p.category || "—"}</td>
                  <td className="px-5 py-3 text-gray-700">
                    {p.salePrice ? (
                      <span>
                        <span className="text-green-600 font-semibold">{p.salePrice} ر.س</span>
                        <span className="text-gray-400 line-through text-xs mr-1">{p.originalPrice}</span>
                      </span>
                    ) : (
                      <span>{p.originalPrice} ر.س</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => router.push(`/admin/products/${p._id}/edit`)} className="text-blue-500 hover:text-blue-700" title="تعديل">
                        <EditIcon />
                      </button>
                      <button onClick={() => setConfirmDelete({ id: p._id, name: p.name })} className="text-red-500 hover:text-red-700" title="حذف">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">لا توجد منتجات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" dir="rtl">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">تأكيد الحذف</h2>
            <p className="text-sm text-gray-500 mb-1">هتحذف المنتج</p>
            <p className="text-base font-bold text-red-600 mb-4">« {confirmDelete.name} »</p>
            <div className="flex gap-3 justify-center">
              <button onClick={confirmDeleteAction} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors">
                نعم، احذف
              </button>
              <button onClick={() => setConfirmDelete(null)} className="border border-gray-300 text-gray-700 text-sm font-bold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
