"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "./data";
import { SearchIcon, CartIcon, MenuIcon, CloseIcon } from "./icons";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - responsive sizing */}
          <Link href="/" className="shrink-0">
            <Image
              src="/removelogo.webp"
              alt="Logo"
              width={120}
              height={40}
              className="object-contain w-[80px] sm:w-[100px] md:w-[120px]"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>

          <DesktopNav items={navItems} />

          {/* Icons - responsive gap and size */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            <button aria-label="بحث" className="p-1.5 sm:p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors">
              <SearchIcon />
            </button>
            <button aria-label="السلة" className="p-1.5 sm:p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors relative">
              <CartIcon />
            </button>
            <button
              aria-label="القائمة"
              className="lg:hidden p-1.5 sm:p-2 text-gray-600 hover:text-purple-700 rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu items={navItems} isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </nav>
  );
}
