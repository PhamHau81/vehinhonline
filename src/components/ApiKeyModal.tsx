import React, { useState, useEffect } from 'react';
import { Key, Shield, ExternalLink, Check, AlertTriangle, Sparkles, X, Cpu } from 'lucide-react';
import {
  AVAILABLE_MODELS,
  GeminiModelId
} from '../types/customGeometry';
import {
  getStoredApiKey,
  saveStoredApiKey,
  getStoredModel,
  saveStoredModel
} from '../services/geminiGeometryService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>('gemini-3-flash-preview');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      setSelectedModel(getStoredModel());
      setSaveSuccess(false);
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    const stored = getStoredApiKey();
    if (!stored) {
      setErrorMsg('Vui lòng nhập Gemini API Key để kích hoạt ứng dụng trước khi tiếp tục!');
      return;
    }
    onClose();
  };

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setErrorMsg('Vui lòng nhập API Key để tiếp tục sử dụng');
      return;
    }

    saveStoredApiKey(trimmed);
    saveStoredModel(selectedModel);
    setSaveSuccess(true);
    setErrorMsg('');

    if (onKeySaved) {
      onKeySaved(trimmed);
    }

    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    saveStoredApiKey('');
    setApiKey('');
    setSaveSuccess(false);
  };

  const hasExistingKey = Boolean(getStoredApiKey());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                Thiết Lập Model & API Key
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Google Gemini
                </span>
                {!hasExistingKey && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Bắt buộc nhập ban đầu
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấu hình API Key để dựng hình không gian 3D tự động theo bất kỳ đề bài nào
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* Guide callout */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <p className="font-bold text-amber-300">Hướng dẫn lấy Gemini API Key miễn phí trong 30 giây:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-300 leading-relaxed">
                <li>
                  Truy cập vào trang quản lý khoá API Google AI Studio:{' '}
                  <a
                    href="https://aistudio.google.com/api-keys"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
                  >
                    <span>https://aistudio.google.com/api-keys</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </li>
                <li>Đăng nhập bằng tài khoản Google của bạn và bấm nút <strong>"Create API key"</strong> (Tạo khoá API).</li>
                <li>Sao chép khoá vừa tạo (dạng chuỗi bắt đầu bằng <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">AIzaSy...</code>) và dán vào ô bên dưới.</li>
              </ol>
            </div>
          </div>

          {/* Model Selection Cards */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>1. Chọn Model AI Ưu Tiên</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {AVAILABLE_MODELS.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModel(m.id)}
                    className={`p-3 rounded-xl text-left border transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-xs font-bold text-slate-100">{m.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                      </div>
                      <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 mb-1.5">
                        {m.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {m.description}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-2 italic">
              * Hệ thống tự động chuyển đổi sang các model dự phòng nếu model hiện tại hết hạn ngạch (fallback chain).
            </p>
          </div>

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>2. Nhập Google Gemini API Key</span>
              </label>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-[11px] text-rose-400 hover:text-rose-300 underline"
                >
                  Xoá Key
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-sm font-mono rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-inner"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Key được lưu trữ an toàn ngay trên trình duyệt của bạn (localStorage) và không gửi tới máy chủ trung gian.
            </p>
          </div>

          {/* Error & Success States */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Đã lưu thành công cấu hình API Key và Model!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Lưu cấu hình</span>
          </button>
        </div>
      </div>
    </div>
  );
};
