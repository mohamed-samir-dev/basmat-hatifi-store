import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaMobileAlt, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-600 mt-16" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* من نحن */}
        <div>
          <h3 className="text-gray-700 font-bold text-xl mb-3">من نحن</h3>
          <p className="text-sm leading-relaxed text-gray-500">
            بصمة هاتفي المعتمد هو اختيارك الأول لشراء أجهزتك بالأقساط داخل السعودية، ضمان موثوق وخدمة محلية.
          </p>
        </div>

        {/* روابط مهمة */}
        <div>
          <h3 className="text-blue-500 font-bold text-xl mb-4">روابط مهمة</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "عن بصمة هاتفي المعتمد", href: "/about" },
              { label: "طرق الدفع", href: "/payment" },
              { label: "سياسة الاستبدال والاسترجاع", href: "/return-policy" },
              { label: "سياسة الخصوصية واتفاقية الاستخدام", href: "/privacy" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-emerald-400 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* تواصل معنا */}
        <div>
          <h3 className="text-blue-500 font-bold text-xl mb-4">تواصل معنا</h3>
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm mb-5">
            <li className="flex items-center gap-2">
              <FaWhatsapp className="text-emerald-500 shrink-0" size={16} />
              <span>واتساب</span>
            </li>
            <li className="flex items-center gap-2">
              <FaMobileAlt className="text-emerald-500 shrink-0" size={16} />
              <span>جوال</span>
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-emerald-500 shrink-0" size={16} />
              <span>هاتف</span>
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-emerald-500 shrink-0" size={16} />
              <span>ايميل</span>
            </li>
          </ul>
          <div className="flex gap-3 flex-wrap">
            {["/footer1.webp", "/footer2.webp", "/footer3.webp", "/footer4.webp"].map((src, i) => (
              <Image key={i} src={src} alt={`footer-${i + 1}`} width={60} height={40} className="object-contain rounded" style={{ width: "auto" }} />
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 flex items-center justify-between max-w-6xl mx-auto px-4 py-4 text-xs text-gray-500">
        <span>الحقوق محفوظة بصمة هاتفي المعتمد © 2026</span>
        <div className="flex gap-2">
          <Image src="/cc975b.png" alt="cc" width={50} height={30} className="object-contain" style={{ width: "auto" }} />
          <Image src="/mada975b.png" alt="mada" width={50} height={30} className="object-contain" style={{ width: "auto" }} />
        </div>
      </div>
    </footer>
  );
}
