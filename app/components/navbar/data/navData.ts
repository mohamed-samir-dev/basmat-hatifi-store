export interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

export const navItems: NavItem[] = [
  {
    label: "الهواتف الذكية",
    href: "/smartphones",
    children: [
      { label: "آيفون 13 برو ماكس", href: "/smartphones/iphone-13-pro-max" },
      { label: "سامسونج جالكسي اس 22 الترا", href: "/smartphones/samsung-s22-ultra" },
      { label: "آيفون 14 برو ماكس", href: "/smartphones/iphone-14-pro-max" },
      { label: "آيفون 14 برو", href: "/smartphones/iphone-14-pro" },
      { label: "آيفون 14 بلس", href: "/smartphones/iphone-14-plus" },
      { label: "آيفون 14 عادي", href: "/smartphones/iphone-14" },
      { label: "آيفون 15 برو ماكس", href: "/smartphones/iphone-15-pro-max" },
      { label: "آيفون 15 برو", href: "/smartphones/iphone-15-pro" },
      { label: "آيفون 15 بلس", href: "/smartphones/iphone-15-plus" },
      { label: "آيفون 15 عادي", href: "/smartphones/iphone-15" },
      { label: "سامسونج جالكسي اس 23 الترا", href: "/smartphones/samsung-s23-ultra" },
      { label: "سامسونج جالكسي اس 24 الترا", href: "/smartphones/samsung-s24-ultra" },
      { label: "ابل ايفون 16 برو ماكس", href: "/smartphones/iphone-16-pro-max" },
      { label: "ابل ايفون 16 برو", href: "/smartphones/iphone-16-pro" },
      { label: "ابل ايفون 16 بلس", href: "/smartphones/iphone-16-plus" },
      { label: "ابل ايفون 16 عادي", href: "/smartphones/iphone-16" },
      { label: "سامسونج جالكسي اس 25 الترا", href: "/smartphones/samsung-s25-ultra" },
      { label: "ابل ايفون 17 برو ماكس", href: "/smartphones/iphone-17-pro-max" },
      { label: "ابل ايفون 17 برو", href: "/smartphones/iphone-17-pro" },
      { label: "ابل ايفون 17 عادي", href: "/smartphones/iphone-17" },
      { label: "ابل ايفون 17 Air", href: "/smartphones/iphone-17-air" },
      { label: "فقط آبل", href: "/smartphones/apple-only" },
      { label: "سامسونج جالكسي اس 26 الترا", href: "/smartphones/samsung-s26-ultra" },
    ],
  },
  {
    label: "ساعات ابل",
    href: "/apple-watches",
    children: [
      { label: "ساعات ابل ", href: "/apple-watches/se" },
    ],
  },
  {
    label: "أجهزة صوت و سماعات",
    href: "/audio",
    children: [
      { label: "سماعات أبل", href: "/audio/airpods-pro" },
      { label: "سماعات سبيكر", href: "/audio/airpods-max" },
      { label: "سماعات متنوعه", href: "/audio/samsung-buds" },
    ],
  },
  {
    label: "أجهزة بلاي ستيشن",
    href: "/playstation",
    children: [
      { label: "بلاي ستيشن 5", href: "/playstation/ps5" },
      { label: "بلاي ستيشن 4 ", href: "/playstation/ps5-slim" },
      { label: "أكس بوكس ون", href: "/playstation/xbox-one" },
      { label: "يد تحكم", href: "/playstation/controllers" },
      { label: "ملحقات بلاي ستيشن ", href: "/playstation/accessories" },
    ],
  },
  {
    label: "لابتوبات وشاشات",
    href: "/laptops",
    children: [
      { label: "لابتوبات أبل", href: "/laptops/macbook-pro" },
      { label: "ماك بوك اير", href: "/laptops/macbook-air" },
      { label: "شاشات سامسونج", href: "/laptops/samsung-monitors" },
    ],
  },
  {
    label: "الاجهزة اللوحية ايبادات",
    href: "/tablets",
    children: [
      { label: "أبل", href: "/tablets/ipad-pro" },
      { label: "ايبادات ابل", href: "/tablets/ipad-air" },
    ],
  },
  {
    label: "بطاريات متنقلة وكيابل",
    href: "/accessories",
    children: [
      { label: "بطاريات متنقلة", href: "/accessories/anker-batteries" },
    ],
  },
  {
    label: "ألعاب الفيديو",
    href: "/games",
    children: [
      { label: "ماوسات وكيبوردات ألعاب", href: "/games/mice-keyboards" },
      { label: "مايكروفونات", href: "/games/microphones" },
      { label: "مجسمات وفيقرز", href: "/games/figures" },
      { label: " اضاءات RGB", href: "/games/rgb-lighting" },
    ],
  },
];
