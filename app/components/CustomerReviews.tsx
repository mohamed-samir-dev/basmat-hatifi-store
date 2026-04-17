"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface Review {
  _id: string;
  name: string;
  comment: string;
  rating: number;
  gender: string;
  createdAt: string;
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", comment: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  useEffect(() => {
    fetch(`/api/reviews`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setReviews(data))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) return;
    setSubmitting(true);
    try {
      await fetch(`/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
      setShowForm(false);
      setForm({ name: "", comment: "", rating: 5 });
    } catch {}
    setSubmitting(false);
  }

  const avatarGradient = (gender: string) =>
    gender === "female"
      ? "from-pink-400 to-rose-500"
      : "from-teal-500 to-emerald-600";

  return (
    <section className="w-full bg-gradient-to-b from-white via-teal-50/60 to-teal-100/80 py-10" dir="rtl">
    <div className="max-w-6xl mx-auto px-3 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 h-px bg-gradient-to-l from-teal-300 to-transparent" />
        <div className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-5 py-2 rounded-full shadow-md">
          <span className="text-sm sm:text-base font-bold">آراء العملاء</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-teal-300 to-transparent" />
      </div>

      {reviews.length > 0 ? (
        <div className="mb-10">
          <Swiper
            modules={[Autoplay, Keyboard, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            loop={reviews.length > 3}
            className="pb-10!"
          >
            {reviews.map((r) => (
              <SwiperSlide key={r._id}>
                <div
                  onClick={() => setSelectedReview(r)}
                  className="relative bg-white rounded-2xl border border-teal-100/60 p-5 flex flex-col gap-3 hover:shadow-lg hover:border-teal-200 transition-all duration-300 h-full cursor-pointer group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-teal-50 to-transparent rounded-bl-full opacity-60" />
                  <div className="flex gap-0.5 relative z-10">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className={`text-lg ${s <= r.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 relative z-10 line-clamp-3">{r.comment}</p>
                  {r.comment.length > 120 && (
                    <span className="text-teal-500 text-xs font-medium group-hover:text-teal-700 transition-colors">اضغط لقراءة المزيد...</span>
                  )}
                  <div className="h-px bg-gradient-to-r from-transparent via-teal-100 to-transparent" />
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-linear-to-br ${avatarGradient(r.gender)} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm`}>
                      {r.name.trim().charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{r.name}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-sm mb-6">لا توجد آراء بعد، كن أول من يعلق!</p>
      )}

      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full flex flex-col gap-4 relative border border-teal-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm transition-colors"
            >✕</button>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-xl ${s <= selectedReview.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
              ))}
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{selectedReview.comment}</p>
            <div className="h-px bg-gradient-to-r from-transparent via-teal-100 to-transparent" />
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${avatarGradient(selectedReview.gender)} flex items-center justify-center text-white font-bold shrink-0 shadow-sm`}>
                {selectedReview.name.trim().charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-gray-800">{selectedReview.name}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gradient-to-l from-gray-200 to-transparent" />
        {submitted ? (
          <span className="text-xs sm:text-sm text-emerald-600 font-semibold px-4 py-2 rounded-full border border-emerald-200 bg-emerald-50">
            ✓ تم إرسال تعليقك وسيظهر بعد المراجعة
          </span>
        ) : (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="text-xs sm:text-sm font-semibold text-teal-600 hover:text-white whitespace-nowrap px-4 py-2 rounded-full border border-teal-300 hover:bg-gradient-to-r hover:from-teal-500 hover:to-emerald-500 hover:border-transparent transition-all duration-300 hover:shadow-md"
          >
            {showForm ? "إلغاء" : "+ أضف تعليقك"}
          </button>
        )}
        <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-5 bg-white rounded-2xl border border-teal-100 shadow-sm p-5 flex flex-col gap-3">
          <input
            type="text"
            placeholder="اسمك"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
            required
          />
          <textarea
            placeholder="اكتب تعليقك..."
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            rows={3}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all resize-none"
            required
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">التقييم:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })}
                className={`text-xl transition-transform hover:scale-125 ${s <= form.rating ? "text-amber-400" : "text-gray-300"}`}>★</button>
            ))}
          </div>
          <button type="submit" disabled={submitting}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-all disabled:opacity-60 shadow-md hover:shadow-lg">
            {submitting ? "جاري الإرسال..." : "إرسال التعليق"}
          </button>
        </form>
      )}
    </div>
    </section>
  );
}
