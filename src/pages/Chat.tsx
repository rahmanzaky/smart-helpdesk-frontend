import { 
  MessageSquare, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  HelpCircle, 
  Menu, 
  X,
  Paperclip,
  Send,
  ShieldCheck,
  Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ChatBubble from '../elements/ChatBubble';
import { useState } from 'react';

interface ChatPageProps {
  onLogout: () => void;
}

export default function Chat({ onLogout }: ChatPageProps) {
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

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className={`fixed lg:relative lg:translate-x-0 w-[280px] h-full bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 ease-in-out`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#004aad]">
            <Bot className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">SEJAHE</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <button className="w-full flex items-center gap-4 px-4 py-3 bg-blue-50 text-[#004aad] rounded-xl font-semibold transition-all border-r-4 border-[#004aad]">
            <MessageSquare className="w-5 h-5" />
            Chat
          </button>
          <button className="w-full flex items-center gap-4 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl font-semibold transition-all">
            <Settings className="w-5 h-5" />
            Pengaturan
          </button>
        </nav>

        <div className="p-6 border-t border-gray-50 space-y-4">
          <button 
            onClick={onLogout}
            className="w-full py-4 border border-red-200 text-red-500 rounded-full font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
          
          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              System Status
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
              <HelpCircle className="w-4 h-4" />
              Help
            </div>
          </div>
        </div>
      </motion.aside>

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
              <div className="text-sm font-bold text-gray-900">Raffi Adyatma</div>
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
