"use client";

import { useState } from "react";
import Link from "next/link";
import { NavItem } from "./data";
import { ChevronDownIcon } from "./icons";

interface MobileMenuProps {
  items: NavItem[];
  onClose: () => void;
}

export default function MobileMenu({ items, onClose }: MobileMenuProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <div className="lg:hidden bg-white border-t border-gray-100 max-h-[80vh] overflow-y-auto">
      {items.map((item) => (
        <div key={item.label} className="border-b border-gray-50">
          <button
            onClick={() => toggleDropdown(item.label)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
          >
            {item.label}
            {item.children && (
              <span className={`transition-transform duration-200 ${openDropdown === item.label ? "rotate-180" : ""}`}>
                <ChevronDownIcon />
              </span>
            )}
          </button>
          {item.children && openDropdown === item.label && (
            <div className="bg-gray-50 py-1">
              {item.children.map((child, index) => (
                <Link
                  key={`${child.href}-${index}`}
                  href={child.href}
                  className="block px-8 py-2 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                  onClick={onClose}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
