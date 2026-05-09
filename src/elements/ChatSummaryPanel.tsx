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
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] lg:inset-y-[15%] lg:left-auto lg:right-[10%] lg:w-[600px] bg-white rounded-[2rem] shadow-2xl z-[70] flex flex-col overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {detail?.title || 'Chat Detail'}
                </h2>
                <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">
                  {detail?.status} - {detail?.time}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10 custom-scrollbar">
              {/* Summary Box */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 w-2 bg-[#004aad] rounded-l-full shadow-[4px_0_15px_rgba(0,74,173,0.2)]" />
                <div className="bg-blue-50/50 p-8 pl-10 rounded-3xl border border-blue-50 transition-all group-hover:bg-blue-50">
                  <div className="flex items-center gap-2 text-[#004aad] mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] font-sans">Chat Summary</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base font-medium">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam felis eros, hendrerit non nulla nec, rutrum viverra augue. Donec euismod arcu ut augue placerat convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras pulvinar lorem lectus, ut tempus diam lobortis vel. Pellentesque suscipit eget erat vel ultrices.
                  </p>
                </div>
              </div>

              {/* Attachments */}
              <div className="pb-8">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Attachments (2)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div 
                      key={i} 
                      className="aspect-square bg-gray-50 rounded-2xl border-2 border-gray-100 flex items-center justify-center group overflow-hidden relative"
                    >
                      <ImageIcon className="w-10 h-10 text-gray-200 group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatSummaryPanel;
