import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const AiSummaryModal = ({ isOpen, onClose, summary, fileName, status }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
        >
          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI Health Insights</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                  Analyzing: {fileName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
            {status === 'ANALYZING' ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-blue-600 animate-pulse" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Processing report with AI...</p>
                <p className="text-sm text-gray-500">This may take a few seconds.</p>
              </div>
            ) : status === 'FAILED' ? (
              <div className="flex flex-col items-center justify-center py-8 gap-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <h4 className="text-lg font-semibold">Analysis Failed</h4>
                <p className="text-gray-600 dark:text-gray-400 max-w-sm">
                  We couldn't process this report. Please ensure it's a valid medical PDF and try again.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <div className="flex gap-3">
                    <FileText className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {summary ? (
                        summary.split('\n').map((line, i) => (
                          <p key={i} className="text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                            {line}
                          </p>
                        ))
                      ) : (
                        <p>No summary available.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg text-green-700 dark:text-green-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>AI analysis is for informational purposes. Always consult your doctor.</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AiSummaryModal;
