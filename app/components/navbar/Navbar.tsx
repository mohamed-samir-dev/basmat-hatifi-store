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
  const { logo, fetchCompany } = useCompanyStore();

  useEffect(() => { fetchCompany(); }, [fetchCompany]);

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
        {/* Row 1: Logo + Icons (mobile: same row with hamburger) */}
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-20">
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
              {logo && (
                <Image
                  src={logo}
                  unoptimized
                  alt="Logo"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="h-20 sm:h-20 lg:h-35 w-auto"
                  priority
                  loading="eager"
                />
              )}
            </Link>
          </div>

          {/* Desktop nav hidden here, shown in row 2 */}
          <div className="hidden lg:block" />

          {/* Icons */}
          <div className="flex items-center gap-0.5 sm:gap-2 md:gap-3">
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

        {/* Row 2: Desktop nav links (desktop only) */}
        <div className="hidden lg:flex justify-center border-t border-gray-100 py-1">
          <DesktopNav items={navItems} />
        </div>
      </div>

      <MobileMenu items={navItems} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
}
