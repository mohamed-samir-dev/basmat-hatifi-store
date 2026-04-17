import type { Metadata } from "next";
import Link from "next/link";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";
const SITE_URL = "https://www.pasmthatfee.com";

async function getCompany() {
  try {
    const r = await fetch(`${BACKEND}/api/admin/company`, { next: { revalidate: 3600 } });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const company = await getCompany();
  const siteName = company.nameAr || "بصمة هاتفي المعتمد";
  return {
    title: `الساعات الذكية | ${siteName}`,
    description: `تسوق أحدث الساعات الذكية بأفضل الأسعار وبالأقساط في ${siteName}.`,
    alternates: { canonical: `${SITE_URL}/smart-watches` },
  };
}

export default async function SmartWatchesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10">
          <nav className="flex items-center gap-1.5 text-[11px] sm:text-xs text-teal-100 mb-3 sm:mb-4">
            <Link href="/" className="hover:text-white transition">الرئيسية</Link>
            <span className="opacity-60">‹</span>
            <span className="text-white font-medium">الساعات الذكية</span>
          </nav>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white mb-1.5">الساعات الذكية</h1>
          <p className="text-teal-100 text-xs sm:text-sm">اختر القسم المناسب</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/smart-watches/smart-watches"
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-teal-300 hover:shadow-lg transition-all duration-300 flex flex-col items-center gap-3 text-center group"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-2xl group-hover:from-teal-100 group-hover:to-emerald-100 transition-all shadow-sm">
              ⌚
            </div>
            <p className="text-sm font-bold text-gray-700 group-hover:text-teal-700 transition leading-tight">
              الساعات الذكية
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
