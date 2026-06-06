import React, { useState, useEffect } from 'react';
import { X, Sparkles, MessageSquare, Wrench, TrendingUp, Tag, ArrowRight, Loader2, Bot, User } from 'lucide-react';
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

interface Attachment {
  id: number;
  url?: string;
  fileName: string;
}

interface Message {
  id: number;
  authorName: string;
  message: string;
  reply: string;
  createdTime: string;
  attachments?: Attachment[];
}

interface ChatSummaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chat: AdminChat | null;
  onSummaryGenerated?: (chatId: number, summary: string) => void;
}

const SectionCard = ({ icon, label, color, children }: { icon: React.ReactNode; label: string; color: string; children: React.ReactNode }) => (
  <div className={`rounded-2xl border ${color} p-5`}>
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{children}</p>
  </div>
);

const ChatSummaryPanel: React.FC<ChatSummaryPanelProps> = ({ isOpen, onClose, chat, onSummaryGenerated }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !chat) return;
    setMessages([]);
    setError(null);
    setMessagesLoading(true);
    fetch(`/api/v1/chat/messages?cid=${chat.id}`, { credentials: 'include' })
      .then(r => r.json())
      .then(json => {
        if (json.data) setMessages([...json.data].reverse());
      })
      .catch(() => {})
      .finally(() => setMessagesLoading(false));
  }, [isOpen, chat?.id]);

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
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal membuat ringkasan. Coba lagi.');
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
              <div className="px-8 pt-8 pb-5 flex items-start justify-between shrink-0 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
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

              {/* Scrollable body */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar pb-4">

                {/* Summary section — top */}
                {parsedSummary && (
                  <div className="space-y-3">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/30 text-[#004aad] dark:text-blue-400">
                      {parsedSummary.category}
                    </span>
                    <SectionCard icon={<MessageSquare className="w-3.5 h-3.5 text-blue-500" />} label="Topik Diskusi" color="border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
                      {parsedSummary.topic}
                    </SectionCard>
                    <SectionCard icon={<Tag className="w-3.5 h-3.5 text-red-400" />} label="Masalah yang Dilaporkan" color="border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                      {parsedSummary.reported_issue}
                    </SectionCard>
                    <SectionCard icon={<Wrench className="w-3.5 h-3.5 text-green-500" />} label="Solusi yang Diberikan" color="border-green-100 dark:border-green-900/30 bg-green-50/50 dark:bg-green-900/10">
                      {parsedSummary.solution}
                    </SectionCard>
                    <SectionCard icon={<TrendingUp className="w-3.5 h-3.5 text-purple-500" />} label="Manfaat" color="border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10">
                      {parsedSummary.benefit}
                    </SectionCard>
                    <SectionCard icon={<ArrowRight className="w-3.5 h-3.5 text-orange-500" />} label="Rekomendasi Tindak Lanjut" color="border-orange-100 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-900/10">
                      {parsedSummary.recommendation}
                    </SectionCard>
                  </div>
                )}

                {/* Divider between summary and messages */}
                {!messagesLoading && messages.length > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Riwayat Percakapan</span>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 flex-1" />
                  </div>
                )}

                {/* Chat messages */}
                <div>
                  {messagesLoading && (
                    <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Memuat pesan...</span>
                    </div>
                  )}
                  {!messagesLoading && messages.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-6">Belum ada pesan.</p>
                  )}
                  {!messagesLoading && messages.map((msg) => (
                    <div key={msg.id} className="space-y-2 mb-4">
                      {/* User bubble */}
                      <div className="flex items-start gap-3 justify-end">
                        <div className="max-w-[80%]">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right mb-1">{msg.authorName}</p>
                          {msg.attachments && msg.attachments.length > 0 && msg.attachments[0].url && (
                            <div className="mb-1 flex justify-end">
                              <img
                                src={msg.attachments[0].url}
                                alt={msg.attachments[0].fileName}
                                className="max-w-[240px] max-h-[180px] rounded-2xl rounded-tr-sm object-cover border border-blue-200 dark:border-blue-800"
                              />
                            </div>
                          )}
                          <div className="bg-[#004aad] dark:bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                            {msg.message}
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0 mt-5">
                          <User className="w-3.5 h-3.5 text-[#004aad] dark:text-blue-400" />
                        </div>
                      </div>
                      {/* Bot reply */}
                      {msg.reply && (
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-5">
                            <Bot className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="max-w-[80%]">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">EPSON ASSIST</p>
                            <div className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
                              {msg.reply}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>

              {/* Sticky footer — always visible */}
              {!messagesLoading && messages.length > 0 && (
                <div className="shrink-0 px-8 py-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between gap-4">
                  {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                  <div className="flex-1" />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-6 py-3 bg-[#004aad] dark:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-all disabled:opacity-60"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {isGenerating ? 'Sedang menganalisis...' : parsedSummary ? 'Perbarui Analisis' : 'Buat Analisis AI'}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatSummaryPanel;
