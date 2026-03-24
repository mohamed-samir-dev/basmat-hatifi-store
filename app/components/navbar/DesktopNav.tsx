"use client";

import Link from "next/link";
import { NavItem } from "./data";
import { DropdownMenu } from "./dropdown";
import { ChevronDownIcon } from "./icons";

interface DesktopNavProps {
  items: NavItem[];
}

export default function DesktopNav({ items }: DesktopNavProps) {
  return (
    <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
      {items.map((item) => (
        <div key={item.label} className="relative group">
          <Link
            href={item.href}
            className="flex items-center gap-1 px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium text-gray-700 hover:text-purple-700 rounded-md hover:bg-purple-50 transition-colors whitespace-nowrap"
          >
            {item.label}
            {item.children && <ChevronDownIcon />}
          </Link>
          {item.children && <DropdownMenu items={item.children} />}
        </div>
      ))}
    </div>
  );
}
