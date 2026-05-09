import { 
  MessageSquare, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  HelpCircle, 
  Bot,
  X,
  History
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  currentPage: 'chat' | 'admin';
  onNavigate: (page: 'chat' | 'admin') => void;
  userRole?: 'user' | 'admin';
}

export default function Sidebar({ isOpen, onClose, onLogout, currentPage, onNavigate, userRole = 'user' }: SidebarProps) {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <motion.aside
      initial={false}
      animate={{ x: isLargeScreen ? 0 : (isOpen ? 0 : -300) }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className={`fixed lg:relative lg:translate-x-0 w-[280px] h-full bg-white border-r border-gray-100 flex flex-col z-50`}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#004aad]">
          <Bot className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight">SEJAHE</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-gray-400">
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <button 
          onClick={() => onNavigate('chat')}
          className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all ${
            currentPage === 'chat' 
              ? 'bg-blue-50 text-[#004aad] border-r-4 border-[#004aad]' 
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Chat
        </button>
        {userRole === 'admin' && (
          <button 
            onClick={() => onNavigate('admin')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all ${
              currentPage === 'admin' 
                ? 'bg-blue-50 text-[#004aad] border-r-4 border-[#004aad]' 
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <History className="w-5 h-5" />
            Log Aktivitas
          </button>
        )}
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
  );
}
