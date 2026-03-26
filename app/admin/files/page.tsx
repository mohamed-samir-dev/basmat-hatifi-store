"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FiUpload, FiLink, FiExternalLink } from "react-icons/fi";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FooterItem = { image: string; linkType: string; link: string; file: string };
type Data = { qrImage: string; qrLink: string; img1: string; link1: string; linkType1: string; file1: string; img2: string; link2: string; linkType2: string; file2: string; footerItems: FooterItem[] };

export default function FilesPage() {
  const [data, setData] = useState<Data>({ qrImage: "", qrLink: "", img1: "", link1: "", linkType1: "link", file1: "", img2: "", link2: "", linkType2: "link", file2: "", footerItems: [] });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  const [imgKeys, setImgKeys] = useState<Record<string, number>>({});
  const qrRef = useRef<HTMLInputElement>(null);
  const img1Ref = useRef<HTMLInputElement>(null);
  const img2Ref = useRef<HTMLInputElement>(null);
  const fileRef1 = useRef<HTMLInputElement>(null);
  const fileRef2 = useRef<HTMLInputElement>(null);
  const imgRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  function bumpKey(k: string) { setImgKeys((p) => ({ ...p, [k]: Date.now() })); }

  useEffect(() => {
    fetch(`${API}/api/admin/company`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const normalize = (item: Partial<FooterItem>): FooterItem => ({ image: item.image || "", linkType: item.linkType || "link", link: item.link || "", file: item.file || "" });
        const items = (d.footerItems && d.footerItems.length > 0
          ? d.footerItems
          : [{}, {}, {}]).map(normalize);
        setData({ qrImage: d.qrImage || "", qrLink: d.qrLink || "", img1: d.img1 || "", link1: d.link1 || "", linkType1: d.linkType1 || "link", file1: d.file1 || "", img2: d.img2 || "", link2: d.link2 || "", linkType2: d.linkType2 || "link", file2: d.file2 || "", footerItems: items });
      });
  }, []);

  async function uploadQr(file: File) {
    setUploading("qr");
    const fd = new FormData();
    fd.append("image", file);
    const r = await fetch(`${API}/api/admin/company/footer-image/qrImage`, { method: "POST", credentials: "include", body: fd });
    const json = await r.json();
    if (json.url) { setData((p) => ({ ...p, qrImage: json.url })); bumpKey("qr"); }
    setUploading(null);
  }

  async function uploadImg1(file: File) {
    setUploading("img1");
    const fd = new FormData();
    fd.append("image", file);
    const r = await fetch(`${API}/api/admin/company/footer-image/img1`, { method: "POST", credentials: "include", body: fd });
    const json = await r.json();
    if (json.url) { setData((p) => ({ ...p, img1: json.url })); bumpKey("img1"); }
    setUploading(null);
  }

  async function uploadImg2(file: File) {
    setUploading("img2");
    const fd = new FormData();
    fd.append("image", file);
    const r = await fetch(`${API}/api/admin/company/footer-image/img2`, { method: "POST", credentials: "include", body: fd });
    const json = await r.json();
    if (json.url) { setData((p) => ({ ...p, img2: json.url })); bumpKey("img2"); }
    setUploading(null);
  }

  async function uploadFile1(file: File) {
    setUploading("file1");
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch(`${API}/api/admin/company/footer-image/file1`, { method: "POST", credentials: "include", body: fd });
    const json = await r.json();
    if (json.url) setData((p) => ({ ...p, file1: json.url }));
    setUploading(null);
  }

  async function uploadFile2(file: File) {
    setUploading("file2");
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch(`${API}/api/admin/company/footer-image/file2`, { method: "POST", credentials: "include", body: fd });
    const json = await r.json();
    if (json.url) setData((p) => ({ ...p, file2: json.url }));
    setUploading(null);
  }

  async function uploadItemImg(index: number, file: File) {
    setUploading(`img-${index}`);
    const fd = new FormData();
    fd.append("image", file);
    const r = await fetch(`${API}/api/admin/company/footer-items/image/${index}`, { method: "POST", credentials: "include", body: fd });
    const json = await r.json();
    if (json.url) {
      setData((p) => {
        const items = [...p.footerItems];
        items[index] = { ...items[index], image: json.url };
        return { ...p, footerItems: items };
      });
      bumpKey(`img-${index}`);
    }
    setUploading(null);
  }

  async function uploadItemFile(index: number, file: File) {
    setUploading(`file-${index}`);
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch(`${API}/api/admin/company/footer-items/file/${index}`, { method: "POST", credentials: "include", body: fd });
    const json = await r.json();
    if (json.url) setData((p) => {
      const items = [...p.footerItems];
      items[index] = { ...items[index], file: json.url };
      return { ...p, footerItems: items };
    });
    setUploading(null);
  }

 

 
  function updateItem(index: number, field: keyof FooterItem, value: string) {
    setData((p) => {
      const items = [...p.footerItems];
      items[index] = { ...items[index], [field]: value };
      return { ...p, footerItems: items };
    });
  }

  async function save() {
    setSaving(true);
    const r = await fetch(`${API}/api/admin/company`, {
      method: "PUT", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrLink: data.qrLink, link1: data.link1, linkType1: data.linkType1, file1: data.file1, link2: data.link2, linkType2: data.linkType2, file2: data.file2, footerItems: data.footerItems }),
    });
    setSaving(false);
    setMsg(r.ok ? "✅ تم الحفظ" : "❌ حدث خطأ");
    setTimeout(() => setMsg(""), 3000);
  }

  return (
    <div className="w-full space-y-6" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">الملفات والصور</h1>
        <div className="flex items-center gap-3">
          {msg && (
            <span className={`text-sm px-3 py-1.5 rounded-lg font-medium ${msg.includes("✅") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
              {msg}
            </span>
          )}
          <button onClick={save} disabled={saving}
            className="px-5 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors">
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </div>

      {/* QR */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-600">الكيو آر</h2>
        </div>
        <div className="flex items-center gap-5 px-5 py-4">
          {/* صورة QR */}
          <div onClick={() => qrRef.current?.click()}
            className="relative w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group overflow-hidden shrink-0">
            {uploading === "qr" ? (
              <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : data.qrImage ? (
              <>
                <Image key={imgKeys["qr"] || data.qrImage} src={data.qrImage} alt="qr" fill className="object-contain p-1" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiUpload className="text-white" size={16} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-blue-500 transition-colors">
                <FiUpload size={20} />
                <span className="text-[10px]">رفع صورة</span>
              </div>
            )}
            <input ref={qrRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadQr(e.target.files[0])} />
          </div>
          {/* رابط QR */}
          <div className="flex-1 flex items-center gap-2">
            <FiLink className="text-gray-400 shrink-0" size={15} />
            <input type="text" value={data.qrLink ?? ""}
              onChange={(e) => setData((p) => ({ ...p, qrLink: e.target.value }))}
              placeholder="رابط عند الضغط على الكيو آر..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
          </div>
        </div>
      </div>

      {/* Footer Items Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-600">معروف</h2>
       
        </div>

        {data.footerItems.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-gray-400">
            لا توجد صور — اضغط &quot;إضافة صورة&quot; لإضافة أول صورة
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.footerItems.map((item, i) => (
              <div key={i} className="flex items-center gap-5 px-5 py-4">

                {/* صورة */}
                <div onClick={() => imgRefs.current[i]?.click()}
                  className="relative w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group overflow-hidden shrink-0">
                  {uploading === `img-${i}` ? (
                    <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : item.image ? (
                    <>
                      <Image key={imgKeys[`img-${i}`] || item.image} src={item.image} alt="preview" fill className="object-contain p-1" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <FiUpload className="text-white" size={16} />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-blue-500 transition-colors">
                      <FiUpload size={20} />
                      <span className="text-[10px]">رفع صورة</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" className="hidden"
                    ref={(el) => { imgRefs.current[i] = el; }}
                    onChange={(e) => e.target.files?.[0] && uploadItemImg(i, e.target.files[0])} />
                </div>

                {/* رابط أو ملف */}
                <div className="flex-1 space-y-2">
                  <div className="flex gap-4">
                    {["link", "file"].map((t) => (
                      <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-600">
                        <input type="radio" name={`type-${i}`} value={t}
                          checked={(item.linkType ?? "link") === t}
                          onChange={() => updateItem(i, "linkType", t)}
                          className="accent-blue-600" />
                        {t === "link" ? "رابط" : "ملف"}
                      </label>
                    ))}
                  </div>

                  {(item.linkType ?? "link") === "link" ? (
                    <div key="link-input" className="flex items-center gap-2">
                      <FiLink className="text-gray-400 shrink-0" size={15} />
                      <input type="text" value={item.link ?? ""}
                        onChange={(e) => updateItem(i, "link", e.target.value)}
                        placeholder="https://..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
                    </div>
                  ) : (
                    <div key="file-input" className="flex items-center gap-3">
                      <button onClick={() => fileRefs.current[i]?.click()}
                        disabled={uploading === `file-${i}`}
                        className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors disabled:opacity-50 shrink-0">
                        {uploading === `file-${i}`
                          ? <span className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          : <FiUpload size={13} />}
                        رفع ملف
                      </button>
                      <input type="file" className="hidden"
                        ref={(el) => { fileRefs.current[i] = el; }}
                        onChange={(e) => e.target.files?.[0] && uploadItemFile(i, e.target.files[0])} />
                      {item.file && (
                        <a href={item.file} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-600 text-sm hover:underline">
                          <FiExternalLink size={13} />
                          عرض الملف
                        </a>
                      )}
                    </div>
                  )}
                </div>

              

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 1 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-600"> مركز الاعمال السعودي</h2>
        </div>
        <div className="flex items-center gap-5 px-5 py-4">
          <div onClick={() => img1Ref.current?.click()}
            className="relative w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group overflow-hidden shrink-0">
            {uploading === "img1" ? (
              <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : data.img1 ? (
              <>
                <Image key={imgKeys["img1"] || data.img1} src={data.img1} alt="img1" fill className="object-contain p-1" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiUpload className="text-white" size={16} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-blue-500 transition-colors">
                <FiUpload size={20} />
                <span className="text-[10px]">رفع صورة</span>
              </div>
            )}
            <input ref={img1Ref} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadImg1(e.target.files[0])} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-4">
              {["link", "file"].map((t) => (
                <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-600">
                  <input type="radio" name="type-1" value={t}
                    checked={(data.linkType1 || "link") === t}
                    onChange={() => setData((p) => ({ ...p, linkType1: t }))}
                    className="accent-blue-600" />
                  {t === "link" ? "رابط" : "ملف"}
                </label>
              ))}
            </div>
            {(data.linkType1 || "link") === "link" ? (
              <div className="flex items-center gap-2">
                <FiLink className="text-gray-400 shrink-0" size={15} />
                <input type="text" value={data.link1 ?? ""}
                  onChange={(e) => setData((p) => ({ ...p, link1: e.target.value }))}
                  placeholder="رابط سكشن 1..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => fileRef1.current?.click()}
                  disabled={uploading === "file1"}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors disabled:opacity-50 shrink-0">
                  {uploading === "file1"
                    ? <span className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    : <FiUpload size={13} />}
                  رفع ملف
                </button>
                <input type="file" className="hidden" ref={fileRef1}
                  onChange={(e) => e.target.files?.[0] && uploadFile1(e.target.files[0])} />
                {data.file1 && (
                  <a href={data.file1} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-600 text-sm hover:underline">
                    <FiExternalLink size={13} />
                    عرض الملف
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-600"> ضريبه القيمه المضافه</h2>
        </div>
        <div className="flex items-center gap-5 px-5 py-4">
          <div onClick={() => img2Ref.current?.click()}
            className="relative w-20 h-20 rounded-xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group overflow-hidden shrink-0">
            {uploading === "img2" ? (
              <span className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : data.img2 ? (
              <>
                <Image key={imgKeys["img2"] || data.img2} src={data.img2} alt="img2" fill className="object-contain p-1" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiUpload className="text-white" size={16} />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-blue-500 transition-colors">
                <FiUpload size={20} />
                <span className="text-[10px]">رفع صورة</span>
              </div>
            )}
            <input ref={img2Ref} type="file" accept="image/*" className="hidden"
              onChange={(e) => e.target.files?.[0] && uploadImg2(e.target.files[0])} />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex gap-4">
              {["link", "file"].map((t) => (
                <label key={t} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-600">
                  <input type="radio" name="type-2" value={t}
                    checked={(data.linkType2 || "link") === t}
                    onChange={() => setData((p) => ({ ...p, linkType2: t }))}
                    className="accent-blue-600" />
                  {t === "link" ? "رابط" : "ملف"}
                </label>
              ))}
            </div>
            {(data.linkType2 || "link") === "link" ? (
              <div className="flex items-center gap-2">
                <FiLink className="text-gray-400 shrink-0" size={15} />
                <input type="text" value={data.link2 ?? ""}
                  onChange={(e) => setData((p) => ({ ...p, link2: e.target.value }))}
                  placeholder="رابط سكشن 2..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => fileRef2.current?.click()}
                  disabled={uploading === "file2"}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors disabled:opacity-50 shrink-0">
                  {uploading === "file2"
                    ? <span className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    : <FiUpload size={13} />}
                  رفع ملف
                </button>
                <input type="file" className="hidden" ref={fileRef2}
                  onChange={(e) => e.target.files?.[0] && uploadFile2(e.target.files[0])} />
                {data.file2 && (
                  <a href={data.file2} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-600 text-sm hover:underline">
                    <FiExternalLink size={13} />
                    عرض الملف
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
