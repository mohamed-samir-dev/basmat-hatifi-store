"use client";
import { useRouter } from "next/navigation";
import { Bell, LogOut } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useCompanyStore } from "../../store/companyStore";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminNavbar() {
  const router = useRouter();
  const { logo, fetchLogo } = useCompanyStore();

  useEffect(() => { fetchLogo(); }, [fetchLogo]);

  const handleLogout = async () => {
    await fetch(`${API}/api/admin/logout`, { method: "POST", credentials: "include" });
    router.push("/admin/login");
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50" dir="rtl">
      {/* اليمين - اللوجو */}
      <div className="flex items-center gap-2">
        <div className="h-10 w-24 relative shrink-0">
          <Image src={logo} alt="Logo" fill className="object-contain object-right" unoptimized />
        </div>

      </div>

      {/* الشمال - إشعارات + خروج */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2 rounded-xl transition-colors text-sm"
        >
          <LogOut size={16} />
          تسجيل خروج
        </button>
      </div>
    </nav>
  );
}
