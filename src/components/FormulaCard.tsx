import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Info, Sparkles, BookOpen } from 'lucide-react';
import { SolidDefinition } from '../types/geometry';

interface FormulaCardProps {
  solid: SolidDefinition;
  params: Record<string, number>;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({ solid, params }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const volValue = solid.formulas.volumeCalc(params);
  const totalAreaValue = solid.formulas.totalAreaCalc(params);
  const lateralAreaValue = solid.formulas.lateralAreaCalc ? solid.formulas.lateralAreaCalc(params) : null;

  const handleCopy = () => {
    const text = `[${solid.vietnameseName}]\n` +
      `Thể tích V = ${volValue.toFixed(3)}\n` +
      `Diện tích toàn phần Stp = ${totalAreaValue.toFixed(3)}\n` +
      `Công thức V: ${solid.formulas.volumeFormula}\n` +
      `Công thức Stp: ${solid.formulas.totalAreaFormula}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute top-20 left-4 z-20 w-84 max-w-[calc(100vw-2rem)] bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="p-3.5 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/30">
            {solid.symbolNotation ? solid.symbolNotation : '3D'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-slate-100">{solid.vietnameseName}</h2>
              {solid.symbolNotation && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  {solid.symbolNotation}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">{solid.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            title="Sao chép kết quả tính toán"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Thu nhỏ thông số' : 'Mở rộng thông số'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-3.5 space-y-3 max-h-[calc(100vh-22rem)] overflow-y-auto text-xs scrollbar-thin">
          {/* Characteristic counts */}
          <div className="grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-slate-800/70 p-2 rounded-xl border border-slate-700/50">
              <span className="text-[10px] uppercase text-slate-400 block font-medium">Số Đỉnh (Đ)</span>
              <span className="text-base font-bold text-amber-400 font-mono">{solid.verticesCount}</span>
            </div>
            <div className="bg-slate-800/70 p-2 rounded-xl border border-slate-700/50">
              <span className="text-[10px] uppercase text-slate-400 block font-medium">Số Cạnh (C)</span>
              <span className="text-base font-bold text-sky-400 font-mono">{solid.edgesCount}</span>
            </div>
            <div className="bg-slate-800/70 p-2 rounded-xl border border-slate-700/50">
              <span className="text-[10px] uppercase text-slate-400 block font-medium">Số Mặt (M)</span>
              <span className="text-base font-bold text-emerald-400 font-mono">{solid.facesCount}</span>
            </div>
          </div>

          {/* Volume calculation */}
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-blue-300">Thể tích (V):</span>
              <span className="text-sm font-bold text-blue-400 font-mono">
                {volValue.toFixed(3)}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
              {solid.formulas.volumeFormula}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              👉 {solid.formulas.volumeStepByStep(params)}
            </div>
          </div>

          {/* Total area calculation */}
          <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-emerald-300">Diện tích toàn phần (Stp):</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                {totalAreaValue.toFixed(3)}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
              {solid.formulas.totalAreaFormula}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              👉 {solid.formulas.totalAreaStepByStep(params)}
            </div>
          </div>

          {/* Lateral Area (if present) */}
          {lateralAreaValue !== null && solid.formulas.lateralAreaFormula && (
            <div className="bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-purple-300">Diện tích xung quanh (Sxq):</span>
                <span className="text-sm font-bold text-purple-400 font-mono">
                  {lateralAreaValue.toFixed(3)}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                {solid.formulas.lateralAreaFormula}
              </div>
            </div>
          )}

          {/* Extra geometry stats */}
          {solid.formulas.extraStats && solid.formulas.extraStats.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Đặc tính hình học & Định lý
              </span>
              <div className="space-y-1">
                {solid.formulas.extraStats.map((st, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-1 px-2 rounded bg-slate-800/30 border border-slate-700/30 text-[11px]"
                  >
                    <span className="text-slate-400">{st.label}:</span>
                    <span className="font-mono font-medium text-slate-200">{st.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fun Fact / Real world application */}
          <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-amber-200/90 text-[11px] flex gap-2 items-start">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{solid.funFact}</p>
          </div>
        </div>
      )}
    </div>
  );
};
