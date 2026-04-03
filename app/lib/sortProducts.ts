import type { Product } from "../components/products/types";

const COLOR_ORDER: string[] = [
  "برتقالي",
  "أسود تيتانيوم",
  "أسود",
  "أبيض تيتانيوم",
  "أبيض",
  "أزرق تيتانيوم",
  "أزرق فاتح",
  "أزرق",
  "ازرق",
  "بينك",
  "جولد",
  "رصاصي",
  "رمادي تيتانيوم",
  "سيلفر",
  "سيبفلر",
  "صحراوي",
];

function colorPriority(color?: string, name?: string): number {
  const src = (color && color.trim()) ? color.trim() : "";
  if (!src) {
    const n = (name || "").toLowerCase();
    if (n.includes("برتقال") || n.includes("orange")) return 0;
    return 999;
  }
  const idx = COLOR_ORDER.findIndex(c => c === src || c.trim() === src.trim());
  return idx !== -1 ? idx : COLOR_ORDER.length;
}

function parseStorage(s?: string, name?: string): number {
  const raw = (s && s.trim()) ? s.trim() : (name || "");
  const match = raw.replace(/\s+/g, "").match(/(\d+)(tb|gb)/i);
  if (!match) return Infinity;
  const val = parseInt(match[1]);
  return match[2].toLowerCase() === "tb" ? val * 1024 : val;
}

export function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const storageDiff = parseStorage(a.storage, a.name) - parseStorage(b.storage, b.name);
    if (storageDiff !== 0) return storageDiff;
    return colorPriority(a.color, a.name) - colorPriority(b.color, b.name);
  });
}
