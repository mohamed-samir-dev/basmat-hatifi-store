export const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const fields = [
  { key: "nameAr", label: "الاسم بالعربية" },
  { key: "nameEn", label: "الاسم بالانجليزية" },
  { key: "addressAr", label: "العنوان بالعربية" },
  { key: "addressEn", label: "العنوان بالانجليزية" },
  { key: "phone", label: "رقم الهاتف" },
  { key: "whatsapp", label: "رقم الواتساب" },
  { key: "website", label: "الرابط" },
  { key: "email", label: "الايميل" },
  { key: "currencyAr", label: "عملة البيع عربي" },
  { key: "currencyEn", label: "عملة البيع انجليزي" },
  { key: "taxNumber", label: "الرقم الضريبي" },
  { key: "shippingCompany", label: "اسم شركة الشحن" },
  { key: "paymentMethod", label: "طريقة الدفع" },
];

export const imageFields = [
  { key: "logo", label: "الشعار" },
  { key: "header", label: "الترويسة" },
  { key: "footer", label: "التذييل" },
  { key: "stamp", label: "الختم" },
];

export const defaultData = {
  nameAr: "نيكس تيك",
  nameEn: "NexTech",
  addressAr: "السعودية",
  addressEn: "Saudi Arabia",
  phone: "996582968481",
  whatsapp: "966596519209",
  website: "http://nextech-sa.com",
  email: "info@nextech-sa.com",
  currencyAr: "ريـــال",
  currencyEn: "SAR",
  taxNumber: "314435648600003",
  shippingCompany: "مندوب توصيل",
  paymentMethod: "بطاقات بنكية فقط",
  details: "هو اختيارك الأول لشراء أجهزتك بالأقساط\nداخل السعودية ضمان موثوق وخدمة محلية",
  logo: "",
  header: "",
  footer: "",
  stamp: "",
};

export const toFullUrl = (url: string) =>
  url && url.startsWith("/uploads") ? `${API}${url}?t=${Date.now()}` : url;
