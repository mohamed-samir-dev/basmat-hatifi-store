"use client";

import { useState } from "react";
import Link from "next/link";
import { NavItem } from "./data";
import { ChevronDownIcon } from "./icons";

interface MobileMenuProps {
  items: NavItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ items, isOpen, onClose }: MobileMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`lg:hidden fixed inset-0 top-14 sm:top-16 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`lg:hidden fixed top-14 sm:top-16 right-0 w-[280px] sm:w-[320px] h-[calc(100dvh-3.5rem)] sm:h-[calc(100dvh-4rem)] bg-white z-50 overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        <div className="py-2">
          {items.map((item) => (
            <div key={item.label} className="border-b border-gray-50">
              {item.children ? (
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                >
                  {item.label}
                  <span className={`transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`}>
                    <ChevronDownIcon />
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}
              {/* Dropdown with animation */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  item.children && openDropdown === item.label ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="bg-gray-50 py-1">
                  {item.children?.map((child, index) => (
                    <Link
                      key={`${child.href}-${index}`}
                      href={child.href}
                      className="block px-8 py-2.5 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                      onClick={onClose}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
