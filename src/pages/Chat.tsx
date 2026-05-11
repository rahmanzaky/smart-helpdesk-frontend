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
import { useEffect, useRef, useState } from 'react';

interface ChatPageProps {
  onLogout: () => void;
  onNavigate: (page: 'chat' | 'admin') => void;
  userRole?: 'user' | 'admin';
}

interface Message {
  role: 'user' | 'bot';
  content: string;
  imageUrl?: string;
  timestamp: string;
}

export default function Chat({ onLogout, onNavigate, userRole = 'user' }: ChatPageProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // messages
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: 'placeholder',
      timestamp: '12:44 PM'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      role: 'user',
      content: input || (selectedImage ? 'Saya mengunggah gambar untuk dianalisis.' : ''),
      imageUrl: selectedImage || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    simulateBotResponse();
  };

  // simulasi response bot
  const simulateBotResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      const botMessage: Message = {
        role: 'bot',
        content: 'placeholder',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
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
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:bg-[#f8fafc]">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white border-b border-gray-50 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-[10px] font-bold text-[#004aad] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure LAN Connection
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900">Karyawan</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">IT Engineer</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=raffi" alt="avatar" />
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
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none mb-4">
                  Technical Analysis
                </h1>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-500 uppercase tracking-widest">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                   Secure LAN Connection
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Session ID</span>
                 <span className="text-xs font-mono font-bold text-gray-600">QC-9921-X-04 | 12:44 PM</span>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-4">
              {messages.map((m, i) => (
                <ChatBubble key={i} role={m.role} content={m.content} imageUrl={m.imageUrl} />
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-gray-400 text-xs font-bold animate-pulse px-6 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" />
                  </div>
                  AI is thinking...
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 py-10 opacity-30">
               <div className="h-px bg-gray-200 flex-1" />
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">mulai percakapan di sini</span>
               <div className="h-px bg-gray-200 flex-1" />
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-6 lg:px-10">
            <form onSubmit={handleSendMessage} className="relative group">
              <AnimatePresence>
                {selectedImage && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bottom-full left-0 mb-4 p-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-10"
                  >
                    <div className="relative group/preview">
                      <img 
                        src={selectedImage} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-xl border border-gray-50"
                      />
                      <button 
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute -top-2 -right-2 bg-white text-gray-500 p-1.5 rounded-full shadow-md border border-gray-100 hover:text-red-500 transition-colors"
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
                  className="text-gray-400 hover:text-[#004aad] transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedImage ? "Add a caption to this image..." : "Ask a command or follow-up question..."}
                className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 pl-16 pr-24 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all font-medium text-gray-700 shadow-sm"
              />
              <div className="absolute right-3 inset-y-0 flex items-center">
                <button 
                  type="submit"
                  disabled={!input.trim() && !selectedImage}
                  className="bg-[#004aad] text-white p-4 rounded-full hover:bg-blue-700 disabled:bg-gray-200 disabled:shadow-none transition-all shadow-lg shadow-blue-200 group-active:scale-95"
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
