import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  BookOpen,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  Send,
  Zap,
  AlertTriangle,
  Cpu,
  Clock
} from 'lucide-react';
import { CustomGeometryScene } from '../types/customGeometry';
import {
  SAMPLE_PROBLEMS,
  generate3DGeometryFromPrompt,
  getStoredApiKey,
  StepProgressEvent
} from '../services/geminiGeometryService';

type StepState = 'idle' | 'running' | 'success' | 'error';

interface ExecutionStep {
  id: 1 | 2 | 3;
  name: string;
  sub: string;
  state: StepState;
}

const INITIAL_STEPS: ExecutionStep[] = [
  { id: 1, name: 'Bước 1: Phân tích đề bài', sub: 'Trích xuất giả thiết & khối', state: 'idle' },
  { id: 2, name: 'Bước 2: Dựng toạ độ 3D', sub: 'Toạ độ đỉnh & cạnh nét khuất', state: 'idle' },
  { id: 3, name: 'Bước 3: Dựng mặt & thiết diện', sub: 'Mặt phẳng, góc vuông & thiết diện', state: 'idle' }
];

interface PromptGeometryDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  currentScene: CustomGeometryScene | null;
  onSceneGenerated: (scene: CustomGeometryScene) => void;
  onOpenApiKeyModal: () => void;
  showDashed: boolean;
  onToggleDashed: () => void;
  showFaces: boolean;
  onToggleFaces: () => void;
}

export const PromptGeometryDrawer: React.FC<PromptGeometryDrawerProps> = ({
  isOpen,
  onToggle,
  currentScene,
  onSceneGenerated,
  onOpenApiKeyModal,
  showDashed,
  onToggleDashed,
  showFaces,
  onToggleFaces
}) => {
  const [promptText, setPromptText] = useState(
    'Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a, SA vuông góc với (ABCD). M là trung điểm SC. Vẽ hình chóp và thiết diện qua M song song với (SBD).'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>(INITIAL_STEPS);
  const [pipelineState, setPipelineState] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [modelNotice, setModelNotice] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleGenerate = async () => {
    if (!promptText.trim()) return;

    setIsLoading(true);
    setErrorDetails(null);
    setModelNotice('');
    setPipelineState('running');
    setProgressPercent(15);
    setProgressStatus('Đang khởi động quy trình AI dựng hình...');

    // Reset steps to initial
    setExecutionSteps([
      { id: 1, name: 'Bước 1: Phân tích đề bài', sub: 'Đang xử lý...', state: 'running' },
      { id: 2, name: 'Bước 2: Dựng toạ độ 3D', sub: 'Chờ xử lý', state: 'idle' },
      { id: 3, name: 'Bước 3: Dựng mặt & thiết diện', sub: 'Chờ xử lý', state: 'idle' }
    ]);

    try {
      const generated = await generate3DGeometryFromPrompt(
        promptText,
        undefined,
        (event: StepProgressEvent) => {
          if (event.status === 'trying') {
            if (event.step === 1) {
              setProgressPercent(30);
              setProgressStatus(`[Bước 1] Đang phân tích giả thiết bằng ${event.model}...`);
              setExecutionSteps((prev) => [
                { ...prev[0], state: 'running', sub: `Xử lý với ${event.model}` },
                prev[1],
                prev[2]
              ]);
            } else if (event.step === 2) {
              setProgressPercent(65);
              setProgressStatus(`[Bước 2] Tính toán toạ độ đỉnh & cạnh...`);
              setExecutionSteps((prev) => [
                { ...prev[0], state: 'success', sub: 'Hoàn tất' },
                { ...prev[1], state: 'running', sub: `Tính toán toạ độ 3D` },
                prev[2]
              ]);
            } else if (event.step === 3) {
              setProgressPercent(90);
              setProgressStatus(`[Bước 3] Dựng mặt phẳng và thiết diện...`);
              setExecutionSteps((prev) => [
                { ...prev[0], state: 'success', sub: 'Hoàn tất' },
                { ...prev[1], state: 'success', sub: 'Hoàn tất' },
                { ...prev[2], state: 'running', sub: `Dựng mặt & thiết diện` }
              ]);
            }
          } else if (event.status === 'success') {
            if (event.step === 3) {
              setProgressPercent(100);
              setProgressStatus(`Hoàn tất dựng hình thành công với ${event.model}!`);
              setExecutionSteps((prev) => prev.map((s) => ({ ...s, state: 'success', sub: 'Hoàn tất' })));
            }
          } else if (event.status === 'failed') {
            if (event.message) {
              setModelNotice(event.message);
            }
          }
        }
      );

      setExecutionSteps([
        { id: 1, name: 'Bước 1: Phân tích đề bài', sub: 'Hoàn tất', state: 'success' },
        { id: 2, name: 'Bước 2: Dựng toạ độ 3D', sub: 'Hoàn tất', state: 'success' },
        { id: 3, name: 'Bước 3: Dựng mặt & thiết diện', sub: 'Hoàn tất', state: 'success' }
      ]);
      setProgressPercent(100);
      setPipelineState('success');
      onSceneGenerated(generated);
      setErrorDetails(null);
      setModelNotice('');
    } catch (err: any) {
      const rawError = err?.message || 'Không thể tạo hình học từ đề bài này';
      setErrorDetails(rawError);
      setPipelineState('error');
      setProgressStatus('Quy trình đã dừng do lỗi API');

      // Rule 3: Trạng thái các cột đang chờ phải chuyển thành "Đã dừng do lỗi", tuyệt đối không được hiện "Hoàn tất" hoặc checkmark xanh nếu bị gián đoạn
      setExecutionSteps((prev) =>
        prev.map((s) => {
          if (s.state === 'success') return s;
          return {
            ...s,
            state: 'error',
            sub: 'Đã dừng do lỗi'
          };
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_PROBLEMS[0]) => {
    setPromptText(sample.prompt);
    onSceneGenerated(sample.scene);
    setErrorDetails(null);
    setProgressStatus('');
    setModelNotice('');
    setPipelineState('idle');
    setProgressPercent(0);
    setExecutionSteps(INITIAL_STEPS);
  };

  const handleCopySummary = () => {
    if (!currentScene) return;
    const txt = `[${currentScene.title}]\nĐề bài: ${currentScene.problemPrompt}\n\nTóm tắt: ${currentScene.summary}\n\nCác bước dựng hình:\n${currentScene.steps?.map((s, i) => `${i + 1}. ${s}`).join('\n') || ''}`;
    navigator.clipboard.writeText(txt);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <>
      {/* Floating Toggle Tab when closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-20 right-4 z-20 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xl shadow-blue-500/25 border border-blue-400/40 backdrop-blur-md transition-all duration-300 hover:scale-105"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>Vẽ Theo Đề Bài</span>
        </button>
      )}

      {/* Slide-out Drawer Panel */}
      <div
        className={`fixed top-16 right-0 bottom-0 z-30 w-full sm:w-105 bg-slate-900/95 border-l border-slate-800 backdrop-blur-xl shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 leading-tight">
                Vẽ Hình Theo Yêu Cầu Đề Bài
              </h2>
              <p className="text-[11px] text-slate-400">Dựng hình không gian 3D tự động từ đề bài</p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Đóng bảng"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-slate-200">
          {/* Input Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                <span>Nhập Đề Bài Toán Không Gian</span>
              </label>
              <button
                type="button"
                onClick={() => setPromptText('')}
                className="text-[11px] text-slate-400 hover:text-slate-200"
              >
                Xoá đề
              </button>
            </div>

            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={4}
              placeholder="Ví dụ: Cho hình chóp S.ABCD có đáy là hình vuông, SA vuông góc với (ABCD)..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none leading-relaxed shadow-inner"
            />
          </div>

          {/* Quick Sample Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Gợi ý mẫu đề bài thi THPT (Bấm để thử ngay):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROBLEMS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/70 text-[11px] font-medium text-slate-300 hover:text-white transition active:scale-95 text-left"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button & Progress */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading || !promptText.trim()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang dựng hình không gian 3D...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Dựng Hình Ngay</span>
                </>
              )}
            </button>

            {/* Pipeline Execution Steps (3 Bước chuẩn hóa) */}
            <div className="space-y-2 mt-3">
              {/* Progress bar */}
              {(pipelineState !== 'idle' || progressPercent > 0) && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      {pipelineState === 'running' && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping inline-block" />
                      )}
                      <span>Tiến trình dựng hình ({progressPercent}%)</span>
                    </span>
                    <span
                      className={`font-semibold ${
                        pipelineState === 'error'
                          ? 'text-rose-400'
                          : pipelineState === 'success'
                          ? 'text-emerald-400'
                          : 'text-blue-400'
                      }`}
                    >
                      {pipelineState === 'error'
                        ? 'Đã dừng do lỗi'
                        : pipelineState === 'success'
                        ? 'Hoàn tất'
                        : 'Đang xử lý'}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        pipelineState === 'error'
                          ? 'bg-rose-500'
                          : pipelineState === 'success'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* 3 Step Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {executionSteps.map((step) => {
                  const isSuccess = step.state === 'success';
                  const isRunning = step.state === 'running';
                  const isError = step.state === 'error';

                  return (
                    <div
                      key={step.id}
                      className={`p-2.5 rounded-xl border transition flex flex-col justify-between ${
                        isError
                          ? 'bg-rose-950/25 border-rose-500/50 text-rose-200'
                          : isSuccess
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-100'
                          : isRunning
                          ? 'bg-blue-950/30 border-blue-500/60 text-blue-200 shadow-sm ring-1 ring-blue-500/40'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-bold tracking-tight line-clamp-1">
                          {step.name}
                        </span>
                        {isSuccess && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                        {isRunning && (
                          <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin shrink-0" />
                        )}
                        {isError && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        {!isSuccess && !isRunning && !isError && (
                          <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                        )}
                      </div>

                      <div className="text-[10px] leading-tight">
                        <span
                          className={`font-semibold ${
                            isError
                              ? 'text-rose-400'
                              : isSuccess
                              ? 'text-emerald-400'
                              : isRunning
                              ? 'text-blue-300'
                              : 'text-slate-500'
                          }`}
                        >
                          {step.sub}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Status Message Text */}
              {progressStatus && (
                <div className="text-center text-[11px] text-slate-300 font-medium py-1 animate-fadeIn">
                  {progressStatus}
                </div>
              )}

              {/* Fallback Notice Banner */}
              {modelNotice && (
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2 animate-fadeIn">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{modelNotice}</span>
                </div>
              )}

              {/* Raw Error Banner */}
              {errorDetails && (
                <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <p className="font-bold text-rose-300 uppercase tracking-wider text-[11px]">
                      Quy trình đã dừng do lỗi API:
                    </p>
                    <div className="p-2 rounded-lg bg-black/50 border border-rose-900/60 font-mono text-[11px] text-rose-200 break-all select-all">
                      {errorDetails}
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Nếu lỗi là <span className="font-mono text-rose-300">429 RESOURCE_EXHAUSTED</span> (hết quota) hoặc <span className="font-mono text-rose-300">API_KEY_INVALID</span>, vui lòng bấm nút bên dưới để đổi sang API Key mới từ Google AI Studio.
                    </p>
                    <button
                      type="button"
                      onClick={onOpenApiKeyModal}
                      className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition shadow-md shadow-rose-900/30"
                    >
                      <span>👉 Bấm vào đây để cấu hình / đổi API Key</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Display Controls (Nét đứt, Mặt phẳng) */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Tuỳ chọn hiển thị 3D:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleDashed}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition ${
                  showDashed
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Bật/Tắt nét đứt cho cạnh khuất"
              >
                <span>Nét đứt (khuất)</span>
              </button>

              <button
                type="button"
                onClick={onToggleFaces}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition ${
                  showFaces
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Bật/Tắt mặt phẳng tô bóng & thiết diện"
              >
                <span>Mặt phẳng & Thiết diện</span>
              </button>
            </div>
          </div>

          {/* Generated Result Analysis Card */}
          {currentScene && (
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{currentScene.title}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {currentScene.summary}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition shrink-0"
                  title="Sao chép tóm tắt & lời giải"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Elements stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="block text-slate-400 text-[10px]">Số đỉnh</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {currentScene.vertices.length}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="block text-slate-400 text-[10px]">Cạnh (liền/đứt)</span>
                  <span className="font-bold text-blue-400 text-sm">
                    {currentScene.edges.length}
                  </span>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="block text-slate-400 text-[10px]">Mặt & Thiết diện</span>
                  <span className="font-bold text-purple-400 text-sm">
                    {currentScene.faces.length}
                  </span>
                </div>
              </div>

              {/* Steps */}
              {currentScene.steps && currentScene.steps.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                    Phương pháp dựng hình chuẩn SGK:
                  </span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {currentScene.steps.map((st, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-snug">{st}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Key Properties */}
              {currentScene.keyProperties && currentScene.keyProperties.length > 0 && (
                <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide">
                    Tính chất & Yếu tố hình học quan trọng:
                  </span>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    {currentScene.keyProperties.map((kp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 shrink-0">•</span>
                        <span className="leading-snug">{kp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
