import React from 'react';
import { X, MousePointer, Layers, Scissors, BookOpen, Check } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto overflow-x-hidden p-6 space-y-5 text-slate-200">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              ?
            </div>
            <h2 className="text-base font-bold text-slate-100">Hướng Dẫn Khám Phá Hình Học 3D</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Mouse navigation */}
          <div className="flex gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <MousePointer className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100 text-sm">Thao tác chuột & Cảm ứng</h3>
              <p className="text-slate-400 leading-relaxed">
                • <strong className="text-slate-200">Chuột trái / 1 ngón tay:</strong> Nhấn giữ và rê để xoay 360° quanh vật thể.
              </p>
              <p className="text-slate-400 leading-relaxed">
                • <strong className="text-slate-200">Con lăn chuột / Nhúm 2 ngón tay:</strong> Phóng to hoặc thu nhỏ cự ly quan sát.
              </p>
              <p className="text-slate-400 leading-relaxed">
                • <strong className="text-slate-200">Chuột phải:</strong> Kéo để di chuyển vị trí tâm nhìn (pan).
              </p>
            </div>
          </div>

          {/* Slicing and Exploded */}
          <div className="flex gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <Scissors className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100 text-sm">Mặt phẳng cắt & Tách khối</h3>
              <p className="text-slate-400 leading-relaxed">
                • Bật tính năng <strong>Mặt cắt (Thiết diện)</strong> trong thanh điều khiển để đưa mặt phẳng cắt qua khối hình, điều chỉnh độ cao và góc nghiêng để nghiên cứu hình dáng thiết diện thu được.
              </p>
              <p className="text-slate-400 leading-relaxed">
                • Kéo thanh <strong>Tách mặt (Explode)</strong> để quan sát sự tách rời của các mặt đa diện theo phương pháp tuyến.
              </p>
            </div>
          </div>

          {/* Platonic solids & Euler */}
          <div className="flex gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
            <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-slate-100 text-sm">5 Khối Đa Diện Đều (Platonic)</h3>
              <p className="text-slate-400 leading-relaxed">
                Ký hiệu <strong className="text-slate-200">{`{p, q}`}</strong>: Mỗi mặt là đa giác đều p cạnh, mỗi đỉnh là đỉnh chung của q mặt. Luôn thỏa mãn công thức Euler: <strong className="text-amber-400 font-mono">Đ - C + M = 2</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow transition"
          >
            Đã hiểu, bắt đầu khám phá
          </button>
        </div>
      </div>
    </div>
  );
};
