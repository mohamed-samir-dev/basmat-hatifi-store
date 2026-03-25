"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const PAGE_SIZE = 10;

interface Review {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  gender: string;
  approved: boolean;
  createdAt: string;
}

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

const emptyForm = { name: "", comment: "", rating: 5, gender: "male", approved: false };

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [editReview, setEditReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ name: "", comment: "", rating: 5, gender: "male" });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/admin/reviews/all`, { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setReviews(data); })
      .finally(() => setLoading(false));
  }, []);

  async function toggleApproved(id: string) {
    const res = await fetch(`${API}/api/admin/reviews/${id}/toggle`, { method: "PATCH", credentials: "include" });
    const data = await res.json();
    if (!res.ok) return toast.error("حدث خطأ");
    setReviews((prev) => prev.map((r) => r._id === id ? { ...r, approved: data.approved } : r));
    toast.success(data.approved ? "تم إظهاره في الرئيسية ✅" : "تم إخفاؤه من الرئيسية");
  }

  async function remove(id: string) {
    setConfirmDelete(null);
    const res = await fetch(`${API}/api/admin/reviews/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) return toast.error("حدث خطأ");
    toast.success("تم حذف التعليق ✅");
    setReviews((prev) => prev.filter((r) => r._id !== id));
  }

  function openEdit(r: Review) {
    setEditReview(r);
    setEditForm({ name: r.name, comment: r.comment, rating: r.rating, gender: r.gender || "male" });
  }

  async function saveEdit() {
    if (!editReview) return;
    setSaving(true);
    const res = await fetch(`${API}/api/admin/reviews/${editReview._id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    setSaving(false);
    if (!res.ok) return toast.error("حدث خطأ");
    const updated = await res.json();
    setReviews((prev) => prev.map((r) => r._id === updated._id ? updated : r));
    setEditReview(null);
    toast.success("تم التعديل ✅");
  }

  async function saveAdd() {
    setSaving(true);
    const res = await fetch(`${API}/api/admin/reviews/admin-add`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    setSaving(false);
    if (!res.ok) return toast.error("حدث خطأ");
    const created = await res.json();
    setReviews((prev) => [created, ...prev]);
    setShowAddForm(false);
    setAddForm(emptyForm);
    toast.success("تم إضافة التعليق ✅");
  }

  const filtered = reviews.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.comment.includes(search)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleSearch(val: string) { setSearch(val); setPage(1); }

  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  if (loading) return <p className="text-center text-gray-400 py-10">جاري التحميل...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">آراء العملاء</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
        >
          + إضافة تعليق
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>أظهر</span>
            <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{PAGE_SIZE}</span>
            <span>مدخلات</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">ابحث:</span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
            />
          </div>
        </div>

        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50 text-gray-600 font-semibold text-base">
            <tr>
              <th className="px-4 py-3">الاسم</th>
              <th className="px-4 py-3">التعليق</th>
              <th className="px-4 py-3">الجنس</th>
              <th className="px-4 py-3">عدد النجوم</th>
              <th className="px-4 py-3">معروض في الرئيسية</th>
              <th className="px-4 py-3">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 text-base">
                <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{r.name}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.comment}</td>
                <td className="px-4 py-3 text-gray-600">{r.gender === "female" ? "أنثى" : "ذكر"}</td>
                <td className="px-4 py-3">
                  <span className="text-yellow-400 text-base">{stars(r.rating)}</span>
                  <span className="text-gray-400 text-xs mr-1">({r.rating})</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleApproved(r._id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${r.approved ? "bg-green-500" : "bg-gray-300"}`}
                    title={r.approved ? "إخفاء من الرئيسية" : "إظهار في الرئيسية"}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${r.approved ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700" title="تعديل">
                      <EditIcon />
                    </button>
                    <button onClick={() => setConfirmDelete(r._id)} className="text-red-500 hover:text-red-700" title="حذف">
                      <TrashIcon />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">لا توجد نتائج</td></tr>
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-wrap gap-2">
          <span className="text-sm text-gray-500">
            إظهار {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} إلى {Math.min(currentPage * PAGE_SIZE, filtered.length)} من أصل {filtered.length} مدخل
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40">السابق</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-gray-400">…</span>
                ) : (
                  <button key={p} onClick={() => setPage(p as number)}
                    className={`px-3 py-1 text-sm border rounded ${currentPage === p ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-50"}`}>
                    {p}
                  </button>
                )
              )}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40">التالي</button>
          </div>
        </div>
      </div>

      {/* Confirm Delete */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🗑️</div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">تأكيد الحذف</h2>
            <p className="text-sm text-gray-500 mb-4">هل أنت متأكد من حذف هذا التعليق؟</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => remove(confirmDelete)} className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors">نعم، احذف</button>
              <button onClick={() => setConfirmDelete(null)} className="border border-gray-300 text-gray-700 text-sm font-bold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-gray-800 mb-4">تعديل التعليق</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم الزبون</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التعليق</label>
                <textarea value={editForm.comment} onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الجنس</label>
                <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عدد النجوم</label>
                <select value={editForm.rating} onChange={(e) => setEditForm({ ...editForm, rating: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ★</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveEdit} disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50">
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
              <button onClick={() => setEditReview(null)}
                className="border border-gray-300 text-gray-700 text-sm font-bold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Review Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow p-6 mt-6" dir="rtl">
          <h2 className="text-lg font-bold text-gray-800 mb-4">إضافة رأي عميل</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الزبون</label>
              <input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الجنس</label>
              <select value={addForm.gender} onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">التعليق</label>
              <textarea value={addForm.comment} onChange={(e) => setAddForm({ ...addForm, comment: e.target.value })}
                rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">عدد النجوم</label>
              <select value={addForm.rating} onChange={(e) => setAddForm({ ...addForm, rating: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" id="approved" checked={addForm.approved}
                onChange={(e) => setAddForm({ ...addForm, approved: e.target.checked })}
                className="w-4 h-4 accent-blue-600" />
              <label htmlFor="approved" className="text-sm text-gray-700">يعرض في الموقع</label>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={saveAdd} disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors disabled:opacity-50">
              {saving ? "جاري الإضافة..." : "إضافة"}
            </button>
            <button onClick={() => { setShowAddForm(false); setAddForm(emptyForm); }}
              className="border border-gray-300 text-gray-700 text-sm font-bold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
