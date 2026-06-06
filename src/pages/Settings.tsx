import { useState, useEffect } from 'react';
import { 
  Menu, 
  ShieldCheck,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '../elements/Sidebar';

interface SettingsPageProps {
  onLogout: () => void;
  onNavigate: (page: 'chat' | 'admin' | 'settings') => void;
  userRole?: 'user' | 'admin';
}

export default function Settings({ onLogout, onNavigate, userRole = 'user' }: SettingsPageProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

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
        currentPage="settings"
        onNavigate={onNavigate}
        userRole={userRole}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800 shrink-0 sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-[10px] font-bold text-[#004aad] dark:text-blue-400 uppercase tracking-wider text-nowrap">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure LAN Connection
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900 dark:text-white">Settings</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{userRole === 'admin' ? 'Super User' : 'Employee Account'}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userRole}`} alt="avatar" />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-[800px] mx-auto w-full">
          <div className="flex flex-col gap-8">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
                Pengaturan
              </h1>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Sesuaikan preferensi tampilan aplikasi Anda.</p>
            </div>

            {/* Single Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-900/5 dark:shadow-none transition-all duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className={`p-4 rounded-2xl transition-colors duration-500 ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-[#004aad]'}`}>
                    {isDarkMode ? <Moon className="w-8 h-8" /> : <Sun className="w-8 h-8" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-1">Mode Tema</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-widest leading-none">Pilih antara mode terang atau gelap</p>
                  </div>
                </div>

                <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-[2rem] border border-gray-200 dark:border-gray-700 relative w-full md:w-auto overflow-hidden">
                  <motion.div 
                    layout
                    className="absolute inset-y-1.5 bg-white dark:bg-gray-700 rounded-[1.7rem] shadow-md z-0"
                    initial={false}
                    animate={{ 
                      left: isDarkMode ? '50%' : '6px',
                      right: isDarkMode ? '6px' : '50%'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  
                  <button 
                    onClick={() => setIsDarkMode(false)}
                    className={`flex-1 md:w-32 flex items-center justify-center gap-3 py-3 rounded-[1.7rem] text-sm font-black transition-colors relative z-10 ${
                      !isDarkMode ? 'text-[#004aad] dark:text-white' : 'text-gray-400'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    Terang
                  </button>
                  
                  <button 
                    onClick={() => setIsDarkMode(true)}
                    className={`flex-1 md:w-32 flex items-center justify-center gap-3 py-3 rounded-[1.7rem] text-sm font-black transition-colors relative z-10 ${
                      isDarkMode ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    Gelap
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}