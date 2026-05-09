/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: string[];
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  isOpen, 
  onClose, 
  tags, 
  selectedTag, 
  setSelectedTag 
}) => {
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
            className="fixed bottom-0 inset-x-0 bg-white rounded-t-[2.5rem] p-8 pb-12 z-[70] lg:hidden shadow-2xl"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Search Filter</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-10">
              {/* Date Filter */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] block mb-6 px-1">Rentang Tanggal</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-50">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Mulai Dari</span>
                    <span className="text-sm font-bold text-gray-800">10/24/2023</span>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-50">
                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">Berakhir Di</span>
                     <span className="text-sm font-bold text-gray-800">10/24/2023</span>
                  </div>
                </div>
              </div>

              {/* Tag Filter */}
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] block mb-6 px-1">Tipe Masalah</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-5 py-3 rounded-full text-xs font-bold transition-all ${
                        selectedTag === tag 
                          ? 'bg-blue-100 text-[#004aad] shadow-inner' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 bg-gray-100 text-gray-900 py-5 rounded-2xl font-bold text-base hover:bg-gray-200 transition-all"
                >
                  Reset
                </button>
                <button 
                  onClick={onClose}
                  className="flex-3 bg-[#004aad] text-white py-5 rounded-2xl font-bold text-base shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  Apply Filters
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
