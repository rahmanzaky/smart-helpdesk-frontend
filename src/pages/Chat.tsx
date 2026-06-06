import {
  Menu,
  Paperclip,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatBubble from '../elements/ChatBubble';
import Sidebar from '../elements/Sidebar';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { UserInfo } from '../App';

interface ChatPageProps {
  onLogout: () => void;
  onNavigate: (page: 'chat' | 'admin' | 'settings') => void;
  userRole?: 'user' | 'admin';
  user?: UserInfo | null;
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  imageUrl?: string;
  timestamp: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'bot',
  content: 'Halo! saya adalah chatbot, apa yang bisa dibantu?',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

function apiMessagesToUI(apiMessages: any[]): Message[] {
  const result: Message[] = [];
  const ordered = [...apiMessages].reverse();
  for (const m of ordered) {
    result.push({
      role: 'user',
      content: m.message,
      imageUrl: m.attachments?.[0]?.url,
      timestamp: new Date(m.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    if (m.reply) {
      result.push({
        role: 'bot',
        content: m.reply,
        timestamp: new Date(m.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }
  return result;
}

interface ChatSession {
  id: number;
  title: string;
  createdTime: string;
}

export default function Chat({ onLogout, onNavigate, userRole = 'user', user }: ChatPageProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const loadChats = useCallback(() => {
    return fetch('/api/v1/chat/chats', { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        if (json.data) setChats(json.data);
        return json.data as ChatSession[];
      });
  }, []);

  // Load chat list for sidebar on mount (don't auto-open any chat)
  useEffect(() => {
    loadChats().catch(err => {
      console.error('Failed to load chats:', err);
      setFetchError('Failed to load chat history. Please refresh the page.');
    });
  }, [loadChats]);

  const selectChat = useCallback((id: number) => {
    setChatId(id);
    setMessages([WELCOME_MESSAGE]);
    setSidebarOpen(false);
    fetch(`/api/v1/chat/messages?cid=${id}`, { credentials: 'include' })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(msgJson => {
        if (msgJson.data?.length > 0) setMessages(apiMessagesToUI(msgJson.data));
      })
      .catch(err => {
        console.error('Failed to load messages:', err);
        setFetchError('Gagal memuat pesan. Silakan coba lagi.');
      });
  }, []);

  const startNewChat = useCallback(() => {
    setChatId(null);
    setMessages([WELCOME_MESSAGE]);
    setSidebarOpen(false);
  }, []);

  const deleteChat = useCallback((id: number) => {
    fetch('/api/v1/chat/chats', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: id }),
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); })
      .then(() => {
        setChats(prev => prev.filter(c => c.id !== id));
        if (chatId === id) {
          setChatId(null);
          setMessages([WELCOME_MESSAGE]);
        }
      })
      .catch(err => {
        console.error('Failed to delete chat:', err);
        setFetchError('Gagal menghapus sesi chat. Silakan coba lagi.');
      });
  }, [chatId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !selectedImageFile) return;

    const messageText = input.trim() || 'Saya mengunggah gambar untuk dianalisis.';
    const imageFile = selectedImageFile;
    const imagePreview = selectedImagePreview;

    // Optimistically show user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: messageText,
      imageUrl: imagePreview || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
    setSelectedImageFile(null);
    setSelectedImagePreview(null);
    setIsTyping(true);

    try {
      // Create a chat session if this is the first message
      let cid = chatId;
      if (!cid) {
        const chatRes = await fetch('/api/v1/chat/chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ title: messageText.slice(0, 60) }),
        });
        if (!chatRes.ok) throw new Error('Gagal membuat sesi chat baru.');
        const chatJson = await chatRes.json();
        cid = chatJson.data.id;
        setChatId(cid);
        loadChats();
      }

      // Send message (multipart so we can attach image)
      const formData = new FormData();
      formData.append('chatId', String(cid));
      formData.append('message', messageText);
      if (imageFile) {
        formData.append('file', imageFile);
      }

      const msgRes = await fetch('/api/v1/chat/messages', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      if (!msgRes.ok) throw new Error('Gagal mengirim pesan.');
      const msgJson = await msgRes.json();
      const saved = msgJson.data;

      setMessages(prev => [...prev, {
        role: 'bot',
        content: saved?.reply || 'Maaf, layanan AI sedang tidak tersedia.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch (err) {
      console.error('Send message error:', err);
      // Remove the optimistic user message and show error
      setMessages(prev => {
        const withoutOptimistic = prev.slice(0, -1);
        return [...withoutOptimistic, {
          role: 'bot',
          content: err instanceof Error ? err.message : 'Maaf, terjadi kesalahan. Silakan coba lagi.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }];
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setUploadError('Only JPEG, PNG, WebP, and GIF images are allowed.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > maxSizeBytes) {
      setUploadError('Image must be smaller than 5MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploadError(null);
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImagePreview(event.target?.result as string);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-gray-950 overflow-hidden font-sans transition-colors duration-300">
      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        currentPage="chat"
        onNavigate={onNavigate}
        userRole={userRole}
        chats={chats}
        activeChatId={chatId}
        onSelectChat={selectChat}
        onNewChat={startNewChat}
        onDeleteChat={deleteChat}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:bg-[#f8fafc] dark:bg-gray-950 transition-colors duration-300">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800 shrink-0 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-[10px] font-bold text-[#004aad] dark:text-blue-400 uppercase tracking-wider transition-colors duration-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure LAN Connection
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900 dark:text-white">{user?.name ?? 'Karyawan'}</div>
              <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">IT Engineer</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name ?? 'user'}`} alt="avatar" />
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0 container mx-auto max-w-5xl">
          <div
            ref={chatContainerRef}
            className="px-6 py-10 lg:px-10 overflow-y-auto flex-1 space-y-8 scrollbar-hide"
          >
            {/* Title Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-none mb-4">
                  Technical Analysis
                </h1>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                   <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
                   Secure LAN Connection
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-2xl transition-colors duration-300">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Session ID</span>
                 <span className="text-xs font-mono font-bold text-gray-600 dark:text-gray-300">
                   {chatId ? `CHAT-${chatId}` : 'NEW'} | {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </span>
              </div>
            </div>

            {/* Fetch error banner */}
            {fetchError && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400 font-medium">
                <span>{fetchError}</span>
                <button
                  type="button"
                  onClick={() => setFetchError(null)}
                  className="shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Messages */}
            <div className="space-y-4">
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} content={m.content} imageUrl={m.imageUrl} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-xs font-bold animate-pulse px-6 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" />
                  </div>
                  Sedang menganalisis...
                </div>
              )}
            </div>

            {messages.length <= 1 && (
              <div className="flex items-center gap-4 py-10 opacity-30">
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">mulai percakapan di sini</span>
                <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1" />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-6 py-6 lg:px-10">
            {uploadError && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 mb-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400 font-medium">
                <span>{uploadError}</span>
                <button
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="relative group">
              <AnimatePresence>
                {selectedImagePreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-4 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-10"
                  >
                    <div className="relative group/preview">
                      <img
                        src={selectedImagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl border border-gray-50 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => { setSelectedImagePreview(null); setSelectedImageFile(null); }}
                        className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 text-gray-500 p-1.5 rounded-full shadow-md border border-gray-100 dark:border-gray-700 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="absolute left-6 inset-y-0 flex items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-[#004aad] dark:hover:text-blue-400 transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedImagePreview ? "Add a caption to this image..." : "Ask a command or follow-up question..."}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] py-6 pl-16 pr-24 outline-none focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-200 dark:focus:border-blue-800 transition-all font-medium text-gray-700 dark:focus:text-gray-700 dark:text-gray-200 shadow-sm"
              />
              <div className="absolute right-3 inset-y-0 flex items-center">
                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImageFile) || isTyping}
                  className="bg-[#004aad] dark:bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 dark:hover:bg-blue-500 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:shadow-none transition-all shadow-lg shadow-blue-200 dark:shadow-none group-active:scale-95"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
