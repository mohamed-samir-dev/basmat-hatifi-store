"use client";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import AdminNavbar from "./components/AdminNavbar";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <AdminNavbar />
      <AdminSidebar />
      <Toaster position="top-right" toastOptions={{ style: { fontSize: "14px", padding: "12px 16px", maxWidth: "320px", fontWeight: "600" } }} />
      <main className="mr-64 pt-24 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
