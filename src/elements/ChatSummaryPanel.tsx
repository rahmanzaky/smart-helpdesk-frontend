import React from 'react';
import { X, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatSummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  detail: {
    title: string;
    status: string;
    time: string;
  } | null;
}

const ChatSummaryPanel: React.FC<ChatSummaryPanelProps> = ({ isOpen, onClose, detail }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="pointer-events-auto w-full max-w-[800px] max-h-[85vh] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              {/* Header */}
              <div className="p-10 pb-6 flex items-start justify-between">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none">
                  {detail?.title || 'Chat Detail'}
                </h2>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 mt-3 uppercase tracking-[0.15em]">
                  {detail?.status} - {detail?.time}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 dark:text-gray-500 -mt-2 -mr-2"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-10 py-6 space-y-12 custom-scrollbar">
              {/* Summary Box */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 w-1.5 bg-[#004aad] dark:bg-blue-600 rounded-l-full" />
                <div className="bg-[#f8fafc] dark:bg-gray-800/50 p-10 pl-12 rounded-[2rem] border border-gray-100/50 dark:border-gray-700/50 transition-all">
                  <div className="flex items-center gap-2 text-[#004aad] dark:text-blue-400 mb-6">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] font-sans">Chat Summary</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-[1.8] text-sm md:text-base font-medium">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam felis eros, hendrerit non nulla nec, 
                    rutrum viverra augue. Donec euismod arcu ut augue placerat convallis. Pellentesque habitant morbi 
                    tristique senectus et netus et malesuada fames ac turpis egestas. Cras pulvinar lorem lectus, ut 
                    tempus diam lobortis vel. Pellentesque suscipit eget erat vel ultrices. Semper quam vel, porta lorem. 
                    Aliquam nibh ligula, faucibus vitae metus interdum, dapibus tincidunt eros.
                  </p>
                </div>
              </div>

              {/* Attachments */}
              <div className="pb-12">
                <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-8">Attachments (2)</h3>
                <div className="flex gap-6">
                  {[1, 2].map((i) => (
                    <div 
                      key={i} 
                      className="w-32 h-32 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center group overflow-hidden relative shadow-sm hover:border-blue-100 dark:hover:border-blue-900 transition-colors cursor-pointer"
                    >
                      <ImageIcon className="w-10 h-10 text-gray-200 dark:text-gray-700 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.02] group-hover:bg-black/0 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    )}
  </AnimatePresence>
  );
};

export default ChatSummaryPanel;
