import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  startDate: string;
  endDate: string;
  onApply: (start: string, end: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  tags,
  selectedTag,
  setSelectedTag,
  startDate: externalStart,
  endDate: externalEnd,
  onApply,
}) => {
  const [localStart, setLocalStart] = useState(externalStart);
  const [localEnd, setLocalEnd] = useState(externalEnd);

  const handleApply = () => {
    onApply(localStart, localEnd);
    onClose();
  };

  const handleReset = () => {
    setLocalStart('');
    setLocalEnd('');
    onApply('', '');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-md z-[60] lg:hidden"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 rounded-t-[2.5rem] p-8 pb-12 z-[70] lg:hidden shadow-2xl border-t border-gray-100 dark:border-gray-800"
          >
            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-8" />

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Filter Pencarian</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] block mb-4">Rentang Tanggal</label>
                <div className="space-y-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input type="date" value={localStart} onChange={e => setLocalStart(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-bold outline-none dark:text-gray-200" />
                  </div>
                  <div className="text-center text-[10px] font-bold text-gray-300 dark:text-gray-700">SAMPAI</div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input type="date" value={localEnd} onChange={e => setLocalEnd(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm font-bold outline-none dark:text-gray-200" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] block mb-4">Tipe Masalah</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button key={tag} onClick={() => setSelectedTag(tag)}
                      className={`px-5 py-3 rounded-full text-xs font-bold transition-all ${
                        selectedTag === tag
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-[#004aad] dark:text-blue-400'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      }`}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button onClick={handleReset} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all">
                  Reset
                </button>
                <button onClick={handleApply} className="flex-1 bg-[#004aad] dark:bg-blue-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all">
                  Terapkan Filter
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterModal;
