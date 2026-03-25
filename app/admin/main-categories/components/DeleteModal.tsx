"use client";

interface DeleteModalProps {
  name: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteModal({ name, onConfirm, onClose }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
        <div className="text-4xl mb-3">🗑️</div>
        <h2 className="text-lg font-bold text-gray-800 mb-1">تأكيد الحذف</h2>
        <p className="text-sm text-gray-500 mb-1">هتحذف التصنيف</p>
        <p className="text-base font-bold text-red-600 mb-2">« {name} »</p>
        <p className="text-xs text-gray-400 mb-4">سيتم إزالة هذا التصنيف من جميع المنتجات المرتبطة به</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold px-6 py-2 rounded-lg transition-colors">
            نعم، احذف
          </button>
          <button onClick={onClose}
            className="border border-gray-300 text-gray-700 text-sm font-bold px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
