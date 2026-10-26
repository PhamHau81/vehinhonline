import React, { useState } from 'react';
import {
  Sliders,
  Scissors,
  Eye,
  BookOpen,
  RotateCw,
  Grid,
  Tag,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Camera,
  Layers
} from 'lucide-react';
import { SolidDefinition, VisualStyle, CameraPreset } from '../types/geometry';
import { QuizSection } from './QuizSection';

interface ControlDockProps {
  solid: SolidDefinition;
  params: Record<string, number>;
  onParamChange: (key: string, value: number) => void;
  style: VisualStyle;
  onStyleChange: (style: VisualStyle) => void;
  isAutoRotating: boolean;
  onToggleAutoRotate: () => void;
  explodedRatio: number;
  onExplodedRatioChange: (val: number) => void;
  enableSection: boolean;
  onToggleSection: () => void;
  sectionHeight: number;
  onSectionHeightChange: (val: number) => void;
  sectionTilt: number;
  onSectionTiltChange: (val: number) => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  cameraPreset: CameraPreset;
  onSelectCameraPreset: (preset: CameraPreset) => void;
  onResetAll: () => void;
}

export const ControlDock: React.FC<ControlDockProps> = ({
  solid,
  params,
  onParamChange,
  style,
  onStyleChange,
  isAutoRotating,
  onToggleAutoRotate,
  explodedRatio,
  onExplodedRatioChange,
  enableSection,
  onToggleSection,
  sectionHeight,
  onSectionHeightChange,
  sectionTilt,
  onSectionTiltChange,
  showGrid,
  onToggleGrid,
  showLabels,
  onToggleLabels,
  cameraPreset,
  onSelectCameraPreset,
  onResetAll
}) => {
  const [activeTab, setActiveTab] = useState<'params' | 'slice' | 'view' | 'quiz'>('params');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="fixed z-30 transition-transform duration-300 pointer-events-auto"
      style={{
        bottom: '16px',
        left: '50%',
        transform: `translateX(-50%) translateY(${isCollapsed ? 'calc(100% - 38px)' : '0'})`,
        width: 'min(920px, calc(100vw - 24px))',
      }}
    >
      {/* Top Toggle Bar */}
      <div className="flex justify-center -mb-px">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900/95 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-t-xl border-t border-x border-slate-700/80 shadow-lg backdrop-blur-md transition-colors"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Mở rộng bảng điều khiển</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <span>Thu gọn điều khiển (Zen Mode)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container */}
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-3 bg-slate-950/60">
          <div className="flex space-x-1 py-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => { setActiveTab('params'); setIsCollapsed(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'params'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Kích thước & Tham số</span>
            </button>

            <button
              onClick={() => { setActiveTab('slice'); setIsCollapsed(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'slice'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Mặt cắt & Tách khối</span>
            </button>

            <button
              onClick={() => { setActiveTab('view'); setIsCollapsed(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'view'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Hiển thị & Góc nhìn</span>
            </button>

            <button
              onClick={() => { setActiveTab('quiz'); setIsCollapsed(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'quiz'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Luyện tập trắc nghiệm</span>
            </button>
          </div>

          <button
            onClick={onResetAll}
            title="Đặt lại về mặc định"
            className="text-[11px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 transition hidden sm:block"
          >
            Đặt lại
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="p-4 max-h-[48vh] overflow-y-auto scrollbar-thin">
          {/* TAB 1: Tham số & Kích thước */}
          {activeTab === 'params' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {solid.params.map((param) => {
                  const val = params[param.key] ?? param.default;
                  return (
                    <div
                      key={param.key}
                      className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">
                          {param.label} <span className="font-mono text-blue-400">({param.symbol})</span>:
                        </span>
                        <span className="font-mono font-bold text-blue-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/50">
                          {val.toFixed(2)} {param.unit}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={val}
                        onChange={(e) => onParamChange(param.key, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{param.min}</span>
                        <span>{param.max}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Mặt cắt & Tách khối */}
          {activeTab === 'slice' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Exploded / Net Separation */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      Tách mặt / Khai triển không gian
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-purple-400">
                    {Math.round(explodedRatio * 100)}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Tách các mặt đa diện theo phương vector pháp tuyến để quan sát từng mặt rời rạc.
                </p>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.02"
                  value={explodedRatio}
                  onChange={(e) => onExplodedRatioChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Cross-section Slicing Plane */}
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200">
                      Mặt phẳng cắt (Thiết diện)
                    </span>
                  </div>
                  <button
                    onClick={onToggleSection}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                      enableSection
                        ? 'bg-cyan-600 text-white shadow'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {enableSection ? 'Đang bật' : 'Đang tắt'}
                  </button>
                </div>

                {enableSection ? (
                  <div className="space-y-2.5 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Độ cao vị trí cắt (y):</span>
                        <span className="font-mono text-cyan-400 font-bold">{sectionHeight.toFixed(2)}</span>
                      </div>
                      <input
                        type="range"
                        min="-2.0"
                        max="2.0"
                        step="0.05"
                        value={sectionHeight}
                        onChange={(e) => onSectionHeightChange(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Góc nghiêng mặt cắt:</span>
                        <span className="font-mono text-cyan-400 font-bold">{sectionTilt}°</span>
                      </div>
                      <input
                        type="range"
                        min="-60"
                        max="60"
                        step="5"
                        value={sectionTilt}
                        onChange={(e) => onSectionTiltChange(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    Bật tính năng này để cắt xuyên qua khối và quan sát đa giác thiết diện sinh ra.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Hiển thị & Góc nhìn */}
          {activeTab === 'view' && (
            <div className="space-y-4">
              {/* Visual Styles */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Phong cách vật liệu 3D
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => onStyleChange('pbr')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      style === 'pbr'
                        ? 'bg-blue-600 border-blue-500 text-white shadow'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Studio Thực tế</span>
                  </button>

                  <button
                    onClick={() => onStyleChange('colorful')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      style === 'colorful'
                        ? 'bg-blue-600 border-blue-500 text-white shadow'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Mặt màu riêng biệt</span>
                  </button>

                  <button
                    onClick={() => onStyleChange('xray')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      style === 'xray'
                        ? 'bg-blue-600 border-blue-500 text-white shadow'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Thấu thị / Cạnh khuất</span>
                  </button>

                  <button
                    onClick={() => onStyleChange('wireframe')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      style === 'wireframe'
                        ? 'bg-blue-600 border-blue-500 text-white shadow'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>Khung dây (Wireframe)</span>
                  </button>
                </div>
              </div>

              {/* Camera Presets & Navigation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Camera presets */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Hình chiếu chuẩn & Góc nhìn
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => onSelectCameraPreset('perspective')}
                      className={`p-1.5 rounded-lg border text-[11px] font-semibold text-center transition ${
                        cameraPreset === 'perspective'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      3D Tự do
                    </button>
                    <button
                      onClick={() => onSelectCameraPreset('front')}
                      className={`p-1.5 rounded-lg border text-[11px] font-semibold text-center transition ${
                        cameraPreset === 'front'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Đứng
                    </button>
                    <button
                      onClick={() => onSelectCameraPreset('top')}
                      className={`p-1.5 rounded-lg border text-[11px] font-semibold text-center transition ${
                        cameraPreset === 'top'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Bằng
                    </button>
                    <button
                      onClick={() => onSelectCameraPreset('side')}
                      className={`p-1.5 rounded-lg border text-[11px] font-semibold text-center transition ${
                        cameraPreset === 'side'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      Cạnh
                    </button>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tiện ích không gian
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={onToggleAutoRotate}
                      className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 transition ${
                        isAutoRotating
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{isAutoRotating ? 'Đang xoay' : 'Dừng xoay'}</span>
                    </button>

                    <button
                      onClick={onToggleLabels}
                      className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 transition ${
                        showLabels
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Tag className="w-3.5 h-3.5" />
                      <span>Đỉnh A, B..</span>
                    </button>

                    <button
                      onClick={onToggleGrid}
                      className={`p-1.5 rounded-lg border text-[11px] font-semibold flex items-center justify-center gap-1 transition ${
                        showGrid
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Lưới sàn</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Luyện tập trắc nghiệm */}
          {activeTab === 'quiz' && <QuizSection />}
        </div>
      </div>
    </div>
  );
};
