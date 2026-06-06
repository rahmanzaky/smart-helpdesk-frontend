import React, { useState } from 'react';
import { X, Sparkles, MessageSquare, Wrench, TrendingUp, Tag, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ChatSummaryData {
  topic: string;
  reported_issue: string;
  solution: string;
  benefit: string;
  category: string;
  recommendation: string;
}

export interface AdminChat {
  id: number;
  title: string;
  authorId: number;
  authorName: string;
  summary?: string | null;
  createdTime: string;
}

interface ChatSummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chat: AdminChat | null;
  onSummaryGenerated?: (chatId: number, summary: string) => void;
}

const SectionCard = ({ icon, label, color, children }: { icon: React.ReactNode; label: string; color: string; children: React.ReactNode }) => (
  <div className={`relative rounded-2xl border ${color} p-6`}>
    <div className="flex items-center gap-2 mb-3">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{children}</p>
  </div>
);

const ChatSummaryPanel: React.FC<ChatSummaryPanelProps> = ({ isOpen, onClose, chat, onSummaryGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedSummary: ChatSummaryData | null = (() => {
    if (!chat?.summary) return null;
    try { return JSON.parse(chat.summary); } catch { return null; }
  })();

  const handleGenerate = async () => {
    if (!chat) return;
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/chat/chats/summary', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chat.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? `Error ${res.status}`);
      const summaryStr = typeof json.summary === 'string' ? json.summary : JSON.stringify(json.summary);
      onSummaryGenerated?.(chat.id, summaryStr);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat ringkasan.');
    } finally {
      setIsGenerating(false);
    }
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="pointer-events-auto w-full max-w-[760px] max-h-[88vh] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-gray-100 dark:border-gray-800"
            >
              {/* Header */}
              <div className="p-8 pb-5 flex items-start justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#004aad] dark:text-blue-400 fill-current" />
                    <span className="text-[10px] font-black text-[#004aad] dark:text-blue-400 uppercase tracking-[0.2em]">Ringkasan Sesi</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                    {chat?.title ?? '—'}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest">
                    {chat?.authorName} · {chat ? new Date(chat.createdTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400 dark:text-gray-500 -mt-1 -mr-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-4 custom-scrollbar">
                {!parsedSummary ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-[#004aad] dark:text-blue-400" />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">Belum ada ringkasan</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">Buat ringkasan AI untuk sesi chat ini</p>
                    </div>
                    {error && (
                      <p className="text-sm text-red-500 font-medium">{error}</p>
                    )}
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-6 py-3 bg-[#004aad] dark:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-all disabled:opacity-60"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      {isGenerating ? 'Sedang meringkas...' : 'Buat Ringkasan AI'}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Category badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-[#004aad] dark:text-blue-400">
                        {parsedSummary.category}
                      </span>
                    </div>

                    <SectionCard
                      icon={<MessageSquare className="w-4 h-4 text-blue-500" />}
                      label="Topik Diskusi"
                      color="border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10"
                    >
                      {parsedSummary.topic}
                    </SectionCard>

                    <SectionCard
                      icon={<Tag className="w-4 h-4 text-red-400" />}
                      label="Masalah yang Dilaporkan"
                      color="border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10"
                    >
                      {parsedSummary.reported_issue}
                    </SectionCard>

                    <SectionCard
                      icon={<Wrench className="w-4 h-4 text-green-500" />}
                      label="Solusi yang Diberikan"
                      color="border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10"
                    >
                      {parsedSummary.solution}
                    </SectionCard>

                    <SectionCard
                      icon={<TrendingUp className="w-4 h-4 text-purple-500" />}
                      label="Manfaat"
                      color="border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10"
                    >
                      {parsedSummary.benefit}
                    </SectionCard>

                    <SectionCard
                      icon={<ArrowRight className="w-4 h-4 text-orange-500" />}
                      label="Rekomendasi Tindak Lanjut"
                      color="border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10"
                    >
                      {parsedSummary.recommendation}
                    </SectionCard>

                    {/* Regenerate button */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-[#004aad] hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-700 transition-all disabled:opacity-50"
                      >
                        {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {isGenerating ? 'Memperbarui...' : 'Perbarui Ringkasan'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatSummaryPanel;
