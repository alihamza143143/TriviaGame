import { motion, AnimatePresence } from "framer-motion";
import { type Question, type Decision, type DecisionChoice } from "@/lib/game-data";
import { X, Check, AlertTriangle, TrendingUp, HelpCircle, BrainCircuit, Sparkles, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export type ModalType = "start" | "trivia" | "decision" | "invest" | "risk" | "info";

interface GameModalProps {
  isOpen: boolean;
  type: ModalType;
  title: string;
  description: string;
  question?: Question;
  decision?: Decision;
  onClose: () => void;
  onAnswer?: (index: number) => void;
  result?: {
    success: boolean;
    message: string;
    explanation: string;
  } | null;
}

export function GameModal({ 
  isOpen, 
  type, 
  title, 
  description, 
  question, 
  decision, 
  onClose, 
  onAnswer, 
  result 
}: GameModalProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedIdx(null);
    }
  }, [isOpen]);

  const handleSelect = (idx: number) => {
    if (result) return;
    setSelectedIdx(idx);
    onAnswer?.(idx);
  };

  const getConfig = () => {
    switch (type) {
      case "start":
        return {
          icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
          iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
          iconShadow: "shadow-emerald-500/30",
          accentColor: "emerald",
        };
      case "trivia":
        return {
          icon: <HelpCircle className="w-6 h-6 md:w-8 md:h-8" />,
          iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
          iconShadow: "shadow-blue-500/30",
          accentColor: "blue",
        };
      case "decision":
        return {
          icon: <BrainCircuit className="w-6 h-6 md:w-8 md:h-8" />,
          iconBg: "bg-gradient-to-br from-purple-500 to-pink-600",
          iconShadow: "shadow-purple-500/30",
          accentColor: "purple",
        };
      case "invest":
        return {
          icon: <TrendingUp className="w-6 h-6 md:w-8 md:h-8" />,
          iconBg: "bg-gradient-to-br from-cyan-500 to-teal-600",
          iconShadow: "shadow-cyan-500/30",
          accentColor: "cyan",
        };
      case "risk":
        return {
          icon: <AlertTriangle className="w-6 h-6 md:w-8 md:h-8" />,
          iconBg: "bg-gradient-to-br from-orange-500 to-red-600",
          iconShadow: "shadow-orange-500/30",
          accentColor: "orange",
        };
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 md:w-8 md:h-8" />,
          iconBg: "bg-gradient-to-br from-gray-500 to-gray-600",
          iconShadow: "shadow-gray-500/30",
          accentColor: "gray",
        };
    }
  };

  const config = getConfig();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={result ? onClose : undefined}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative w-full max-w-xl bg-[#0c1222] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Gradient accent line at top */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
            type === 'start' ? 'from-emerald-500 to-green-500' :
            type === 'trivia' ? 'from-blue-500 to-cyan-500' :
            type === 'decision' ? 'from-purple-500 to-pink-500' :
            type === 'invest' ? 'from-cyan-500 to-teal-500' :
            type === 'risk' ? 'from-orange-500 to-red-500' :
            'from-gray-500 to-gray-400'
          }`} />

          {/* Header */}
          <div className="p-4 md:p-6 pb-0">
            <div className="flex items-start gap-3 md:gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                className={`p-2.5 md:p-3 rounded-xl ${config.iconBg} text-white shadow-lg ${config.iconShadow}`}
              >
                {config.icon}
              </motion.div>
              <div className="flex-1 min-w-0">
                <motion.h2 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-lg md:text-xl font-bold font-display tracking-wide text-white"
                >
                  {title}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-gray-400 mt-0.5"
                >
                  {description}
                </motion.p>
              </div>
              {result && (
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-4 md:p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            
            {/* Question Section */}
            {(question && !decision) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-3"
              >
                <p className="text-base md:text-lg font-medium text-white leading-relaxed">{question.q}</p>
                <div className="space-y-2">
                  {question.a.map((ans, idx) => {
                    const isCorrect = result && idx === question.correct;
                    const isWrong = result && idx === selectedIdx && idx !== question.correct;
                    const isSelected = idx === selectedIdx;
                    
                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        onClick={() => handleSelect(idx)}
                        disabled={!!result}
                        className={`
                          w-full p-3 md:p-4 rounded-xl text-left transition-all duration-200 border
                          flex items-center justify-between group
                          ${result 
                            ? isCorrect
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100' 
                              : isWrong
                                ? 'bg-red-500/20 border-red-500/50 text-red-100'
                                : 'bg-white/5 border-white/5 text-gray-500 opacity-50'
                            : isSelected
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-100'
                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-white'
                          }
                        `}
                      >
                        <span className="font-medium text-sm md:text-base">{ans}</span>
                        {isCorrect && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                        {isWrong && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center"
                          >
                            <X className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                        {!result && (
                          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Decision Section */}
            {(decision && !question) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="space-y-3"
              >
                <p className="text-base md:text-lg font-medium text-white leading-relaxed">{decision.prompt}</p>
                <div className="space-y-2">
                  {decision.choices.map((choice: DecisionChoice, idx: number) => {
                    const isSelected = result && idx === selectedIdx;
                    
                    return (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        onClick={() => handleSelect(idx)}
                        disabled={!!result}
                        className={`
                          w-full p-3 md:p-4 rounded-xl text-left transition-all duration-200 border
                          group
                          ${result 
                            ? isSelected 
                              ? 'bg-purple-500/20 border-purple-500/50 text-purple-100'
                              : 'bg-white/5 border-white/5 text-gray-500 opacity-50'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30 text-white'
                          }
                        `}
                      >
                        <div className="font-semibold text-sm md:text-base">{choice.label}</div>
                        {!result && (
                          <div className="text-xs mt-1 text-gray-400 group-hover:text-gray-300 flex items-center gap-1">
                            <span>Select this option</span>
                            <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Result Feedback */}
            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                transition={{ delay: 0.1 }}
                className={`p-4 rounded-xl border ${
                  result.success 
                    ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-emerald-500/30' 
                    : 'bg-gradient-to-br from-red-500/20 to-orange-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className={`p-2 rounded-full ${result.success ? 'bg-emerald-500' : 'bg-red-500'}`}
                  >
                    {result.success ? <Check className="w-4 h-4 text-white" /> : <X className="w-4 h-4 text-white" />}
                  </motion.div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-sm md:text-base ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.success ? 'Excellent!' : 'Not quite...'}
                    </h4>
                    <p className="text-gray-200 mt-1 text-sm">{result.message}</p>
                    <div className="mt-3 pt-3 border-t border-white/10 text-sm text-gray-400">
                      <span className="font-semibold text-cyan-400 mr-1">Learn:</span>
                      {result.explanation}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Start Tile - Payday */}
            {(!question && !decision && type === 'start') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/30 mb-4">
                  <Sparkles className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-gray-300 mb-6">Collect your payday bonus and continue your wealth journey!</p>
              </motion.div>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 md:p-6 pt-0">
            {(result || type === 'start') && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={onClose} 
                className={`
                  w-full py-3 md:py-4 rounded-xl font-bold text-white text-base md:text-lg
                  transition-all duration-200
                  ${result?.success || type === 'start'
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg shadow-emerald-500/25'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 shadow-lg shadow-blue-500/25'
                  }
                `}
              >
                {type === 'start' && !result ? 'Collect Bonus' : 'Continue'}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
