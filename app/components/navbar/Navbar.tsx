"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "./data";
import { SearchIcon, CartIcon, MenuIcon, CloseIcon } from "./icons";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";
import { useCartStore } from "../../store/cartStore";
import { useCompanyStore } from "../../store/companyStore";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0));
  const { logo, fetchLogo } = useCompanyStore();

  useEffect(() => { fetchLogo(); }, [fetchLogo]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo + Hamburger */}
          <div className="flex items-center gap-1">
            <button
              aria-label="القائمة"
              className="lg:hidden p-1 sm:p-2 text-gray-600 hover:text-purple-700 rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            <Link href="/" className="shrink-0">
              <div className="relative w-[80px] sm:w-[100px] md:w-[120px] h-10">
                <Image
                  src={logo}
                  unoptimized
                  alt="Logo"
                  fill
                  className="object-contain object-right"
                  priority
                  loading="eager"
                />
              </div>
            </Link>
          </div>

          <DesktopNav items={navItems} />

          {/* Icons - responsive gap and size */}
          <div className="flex items-center gap-0.5 sm:gap-2 md:gap-3">
            <Link
              href="/admin/login"
              aria-label="لوحة التحكم"
              className="p-1 sm:p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors"
              title="لوحة التحكم"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </Link>
            <button aria-label="بحث" className="p-1 sm:p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors">
              <SearchIcon />
            </button>
            <Link href="/cart" aria-label="السلة" className="p-1 sm:p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors relative">
              <CartIcon />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-0.5">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      <MobileMenu items={navItems} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
}
