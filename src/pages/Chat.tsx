import { 
  Menu, 
  Paperclip,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatBubble from '../elements/ChatBubble';
import Sidebar from '../elements/Sidebar';
import { useState } from 'react';

interface ChatPageProps {
  onLogout: () => void;
  onNavigate: (page: 'chat' | 'admin') => void;
  userRole?: 'user' | 'admin';
}

export default function Chat({ onLogout, onNavigate, userRole = 'user' }: ChatPageProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput] = useState('');

  interface Message {
    role: 'user' | 'bot';
    content: string;
    imageUrl?: string;
  }

  const messages: Message[] = [
    {
      role: 'user',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam felis eros, hendrerit non nulla nec, rutrum viverra augue. Donec euismod arcu ut augue placerat convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
      imageUrl: 'placeholder'
    },
    {
      role: 'bot',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam felis eros, hendrerit non nulla nec, rutrum viverra augue. Donec euismod arcu ut augue placerat convallis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
    }
  ];

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
          <div className="px-6 py-10 lg:px-10 overflow-y-auto flex-1 space-y-8 scrollbar-hide">
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
            </div>

            <div className="flex items-center gap-4 py-10 opacity-30">
               <div className="h-px bg-gray-200 flex-1" />
               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">mulai percakapan di sini</span>
               <div className="h-px bg-gray-200 flex-1" />
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-6 lg:px-10">
            <div className="relative group">
              <div className="absolute left-6 inset-y-0 flex items-center">
                <button className="text-gray-400 hover:text-[#004aad] transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a command or follow-up question..."
                className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 pl-16 pr-24 outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all font-medium text-gray-700 shadow-sm"
              />
              <div className="absolute right-3 inset-y-0 flex items-center">
                <button className="bg-[#004aad] text-white p-4 rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 group-active:scale-95">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}