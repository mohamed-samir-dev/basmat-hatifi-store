"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { navItems } from "./data";
import { SearchIcon, CartIcon, MenuIcon, CloseIcon } from "./icons";
import DesktopNav from "./DesktopNav";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="shrink-0">
            <Image src="/removelogo.webp" alt="Logo" width={120} height={40} className="object-contain" style={{ width: 'auto', height: 'auto' }} priority />
          </Link>

          <DesktopNav items={navItems} />

          <div className="flex items-center gap-3">
            <button aria-label="بحث" className="p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors">
              <SearchIcon />
            </button>
            <button aria-label="السلة" className="p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-colors relative">
              <CartIcon />
            </button>
            <button
              aria-label="القائمة"
              className="lg:hidden p-2 text-gray-600 hover:text-purple-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && <MobileMenu items={navItems} onClose={() => setMobileOpen(false)} />}
    </nav>
  );
}
