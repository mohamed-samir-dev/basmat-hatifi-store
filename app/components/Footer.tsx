import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp, FaMobileAlt, FaEnvelope } from "react-icons/fa";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function getCompany() {
  try {
    const r = await fetch(`${API}/api/admin/company`, { next: { revalidate: 60 } });
    return r.ok ? r.json() : {};
  } catch {
    return {};
  }
}

export default async function Footer() {
  const c = await getCompany();

  function ensureAbsolute(url: string) {
    if (!url) return "";
    return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
  }

  function toInlineUrl(url: string) {
    if (!url) return url;
    const rawUrl = url.replace("/image/upload/", "/raw/upload/").replace(/\/fl_attachment:[^/]+\//, "/");
    return `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=false`;
  }

  const qrSrc: string = c.qrImage || "";
  const qrLinkType: string = c.qrLinkType || "link";
  const qrLink: string = qrLinkType === "file" ? toInlineUrl(c.qrFile || "") : ensureAbsolute(c.qrLink || "");

  const footerItems: { image: string; linkType: string; link: string; file: string }[] =
    (c.footerItems || []).filter((item: { image: string }) => item.image);

  const img1: string = c.img1 || "";
  const linkType1: string = c.linkType1 || c.link1Type || "link";
  const link1: string = linkType1 === "file" ? toInlineUrl(c.file1 || "") : ensureAbsolute(c.link1 || "");
  const img2: string = c.img2 || "";
  const linkType2: string = c.linkType2 || c.link2Type || "link";
  const link2: string = linkType2 === "file" ? toInlineUrl(c.file2 || "") : ensureAbsolute(c.link2 || "");

  function getHref(item: { linkType: string; link: string; file: string }) {
    return item.linkType === "link" ? ensureAbsolute(item.link) : toInlineUrl(item.file);
  }

  return (
    <footer className="bg-gradient-to-b from-teal-700 to-teal-900 text-gray-100 mt-16" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* من نحن */}
        <div>
          <h3 className="text-green-300 font-bold text-xl mb-3">من نحن</h3>
          <p className="text-sm leading-relaxed text-green-100">
            {c.details || "بصمة هاتفي المعتمد هو اختيارك الأول لشراء أجهزتك بالأقساط داخل السعودية، ضمان موثوق وخدمة محلية."}
          </p>
        </div>

        {/* روابط مهمة */}
        <div>
          <h3 className="text-green-300 font-bold text-xl mb-4">روابط مهمة</h3>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "عن بصمة هاتفي المعتمد", href: "/about" },
              { label: "طرق الدفع", href: "/payment" },
              { label: "سياسة الاستبدال والاسترجاع", href: "/return-policy" },
              { label: "سياسة الخصوصية واتفاقية الاستخدام", href: "/privacy" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="hover:text-green-300 transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* تواصل معنا */}
        <div>
          <h3 className="text-green-300 font-bold text-xl mb-4">تواصل معنا</h3>
          <ul className="space-y-2.5 text-sm mb-5">
            {c.whatsapp && (
              <li className="flex items-center gap-2">
                <FaWhatsapp className="text-emerald-500 shrink-0" size={16} />
                <a href={`https://wa.me/${c.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="hover:text-green-300 transition-colors" dir="ltr">{c.whatsapp}</a>
              </li>
            )}
            {c.phone && (
              <li className="flex items-center gap-2">
                <FaMobileAlt className="text-emerald-500 shrink-0" size={16} />
                <a href={`tel:${c.phone}`} className="hover:text-green-300 transition-colors" dir="ltr">{c.phone}</a>
              </li>
            )}
            {c.email && (
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-emerald-500 shrink-0" size={16} />
                <a href={`mailto:${c.email}`} className="hover:text-green-300 transition-colors" dir="ltr">{c.email}</a>
              </li>
            )}
          </ul>

          <div className="flex gap-1 items-center justify-center flex-nowrap overflow-x-auto">
            {/* QR */}
            {qrSrc && (
              qrLink
                ? <a href={qrLink} target="_blank" rel="noreferrer" className="shrink-0">
                    <Image src={qrSrc} alt="qr" width={200} height={200} className="rounded border border-gray-200 bg-white p-1 h-auto w-auto max-h-16" />
                  </a>
                : <Image src={qrSrc} alt="qr" width={200} height={200} className="rounded border border-gray-200 bg-white p-1 shrink-0 h-auto w-auto max-h-16" />
            )}

            {/* Footer Items */}
            {footerItems.map((item, i) => {
              const href = getHref(item);
              const el = (
                <Image key={i} src={item.image} alt={`footer-item-${i}`} width={200} height={200}
                  className="rounded h-auto w-auto max-h-16" />
              );
              return href
                ? <a key={i} href={href} target="_blank" rel="noreferrer" className="shrink-0">{el}</a>
                : <span key={i} className="shrink-0">{el}</span>;
            })}

            {/* img1 */}
            {img1 && (
              link1
                ? <a href={link1} target="_blank" rel="noreferrer" className="shrink-0">
                    <Image src={img1} alt="img1" width={200} height={200} className="rounded h-auto w-auto max-h-16" />
                  </a>
                : <Image src={img1} alt="img1" width={200} height={200} className="rounded shrink-0 h-auto w-auto max-h-16" />
            )}

            {/* img2 */}
            {img2 && (
              link2
                ? <a href={link2} target="_blank" rel="noreferrer" className="shrink-0">
                    <Image src={img2} alt="img2" width={200} height={200} className="rounded h-auto w-auto max-h-16" />
                  </a>
                : <Image src={img2} alt="img2" width={200} height={200} className="rounded shrink-0 h-auto w-auto max-h-16" />
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-green-600 flex flex-col items-center gap-3 max-w-6xl mx-auto px-4 py-4 text-xs text-green-200">
        <div className="flex gap-2 justify-center">
          <Image src="/cc975b.png" alt="cc" width={50} height={30} className="object-contain" style={{ width: "auto" }} />
          <Image src="/mada975b.png" alt="mada" width={50} height={30} className="object-contain" style={{ width: "auto" }} />
        </div>
        <span>الحقوق محفوظة بصمة هاتفي المعتمد © 2026</span>
      </div>
    </footer>
  );
}
