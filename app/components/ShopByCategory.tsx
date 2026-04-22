import CategorySlider from "./CategorySlider";

const BACKEND = process.env.BACKEND_URL || "http://localhost:5000";

const categoryPageMap: Record<string, string> = {
  // ─── Smartphones ───────────────────────────────────────────
  smartphone: "/smartphones",
  smartphones: "/smartphones",
  "الهواتف الذكية": "/smartphones",
  "ابل ايفون 13 برو ماكس": "/smartphones/iphone-13-pro-max",
  "ابل ايفون 14 برو ماكس": "/smartphones/iphone-14-pro-max",
  "ابل ايفون 14 برو": "/smartphones/iphone-14-pro",
  "ابل ايفون 14 بلس": "/smartphones/iphone-14-plus",
  "ابل ايفون 14": "/smartphones/iphone-14",
  "ابل ايفون 15 برو ماكس": "/smartphones/iphone-15-pro-max",
  "ابل ايفون 15 برو": "/smartphones/iphone-15-pro",
  "ابل ايفون 15 بلس": "/smartphones/iphone-15-plus",
  "ابل ايفون 15": "/smartphones/iphone-15",
  "ابل ايفون 16 برو ماكس": "/smartphones/iphone-16-pro-max",
  "ايفون 16 برو ماكس": "/smartphones/iphone-16-pro-max",
  "ابل ايفون 16 برو": "/smartphones/iphone-16-pro",
  "ايفون 16 برو": "/smartphones/iphone-16-pro",
  "ابل ايفون 16 بلس": "/smartphones/iphone-16-plus",
  "ايفون 16 بلس": "/smartphones/iphone-16-plus",
  "ابل ايفون 16 عادي": "/smartphones/iphone-16",
  "ابل ايفون 16": "/smartphones/iphone-16",
  "ايفون 16": "/smartphones/iphone-16",
  "ابل ايفون 17 برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17 برو": "/smartphones/iphone-17-pro",
  "ابل ايفون 17 اير": "/smartphones/iphone-17-air",
  "ابل ايفون 17": "/smartphones/iphone-17",
  "سامسونج جالاكسي S22": "/smartphones/samsung-s22-ultra",
  "سامسونج جلاكسي S22": "/smartphones/samsung-s22-ultra",
  "سامسونج جالكسي S22": "/smartphones/samsung-s22-ultra",
  "سامسونج جالاكسي S23": "/smartphones/samsung-s23-ultra",
  "سامسونج جلاكسي S23": "/smartphones/samsung-s23-ultra",
  "سامسونج جالكسي S23": "/smartphones/samsung-s23-ultra",
  "سامسونج جلاكسي S23 الترا": "/smartphones/samsung-s23-ultra",
  "سامسونج جالاكسي S24": "/smartphones/samsung-s24-ultra",
  "سامسونج جلاكسي S24": "/smartphones/samsung-s24-ultra",
  "سامسونج جالكسي S24": "/smartphones/samsung-s24-ultra",
  "سامسونج جالاكسي S25": "/smartphones/samsung-s25-ultra",
  "سامسونج جلاكسي S25": "/smartphones/samsung-s25-ultra",
  "سامسونج جالكسي S25": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي S26": "/smartphones/samsung-s26-ultra",
  "سامسونج جلاكسي S26": "/smartphones/samsung-s26-ultra",
  "سامسونج جالكسي S26": "/smartphones/samsung-s26-ultra",

  // ─── Watches ───────────────────────────────────────────────
  watch: "/apple-watches/se",
  "smart-watch": "/smart-watches/smart-watches",
  smartwatch: "/smart-watches/smart-watches",
  "ساعات ذكية": "/smart-watches/smart-watches",
  "الساعات الذكية": "/smart-watches/smart-watches",
  "ساعات ابل": "/apple-watches/se",
  "ساعات أبل": "/apple-watches/se",

  // ─── Audio ─────────────────────────────────────────────────
  audio: "/audio/airpods-pro",
  "سماعات ابل": "/audio/airpods-pro",
  "سماعات أبل": "/audio/airpods-pro",
  speaker: "/audio/airpods-max",
  earbuds: "/audio/samsung-buds",

  // ─── PlayStation ───────────────────────────────────────────
  ps5: "/playstation/ps5",
  ps4: "/playstation/ps5-slim",
  xbox: "/playstation/xbox-one",
  controller: "/playstation/controllers",
  "gaming-accessories": "/playstation/ps-accessories",
  "بلاي ستيشن": "/playstation/ps5",
  "أجهزة بلاي ستيشن": "/playstation/ps5",

  // ─── Laptops & Monitors ────────────────────────────────────
  laptop: "/laptops/macbook-pro",
  monitor: "/laptops/samsung-monitors",
  "ماك بوك إير": "/laptops/macbook-air",
  "ماك بوك اير": "/laptops/macbook-air",
  "لابتوبات": "/laptops/macbook-pro",
  "لابتوبات وشاشات": "/laptops/macbook-pro",

  // ─── Tablets ───────────────────────────────────────────────
  tablet: "/tablets/ipad-pro",
  "ايبادات": "/tablets/ipad-pro",
  "الاجهزة اللوحية ايبادات": "/tablets/ipad-pro",
  "الأجهزة اللوحية": "/tablets/ipad-pro",

  // ─── Accessories ───────────────────────────────────────────
  powerbank: "/accessories/anker-batteries",
  "ملحقات": "/accessories/anker-batteries",
  "بطاريات متنقله": "/accessories/anker-batteries",
  "بطاريات متنقلة": "/accessories/anker-batteries",
  "بطاريات متنقلة وكيابل": "/accessories/anker-batteries",
  "بطاريات": "/accessories/anker-batteries",

  // ─── Games ─────────────────────────────────────────────────
  gaming: "/games/ps5-games",
  "mice-keyboards": "/games/mice-keyboards",
  microphone: "/games/microphones",
  figures: "/games/figures",
  rgb: "/games/rgb-lighting",
  "العاب": "/games/ps5-games",
  "ألعاب الفيديو": "/games/ps5-games",
  "أجهزة صوت و سماعات": "/audio/airpods-pro",
  "أجهزة صوت وسماعات": "/audio/airpods-pro",
};

type Category = { name: string; count: number; image: string };
type Setting = { category: string; subCategory: string; showInHome: boolean; order: number };

async function getCategories(): Promise<Category[]> {
  try {
    const [catRes, settingsRes] = await Promise.all([
      fetch(`${BACKEND}/api/admin/sub-categories/public`, { cache: "no-store" }),
      fetch(`${BACKEND}/api/admin/sub-categories/home-settings`, { cache: "no-store" }),
    ]);
    const allCats: Category[] = catRes.ok ? await catRes.json() : [];
    const settings: Setting[] = settingsRes.ok ? await settingsRes.json() : [];

    const visibleSet = new Map(
      settings.filter((s) => s.showInHome).map((s) => [s.category, s.order])
    );
    if (!visibleSet.size) return allCats;

    return allCats
      .filter((c) => visibleSet.has(c.name))
      .sort((a, b) => (visibleSet.get(a.name) ?? 0) - (visibleSet.get(b.name) ?? 0));
  } catch {
    return [];
  }
}

export default async function ShopByCategory() {
  const categories = await getCategories();
  if (!categories.length) return null;

  const categoriesWithHref = categories.map((cat) => {
    const name = cat.name?.trim();
    const nameLower = name?.toLowerCase();
    const href =
      categoryPageMap[name] ??
      categoryPageMap[nameLower] ??
      Object.entries(categoryPageMap)
        .filter(([k]) => {
          const kl = k.toLowerCase();
          return nameLower?.includes(kl) || kl.includes(nameLower);
        })
        .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ??
      "/store";
    return { ...cat, href };
  });

  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-4" dir="rtl">
      <section
        className="relative max-w-6xl mx-auto rounded-3xl py-8 sm:py-10 overflow-hidden border border-teal-100/60"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,253,250,0.8) 50%, rgba(236,253,245,0.7) 100%)",
          boxShadow: "0 4px 24px -4px rgba(13,148,136,0.08), 0 0 0 1px rgba(13,148,136,0.04)",
        }}
        dir="rtl"
      >
        {/* Decorative dots pattern */}
        <div className="absolute top-0 left-0 w-32 h-32 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #0d9488 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #0d9488 1px, transparent 1px)", backgroundSize: "12px 12px" }} />

        <div className="px-3 sm:px-5 relative">
          {/* Title */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1 h-px bg-gradient-to-l from-teal-200/80 to-transparent" />
            <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full" style={{ background: "linear-gradient(135deg, #0d9488, #059669)", boxShadow: "0 4px 16px -2px rgba(13,148,136,0.4)" }}>
              <span className="text-white text-base">🏷️</span>
              <span className="text-sm sm:text-base font-bold text-white tracking-wide">تسوق حسب الأقسام</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-teal-200/80 to-transparent" />
          </div>
          <CategorySlider categories={categoriesWithHref} />
        </div>
      </section>
    </div>
  );
}
