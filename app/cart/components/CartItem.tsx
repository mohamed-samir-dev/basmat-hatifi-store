import Image from "next/image";
import { IoAddCircle, IoRemoveCircle, IoTrashOutline } from "react-icons/io5";

const fmt = (n: number) => n.toLocaleString("ar-SA");

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

export default function CartItem({ product, qty, onUpdateQty, onRemove }: CartItemProps) {
  const price = product.salePrice ?? product.originalPrice ?? product.price;
  const img = product.images?.[0] || product.image;

  return (
    <div className="bg-white rounded-2xl p-2.5 sm:p-3.5 flex gap-2 sm:gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="relative w-14 h-14 sm:w-20 sm:h-20 shrink-0 bg-gray-50 rounded-xl overflow-hidden">
        {img ? (
          <Image src={img} alt={product.name} fill className="object-contain p-1.5" />
        ) : (
          <span className="text-2xl flex items-center justify-center w-full h-full">📱</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-xs sm:text-sm font-extrabold text-teal-600 mt-1">
          {fmt(price)} <span className="text-xs font-medium text-gray-600">ر.س</span>
        </p>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-gray-50 rounded-full px-1 py-0.5">
            <button onClick={() => onUpdateQty(product._id, qty - 1)}>
              <IoRemoveCircle size={18} className="text-gray-500 hover:text-gray-700 transition" />
            </button>
            <span className="text-xs sm:text-sm font-bold w-5 text-center text-gray-900">{qty}</span>
            <button onClick={() => onUpdateQty(product._id, qty + 1)}>
              <IoAddCircle size={18} className="text-teal-500 hover:text-teal-600 transition" />
            </button>
          </div>
          <button onClick={() => onRemove(product._id)} className="text-gray-400 hover:text-red-500 transition p-1">
            <IoTrashOutline size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
