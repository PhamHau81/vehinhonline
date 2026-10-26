import React, { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, HelpCircle } from 'lucide-react';
import { GEOMETRY_QUIZ, QuizQuestion } from '../types/geometry';

export const QuizSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const question = GEOMETRY_QUIZ[currentIndex];

  const handleSelectOption = (index: number) => {
    if (showAnswer) return;
    setSelectedOption(index);
    setShowAnswer(true);
    if (index === question.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < GEOMETRY_QUIZ.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const percentage = Math.round((score / GEOMETRY_QUIZ.length) * 100);
    return (
      <div className="py-3 px-4 text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">Hoàn thành bài luyện tập!</h3>
          <p className="text-xs text-slate-400 mt-1">
            Bạn đạt <span className="font-bold text-emerald-400">{score}/{GEOMETRY_QUIZ.length}</span> câu đúng ({percentage}%)
          </p>
        </div>
        <p className="text-xs text-slate-300 max-w-md mx-auto">
          {percentage >= 80
            ? 'Xuất sắc! Bạn nắm rất vững kiến thức hình học không gian và khối đa diện.'
            : percentage >= 50
            ? 'Khá tốt! Hãy quan sát kỹ lại mô hình 3D và các công thức để đạt điểm tuyệt đối nhé.'
            : 'Hãy tiếp tục xoay khối 3D, đọc công thức và thử làm lại nhé!'}
        </p>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Làm lại bài trắc nghiệm
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress & Header */}
      <div className="flex justify-between items-center text-xs">
        <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
          <HelpCircle className="w-4 h-4" />
          <span>Câu hỏi {currentIndex + 1} / {GEOMETRY_QUIZ.length}</span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          Điểm số: <span className="text-emerald-400 font-bold">{score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / GEOMETRY_QUIZ.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="text-xs font-medium text-slate-100 leading-relaxed bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/40">
        {question.question}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {question.options.map((opt, idx) => {
          let btnClass = 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700/70';
          if (showAnswer) {
            if (idx === question.correctIndex) {
              btnClass = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/80 font-bold';
            } else if (idx === selectedOption) {
              btnClass = 'bg-rose-950/70 text-rose-300 border-rose-500/80';
            } else {
              btnClass = 'bg-slate-800/40 text-slate-500 border-slate-800 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              disabled={showAnswer}
              onClick={() => handleSelectOption(idx)}
              className={`p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${btnClass}`}
            >
              <span>{opt}</span>
              {showAnswer && idx === question.correctIndex && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
              )}
              {showAnswer && idx === selectedOption && idx !== question.correctIndex && (
                <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-1" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Next */}
      {showAnswer && (
        <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-2">
          <p className="text-[11px] text-slate-300 leading-relaxed">
            <span className="font-bold text-amber-400">💡 Giải thích: </span>
            {question.explanation}
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              <span>{currentIndex === GEOMETRY_QUIZ.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
