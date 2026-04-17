import Image from "next/image";
import { IoAddCircle, IoRemoveCircle, IoTrashOutline } from "react-icons/io5";

const fmt = (n: number) => n.toLocaleString("en-US");

interface CartItemProps {
  product: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number;
    originalPrice?: number;
    images?: string[];
    image?: string;
  };
  qty: number;
  onUpdateQty: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) =>
  src.startsWith("http") ? src : src.startsWith("/uploads") ? src : `${API}${src}`;

export default function CartItem({ product, qty, onUpdateQty, onRemove }: CartItemProps) {
  const price = product.salePrice ?? product.originalPrice ?? product.price;
  const rawImg = product.images?.[0] || product.image;
  const img = rawImg ? resolveImg(rawImg) : undefined;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 flex gap-3 sm:gap-4 shadow-sm hover:border-teal-100 transition-colors">
      {/* Image */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-xl overflow-hidden">
        {img ? (
          <Image src={img} alt={product.name} fill className="object-contain p-2" />
        ) : (
          <span className="text-2xl flex items-center justify-center w-full h-full">📱</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2">{product.name}</h3>
          <p className="text-xs sm:text-sm font-extrabold text-teal-700 mt-1">
            {fmt(price)} <span className="text-[10px] sm:text-xs font-medium text-teal-600/70">ر.س</span>
          </p>
        </div>

        {/* Bottom row: qty + subtotal + delete */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-0.5 bg-gray-50 rounded-full px-1.5 py-0.5 border border-gray-100">
            <button onClick={() => onUpdateQty(product._id, qty - 1)} className="transition hover:scale-110">
              <IoRemoveCircle size={20} className="text-gray-400 hover:text-gray-600 transition" />
            </button>
            <span className="text-xs sm:text-sm font-bold w-6 text-center text-gray-900">{qty}</span>
            <button onClick={() => onUpdateQty(product._id, qty + 1)} className="transition hover:scale-110">
              <IoAddCircle size={20} className="text-teal-500 hover:text-teal-600 transition" />
            </button>
          </div>

          {qty > 1 && (
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
              = {fmt(price * qty)} ر.س
            </span>
          )}

          <button onClick={() => onRemove(product._id)} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition">
            <IoTrashOutline size={14} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
