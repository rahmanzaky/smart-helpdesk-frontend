import React, { useState } from 'react';
import { 
    MessageSquare, 
    Settings, 
    HelpCircle, 
    ShieldCheck, 
    Menu, 
    X, 
    Command, 
    Paperclip, 
    Bot,
    Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';

const Chat: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className="bg-slate-50 text-slate-900 antialiased min-h-screen flex overflow-hidden">
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleDrawer}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar / Drawer */}
      <aside 
        id="sidebar" 
        className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 z-50 transition-transform duration-300 lg:translate-x-0 lg:static lg:w-64 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between lg:justify-start gap-2">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#0047AB]" />
            <span className="text-xl font-bold tracking-tighter text-[#0047AB]">SEJAHE</span>
          </div>
          <button onClick={toggleDrawer} className="lg:hidden p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#0047AB]/5 border-r-4 border-[#0047AB] text-[#0047AB] font-semibold">
            <MessageSquare className="w-5 h-5" />
            Chat
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
            <Settings className="w-5 h-5" />
            Pengaturan
          </a>
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-4">
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3 border border-red-200 text-red-500 rounded-xl font-semibold hover:bg-red-50 transition-colors"
          >
            Log Out
          </button>
          <div className="px-2 space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              System Status Online
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <HelpCircle className="w-3 h-3" />
              Help Center
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={toggleDrawer} className="lg:hidden p-2 hover:bg-slate-100 rounded-full">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="hidden sm:flex px-3 py-1 bg-[#E0E7FF] text-[#0047AB] rounded-full text-[10px] font-bold uppercase tracking-wider items-center gap-1.5">
              <ShieldCheck className="w-3 h-3" />
              SECURE LAN CONNECTION
            </div>
            <span className="lg:hidden font-bold text-[#0047AB] tracking-tighter">SEJAHE</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm font-medium text-slate-600">Admin Engineer</span>
            <div className="w-8 h-8 rounded-full border border-slate-200 bg-[#0047AB] flex items-center justify-center text-white text-[10px] font-bold">
              AE
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-50/30">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Technical Analysis</h2>
              <p className="text-xs lg:text-sm text-slate-400 font-medium">Session ID: <span className="text-slate-600">QC-9921-X-04</span> | 12:44 PM Local Time</p>
            </motion.div>

            <div className="space-y-6">
              {/* User Message */}
              <div className="flex justify-end">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-[85%] lg:max-w-[70%] bg-[#E0E7FF] text-[#0047AB] p-4 lg:p-6 rounded-2xl lg:rounded-3xl rounded-tr-none shadow-sm space-y-4"
                >
                  <p className="leading-relaxed text-sm lg:text-base">Halo, saya ingin menanyakan prosedur kalibrasi pada mesin T-Stress seri terbaru.</p>
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-900/10 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 lg:w-8 lg:h-8 opacity-50" />
                  </div>
                </motion.div>
              </div>

              {/* Bot Message */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">CHATBOT</span>
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-[85%] lg:max-w-[70%] bg-white border border-slate-100 p-4 lg:p-6 rounded-2xl lg:rounded-3xl rounded-tl-none shadow-sm"
                >
                  <p className="leading-relaxed text-sm lg:text-base text-slate-700">Tentu, ini adalah ringkasan langkah kalibrasi untuk mesin T-Stress v2.0. Pastikan sensor dalam posisi normal sebelum memulai.</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 lg:p-6 bg-white shrink-0 border-t border-slate-100 lg:border-none">
          <div className="max-w-4xl mx-auto relative">
            <div className="flex items-center gap-2 lg:gap-4 bg-slate-50 border border-slate-200 rounded-xl lg:rounded-2xl px-4 lg:px-6 py-3 lg:py-4 focus-within:ring-2 focus-within:ring-[#0047AB]/10 focus-within:bg-white transition-all">
              <Command className="hidden sm:block w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a command or follow-up question..." 
                className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400 text-sm lg:text-base"
              />
              <div className="flex items-center gap-2 lg:gap-3">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button 
                    disabled={!message.trim()}
                    className="bg-[#0047AB] text-white px-4 lg:px-6 py-2 rounded-lg lg:rounded-xl font-bold hover:bg-[#003d94] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 text-sm lg:text-base"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
