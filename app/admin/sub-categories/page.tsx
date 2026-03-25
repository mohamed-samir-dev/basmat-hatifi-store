"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type SubCat = { name: string; category: string; count: number };

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

export default function SubCategoriesPage() {
  const [items, setItems] = useState<SubCat[]>([]);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<SubCat | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const allSubCategories = [...new Set(items.map((i) => i.name).filter(Boolean))];
  const [confirmDelete, setConfirmDelete] = useState<SubCat | null>(null);

  async function fetchData() {
    const res = await fetch(`${API}/api/admin/sub-categories`, { credentials: "include" });
    if (res.ok) setItems(await res.json());
  }

  useEffect(() => {
    fetch(`${API}/api/admin/sub-categories`, { credentials: "include" })
      .then((res) => res.ok ? res.json() : null)
      .then((data) => { if (data) setItems(data); });
  }, []);

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editItem) return;
    setEditLoading(true);
    const res = await fetch(`${API}/api/admin/sub-categories/rename`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ oldName: editItem.name, oldCategory: editItem.category, newName: editName, newCategory: editCategory }),
    });
    setEditLoading(false);
    if (!res.ok) return toast.error("حدث خطأ أثناء التعديل");
    toast.success("تم التعديل بنجاح ✅");
    setEditItem(null);
    fetchData();
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    const res = await fetch(`${API}/api/admin/sub-categories/remove`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: confirmDelete.name }),
    });
    if (!res.ok) return toast.error("حدث خطأ أثناء الحذف");
    toast.success(`تم حذف "${confirmDelete.name}" بنجاح ✅`);
    setConfirmDelete(null);
    fetchData();
  }

  const filtered = items.filter((c) => c.name.includes(search) || c.category?.includes(search));

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">التصنيفات الفرعية</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 sm:px-4 py-3 border-b border-gray-100">
          <span className="text-xs sm:text-sm text-gray-500">
            إجمالي التصنيفات: <span className="font-bold text-gray-700">{items.length}</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن تصنيف..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48 md:w-52"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600 font-semibold text-xs sm:text-sm">
              <tr>
                <th className="px-2 sm:px-4 py-3">#</th>
                <th className="px-2 sm:px-4 py-3">الاسم</th>
                <th className="px-2 sm:px-4 py-3">النوع</th>
                <th className="px-2 sm:px-4 py-3">عدد المنتجات</th>
                <th className="px-2 sm:px-4 py-3 text-center">عرض في الرئيسية</th>
                <th className="px-2 sm:px-4 py-3">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((cat, i) => (
                <tr key={`${cat.category}-${cat.name}`} className="hover:bg-gray-50">
                  <td className="px-2 sm:px-4 py-3 text-gray-400 font-medium text-xs sm:text-sm">{i + 1}</td>
                  <td className="px-2 sm:px-4 py-3 font-medium text-gray-800 text-xs sm:text-sm md:text-base">{cat.category}</td>
                  <td className="px-2 sm:px-4 py-3 font-medium text-gray-800 text-xs sm:text-sm md:text-base">{cat.name}</td>
                  <td className="px-2 sm:px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cat.count > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                      {cat.count} منتج
                    </span>
                  </td>
                  <td className="px-2 sm:px-4 py-3 text-center">
                    <input type="checkbox" className="w-4 h-4 accent-blue-600 cursor-pointer" />
                  </td>
                  <td className="px-2 sm:px-4 py-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => { setEditItem(cat); setEditName(cat.name); setEditCategory(cat.category); }}
                        className="text-blue-500 hover:text-blue-700" title="تعديل"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(cat)}
                        className="text-red-500 hover:text-red-700" title="حذف"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">لا توجد تصنيفات فرعية</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-md shadow-xl">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">تعديل: {editItem.name}</h2>
            {editItem.count > 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                ⚠️ سيتم تغيير التصنيف في <span className="font-bold">{editItem.count} منتج</span>
              </p>
            )}
            <form onSubmit={handleEdit} className="space-y-3">
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">الاسم (التصنيف الرئيسي)</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1">النوع (التصنيف الفرعي)</label>
                <select
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {allSubCategories.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={editLoading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-60">
                  {editLoading ? "جاري الحفظ..." : "حفظ"}
                </button>
                <button type="button" onClick={() => setEditItem(null)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" dir="rtl">
          <div className="bg-white rounded-xl shadow-xl p-5 sm:p-6 w-full max-w-sm text-center">
            <div className="text-3xl sm:text-4xl mb-3">🗑️</div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-1">تأكيد الحذف</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-1">هتحذف التصنيف</p>
            <p className="text-sm sm:text-base font-bold text-red-600 mb-2">« {confirmDelete.name} »</p>
            <p className="text-xs text-gray-400 mb-4">سيتم إزالة هذا التصنيف من جميع المنتجات المرتبطة به</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm font-bold px-5 sm:px-6 py-2 rounded-lg transition-colors">
                نعم، احذف
              </button>
              <button onClick={() => setConfirmDelete(null)}
                className="border border-gray-300 text-gray-700 text-xs sm:text-sm font-bold px-5 sm:px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
