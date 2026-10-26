import React from 'react';
import {
  RotateCw,
  Tag,
  Grid,
  Camera,
  RotateCcw,
  Eye,
  EyeOff,
  Layers,
  Sparkles
} from 'lucide-react';
import { CameraPreset } from '../types/geometry';

interface CustomViewToolbarProps {
  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showDashed: boolean;
  onToggleDashed: () => void;
  showFaces: boolean;
  onToggleFaces: () => void;
  cameraPreset: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  onResetView: () => void;
  onOpenPromptDrawer: () => void;
}

export const CustomViewToolbar: React.FC<CustomViewToolbarProps> = ({
  isAutoRotating,
  onToggleAutoRotate,
  showLabels,
  onToggleLabels,
  showGrid,
  onToggleGrid,
  showDashed,
  onToggleDashed,
  showFaces,
  onToggleFaces,
  cameraPreset,
  onSelectCameraPreset,
  onResetView,
  onOpenPromptDrawer
}) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[calc(100vw-1.5rem)] overflow-x-auto p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl flex items-center gap-1 sm:gap-1.5 text-xs">
      {/* Auto Rotate */}
      <button
        type="button"
        onClick={onToggleAutoRotate}
        title="Tự động xoay 360 độ (Phím Space)"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition ${
          isAutoRotating
            ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
      >
        <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">Xoay</span>
      </button>

      {/* Show Labels */}
      <button
        type="button"
        onClick={onToggleLabels}
        title="Bật/Tắt nhãn tên đỉnh (Phím L)"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition ${
          showLabels
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        <Tag className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Đỉnh</span>
      </button>

      {/* Show Dashed Lines */}
      <button
        type="button"
        onClick={onToggleDashed}
        title="Bật/Tắt nét đứt cho cạnh khuất chuẩn SGK"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition ${
          showDashed
            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Nét đứt</span>
      </button>

      {/* Show Faces & Sections */}
      <button
        type="button"
        onClick={onToggleFaces}
        title="Bật/Tắt mặt phẳng màu & thiết diện"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition ${
          showFaces
            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Mặt & Thiết diện</span>
      </button>

      {/* Show Grid */}
      <button
        type="button"
        onClick={onToggleGrid}
        title="Bật/Tắt lưới toạ độ (Phím G)"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium transition ${
          showGrid
            ? 'bg-slate-700 text-slate-100'
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        <Grid className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Lưới</span>
      </button>

      <div className="w-[1px] h-5 bg-slate-700 mx-0.5" />

      {/* Camera Presets */}
      <div className="flex items-center gap-1">
        {(['perspective', 'front', 'top', 'side'] as CameraPreset[]).map((preset) => {
          const names: Record<CameraPreset, string> = {
            perspective: '3D',
            front: 'Đứng',
            top: 'Bằng',
            side: 'Cạnh',
            isometric: 'Trục đo'
          };
          const isSel = cameraPreset === preset;
          return (
            <button
              key={preset}
              type="button"
              onClick={() => onSelectCameraPreset(preset)}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition ${
                isSel
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {names[preset]}
            </button>
          );
        })}
      </div>

      <div className="w-[1px] h-5 bg-slate-700 mx-0.5" />

      {/* Reset view */}
      <button
        type="button"
        onClick={onResetView}
        title="Đặt lại góc nhìn ban đầu (Phím R)"
        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>

      {/* Open prompt drawer */}
      <button
        type="button"
        onClick={onOpenPromptDrawer}
        title="Mở bảng nhập đề bài"
        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span className="hidden sm:inline">Nhập đề bài</span>
      </button>
    </div>
  );
};
