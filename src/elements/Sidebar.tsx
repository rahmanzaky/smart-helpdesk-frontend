import {
  MessageSquare,
  Settings,
  LogOut,
  CheckCircle2,
  HelpCircle,
  Bot,
  X,
  History,
  Plus,
  Trash2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface ChatSession {
  id: number;
  title: string;
  createdTime: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  currentPage: 'chat' | 'admin' | 'settings';
  onNavigate: (page: 'chat' | 'admin' | 'settings') => void;
  userRole?: 'user' | 'admin';
  chats?: ChatSession[];
  activeChatId?: number | null;
  onSelectChat?: (id: number) => void;
  onNewChat?: () => void;
  onDeleteChat?: (id: number) => void;
}

export default function Sidebar({ isOpen, onClose, onLogout, currentPage, onNavigate, userRole = 'user', chats = [], activeChatId, onSelectChat, onNewChat, onDeleteChat }: SidebarProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const checkScreenSize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <motion.aside
      initial={false}
      animate={{ x: isLargeScreen ? 0 : (isOpen ? 0 : -300) }}
      transition={isLargeScreen ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed lg:relative lg:translate-x-0 w-[280px] h-full bg-white border-r border-gray-100 flex flex-col z-50 dark:bg-gray-900 dark:border-gray-800`}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#004aad] dark:text-blue-400">
          <Bot className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight">SEJAHE</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-hidden">
        {userRole === 'user' && (
          <>
            <button
              onClick={onNewChat}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-[#004aad] hover:bg-[#003a8c] transition-all mb-1"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>

            {chats.length > 0 && (
              <div className="flex-1 overflow-y-auto space-y-0.5 min-h-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 py-1">Riwayat Chat</p>
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    className={`group flex items-center rounded-xl transition-all ${
                      activeChatId === chat.id
                        ? 'bg-blue-50 text-[#004aad] dark:bg-blue-900/20 dark:text-blue-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                    }`}
                  >
                    <button
                      onClick={() => onSelectChat?.(chat.id)}
                      className="flex-1 text-left px-3 py-2.5 min-w-0"
                    >
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(chat.createdTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); onDeleteChat?.(chat.id); }}
                      className="opacity-0 group-hover:opacity-100 p-2 mr-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('chat')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all mt-1 ${
                currentPage === 'chat'
                  ? 'bg-blue-50 text-[#004aad] border-r-4 border-[#004aad] dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Chat
            </button>
          </>
        )}
        {userRole === 'admin' && (
          <button
            onClick={() => onNavigate('admin')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all ${
              currentPage === 'admin'
                ? 'bg-blue-50 text-[#004aad] border-r-4 border-[#004aad] dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400'
                : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            <History className="w-5 h-5" />
            Log Aktivitas
          </button>
        )}
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all ${
            currentPage === 'settings'
              ? 'bg-blue-50 text-[#004aad] border-r-4 border-[#004aad] dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
          }`}
        >
          <Settings className="w-5 h-5" />
          Pengaturan
        </button>
      </nav>

      <div className="p-6 border-t border-gray-50 dark:border-gray-800 space-y-4">
        <button 
          onClick={onLogout}
          className="w-full py-4 border border-red-200 dark:border-red-900/30 text-red-500 rounded-full font-bold hover:bg-red-50  dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>
        
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            System Status
          </div>
          <div className="flex items-center gap-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            <HelpCircle className="w-4 h-4" />
            <a href="https://epson.com/Support/sl/s">Help</a>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
