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

  const categoriesWithHref = categories.map((cat) => ({
    ...cat,
    href: categoryPageMap[cat.name] ?? categoryPageMap[cat.name?.toLowerCase()] ?? "#",
  }));

  return (
    <div className="w-full px-3 sm:px-6 py-4" dir="rtl">
    <section className="max-w-6xl mx-auto rounded-2xl py-10 shadow-md overflow-hidden" style={{ background: "linear-gradient(135deg, #14b8a6 0%, #2dd4bf 50%, #5eead4 100%)" }} dir="rtl">
      <div className="px-3 sm:px-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-teal-700/40" />
          <h2 className="text-lg sm:text-xl font-bold text-teal-900 whitespace-nowrap">تسوق حسب الأقسام</h2>
          <div className="flex-1 h-px bg-teal-700/40" />
        </div>
        <CategorySlider categories={categoriesWithHref} />
      </div>
    </section>
    </div>
  );
}
