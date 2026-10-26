import React from 'react';
import {
  Box,
  Camera,
  Maximize,
  Minimize,
  HelpCircle,
  Sparkles,
  Key,
  Layers,
  Settings
} from 'lucide-react';
import { SOLIDS } from '../types/geometry';

interface HeaderProps {
  currentSolidId: string;
  onSelectSolid: (solidId: string) => void;
  onOpenGuide: () => void;
  onOpenApiKeyModal: () => void;
  onTogglePromptDrawer: () => void;
  isPromptDrawerOpen: boolean;
  isCustomMode: boolean;
  onToggleMode: (isCustom: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSolidId,
  onSelectSolid,
  onOpenGuide,
  onOpenApiKeyModal,
  onTogglePromptDrawer,
  isPromptDrawerOpen,
  isCustomMode,
  onToggleMode
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleCapture = () => {
    if (typeof (window as any).__capture3DScreenshot === 'function') {
      (window as any).__capture3DScreenshot();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 h-16 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-4 flex items-center justify-between">
      {/* Brand & Mode switch */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="font-extrabold text-xs sm:text-sm text-slate-100 flex items-center gap-1.5 leading-none tracking-tight">
              <span>VẼ HÌNH KG _ PHẠM HẬU</span>
              <span className="text-[10px] font-bold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                AI 3D
              </span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 line-clamp-1 font-medium">
              Vẽ Theo Yêu Cầu Đề Bài & Khối Đa Diện
            </p>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
          <button
            type="button"
            onClick={() => {
              onToggleMode(true);
              if (!isPromptDrawerOpen) onTogglePromptDrawer();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isCustomMode
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Vẽ theo đề bài</span>
          </button>

          <button
            type="button"
            onClick={() => onToggleMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              !isCustomMode
                ? 'bg-slate-800 text-slate-100 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>11 Khối mẫu SGK</span>
          </button>
        </div>

        {/* Standard Solids Dropdown */}
        {!isCustomMode && (
          <div className="relative hidden md:block">
            <select
              value={currentSolidId}
              onChange={(e) => onSelectSolid(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer appearance-none shadow-inner"
            >
              <optgroup label="5 Khối đa diện đều (Platonic)">
                <option value="tetrahedron">Tứ diện đều {`{3, 3}`}</option>
                <option value="cube_platonic">Khối lập phương {`{4, 3}`}</option>
                <option value="octahedron">Bát diện đều {`{3, 4}`}</option>
                <option value="dodecahedron">Mười hai diện đều {`{5, 3}`}</option>
                <option value="icosahedron">Hai mươi diện đều {`{3, 5}`}</option>
              </optgroup>
              <optgroup label="Khối đa diện cơ bản">
                <option value="box">Hình hộp chữ nhật</option>
                <option value="pyramid_square">Chóp tứ giác đều (S.ABCD)</option>
                <option value="prism_triangular">Lăng trụ tam giác đều</option>
              </optgroup>
              <optgroup label="Khối tròn xoay">
                <option value="cylinder">Hình trụ tròn xoay</option>
                <option value="cone">Hình nón tròn xoay</option>
                <option value="sphere">Hình cầu / Mặt cầu</option>
                <option value="truncated_cone">Hình nón cụt</option>
              </optgroup>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Right controls: API Key with RED text as required by AI_INSTRUCTIONS */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile quick button for Drawing by prompt */}
        <button
          type="button"
          onClick={() => {
            onToggleMode(true);
            onTogglePromptDrawer();
          }}
          className={`flex lg:hidden items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
            isCustomMode && isPromptDrawerOpen
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 border border-slate-700 text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Nhập đề</span>
        </button>

        {/* API Key Settings Button with required RED notice */}
        <button
          type="button"
          onClick={onOpenApiKeyModal}
          title="Cấu hình Model & Gemini API Key"
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 border border-amber-500/40 hover:border-amber-400 text-slate-200 hover:bg-slate-800 transition shadow-sm group"
        >
          <Key className="w-3.5 h-3.5 text-amber-400 shrink-0 group-hover:rotate-12 transition-transform" />
          <div className="flex flex-col text-left">
            <span className="text-[11px] sm:text-xs font-bold leading-none text-slate-200 flex items-center gap-1">
              Settings
              <span className="hidden sm:inline font-normal text-slate-400">(API Key)</span>
            </span>
            {/* Required prominent RED notice from AI_INSTRUCTIONS.md */}
            <span className="text-[9px] sm:text-[10px] font-bold text-rose-500 group-hover:text-rose-400 leading-tight">
              Lấy API key để sử dụng app
            </span>
          </div>
        </button>

        {/* Screenshot Capture Button */}
        <button
          onClick={handleCapture}
          title="Chụp ảnh mô hình 3D (PNG)"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition shadow-sm"
        >
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden xl:inline">Chụp ảnh</span>
        </button>

        {/* Guide button */}
        <button
          onClick={onOpenGuide}
          title="Hướng dẫn học tập"
          className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition shadow-sm"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
        </button>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
          className="p-2 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition shadow-sm"
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
