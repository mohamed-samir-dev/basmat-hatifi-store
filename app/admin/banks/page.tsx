"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type Bank = { _id: string; name: string; iban: string; logo: string };

export default function BanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    fetch("/api/admin/banks", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => { setBanks(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("هل تريد حذف هذا البنك؟")) return;
    const res = await fetch(`/api/admin/banks/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setBanks((prev) => prev.filter((b) => b._id !== id));
      toast.success("تم الحذف");
    } else {
      toast.error("فشل الحذف");
    }
  };

  const filtered = banks.filter(
    (b) => b.name.includes(search) || b.iban.includes(search)
  ).slice(0, perPage);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">بيانات البنوك</h1>
        <Link
          href="/admin/banks/add"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus size={16} />
          إضافة بنك جديد
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            أظهر
            <select
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
              className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              {[10, 25, 50, 100].map((n) => <option key={n}>{n}</option>)}
            </select>
            مدخلات
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            ابحث:
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50 text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3">الشعار</th>
                <th className="px-4 py-3">الاسم</th>
                <th className="px-4 py-3">الآيبان</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">جاري التحميل...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8 text-gray-400">ليست هناك بيانات متاحة في الجدول</td></tr>
              ) : (
                filtered.map((bank) => (
                  <tr key={bank._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {bank.logo ? (
                        <Image src={bank.logo} alt={bank.name} width={40} height={40} className="rounded-lg object-contain" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">لا يوجد</div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{bank.name}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono">{bank.iban}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(bank._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>يعرض 0 إلى {filtered.length} من أصل {banks.length} سجل</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40" disabled>السابق</button>
            <button className="px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40" disabled>التالي</button>
          </div>
        </div>
      </div>
    </div>
  );
}
