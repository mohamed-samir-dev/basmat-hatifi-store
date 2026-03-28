import CategorySlider from "./CategorySlider";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

const categoryPageMap: Record<string, string> = {
  smartphone: "/smartphones",
  smartphones: "/smartphones",
  "الهواتف الذكية": "/smartphones",
  watch: "/apple-watches/se",
  "smart-watch": "/apple-watches/se",
  "smartwatch": "/apple-watches/se",
  "ساعات ذكية": "/apple-watches/se",
  "الساعات الذكية": "/apple-watches/se",
  audio: "/audio/airpods-pro",
  speaker: "/audio/airpods-max",
  earbuds: "/audio/samsung-buds",
  ps5: "/playstation/ps5",
  ps4: "/playstation/ps5-slim",
  xbox: "/playstation/xbox-one",
  controller: "/playstation/controllers",
  "gaming-accessories": "/playstation/ps-accessories",
  laptop: "/laptops/macbook-pro",
  monitor: "/laptops/samsung-monitors",
  tablet: "/tablets/ipad-pro",
  powerbank: "/accessories/anker-batteries",
  gaming: "/games/ps5-games",
  "mice-keyboards": "/games/mice-keyboards",
  microphone: "/games/microphones",
  figures: "/games/figures",
  rgb: "/games/rgb-lighting",
  "ابل ايفون 17 برو": "/smartphones/iphone-17-pro",
  "ابل ايفون 17 برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17": "/smartphones/iphone-17",
  "ابل ايفون 17 اير": "/smartphones/iphone-17-air",
  "ابل ايفون 16 برو": "/smartphones/iphone-16-pro",
  "ابل ايفون 16 برو ماكس": "/smartphones/iphone-16-pro-max",
  "ابل ايفون 16": "/smartphones/iphone-16",
  "ابل ايفون 16 بلس": "/smartphones/iphone-16-plus",
  "ابل ايفون 16 عادي": "/smartphones/iphone-16",
  "ابل ايفون 15 برو": "/smartphones/iphone-15-pro",
  "ابل ايفون 15 برو ماكس": "/smartphones/iphone-15-pro-max",
  "ابل ايفون 15": "/smartphones/iphone-15",
  "ابل ايفون 15 بلس": "/smartphones/iphone-15-plus",
  "ابل ايفون 14 برو": "/smartphones/iphone-14-pro",
  "ابل ايفون 14 برو ماكس": "/smartphones/iphone-14-pro-max",
  "ابل ايفون 14": "/smartphones/iphone-14",
  "سامسونج جالكسي": "/smartphones/samsung-s25-ultra",
  "سامسونج جالكسي اس 23 الترا": "/smartphones/samsung-s25-ultra",
  "ساعات ابل": "/apple-watches/se",
  "سماعات ابل": "/audio/airpods-pro",
  "بلاي ستيشن": "/playstation/ps5",
  "لابتوبات": "/laptops/macbook-pro",
  "ايبادات": "/tablets/ipad-pro",
  "ملحقات": "/accessories/anker-batteries",
  "العاب": "/games/ps5-games",
};

type Category = { name: string; count: number; image: string };

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BACKEND}/api/admin/sub-categories/public`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function ShopByCategory() {
  const categories = await getCategories();
  if (!categories.length) return null;

  // أضف الـ href لكل قسم
  const categoriesWithHref = categories.map((cat) => ({
    ...cat,
    href: categoryPageMap[cat.name] ?? categoryPageMap[cat.name?.toLowerCase()] ?? "#",
  }));

  return (
    <section className="w-full bg-purple-50 py-6" dir="rtl">
    <div className="max-w-6xl mx-auto px-3 sm:px-4">
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-linear-to-l from-purple-300 to-transparent" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 whitespace-nowrap">تسوق حسب الأقسام</h2>
        <div className="flex-1 h-px bg-linear-to-r from-purple-300 to-transparent" />
      </div>

      {/* موبايل: سلايدر */}
      <div className="sm:hidden overflow-hidden">
        <CategorySlider categories={categoriesWithHref} />
      </div>

      {/* ديسكتوب: grid */}
      <div className="hidden sm:grid grid-cols-4 lg:grid-cols-6 gap-4">
        {categoriesWithHref.map((cat) => (
          <a key={cat.name} href={cat.href} className="flex flex-col items-center gap-2 group">
            <div className="w-full aspect-square rounded-full bg-gray-100 border-2 border-gray-200 group-hover:border-purple-400 overflow-hidden relative transition-all duration-200 shadow-sm group-hover:shadow-md">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="object-contain p-2 w-full h-full group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium text-gray-700 text-center leading-tight line-clamp-2 group-hover:text-purple-700 transition-colors w-full">
              {cat.name}
            </p>
          </a>
        ))}
      </div>
    </div>
    </section>
  );
}
