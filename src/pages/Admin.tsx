import { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Filter,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '../elements/Sidebar';
import ActivityCard, { ActivityLog, ActivityDetail } from '../elements/ActivityCard';
import FilterModal from '../elements/FilterModal';
import ChatSummaryPanel from '../elements/ChatSummaryPanel';


interface AdminPageProps {
  onLogout: () => void;
  onNavigate: (page: 'chat' | 'admin' | 'settings') => void;
  userRole?: 'user' | 'admin';
}

interface ApiLog {
  id: number;
  action: string;
  userId: number;
  userName: string;
  createdTime: string;
}

function apiLogsToActivityLogs(apiLogs: ApiLog[]): ActivityLog[] {
  const byUser = new Map<number, ApiLog[]>();
  for (const log of apiLogs) {
    const existing = byUser.get(log.userId) ?? [];
    existing.push(log);
    byUser.set(log.userId, existing);
  }

  const result: ActivityLog[] = [];
  byUser.forEach((logs, userId) => {
    const sorted = [...logs].sort(
      (a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
    );
    const latest = sorted[0];
    const initials = latest.userName
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('');

    result.push({
      id: String(userId),
      name: latest.userName,
      employeeId: `ID: ${userId}`,
      chats: logs.filter((l) => l.action === 'CHAT' || l.action === 'MESSAGE').length,
      lastTime: new Date(latest.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      initials,
      details: sorted.slice(0, 10).map((l) => ({
        title: l.action,
        status: 'Logged',
        time: new Date(l.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })),
    });
  });

  return result;
}

export default function Admin({ onLogout, onNavigate, userRole = 'admin' }: AdminPageProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<ActivityDetail | null>(null);
  const [selectedTag, setSelectedTag] = useState('All');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);

  useEffect(() => {
    setLogsLoading(true);
    setLogsError(null);
    fetch('/api/v1/generate-report', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed with status ${r.status}`);
        return r.json();
      })
      .then((json) => {
        const apiLogs: ApiLog[] = Array.isArray(json?.data) ? json.data : [];
        setLogs(apiLogsToActivityLogs(apiLogs));
      })
      .catch((err) => {
        console.error('Failed to load activity logs:', err);
        setLogsError('Failed to load activity logs. Please try again.');
      })
      .finally(() => setLogsLoading(false));
  }, []);

  const tags = ['All', 'T-Stress', 'Alignment', 'Gasket', 'Pressure'];

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
        currentPage="admin"
        onNavigate={onNavigate}
        userRole={userRole}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[#f8fafc] dark:bg-gray-950 transition-colors duration-300">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white dark:bg-gray-900 border-b border-gray-50 dark:border-gray-800 shrink-0 sticky top-0 z-30 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-[10px] font-bold text-[#004aad] dark:text-blue-400 uppercase tracking-wider text-nowrap transition-colors duration-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure LAN Connection
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900 dark:text-white">Admin Panel</div>
              <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Super User</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="avatar" />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Log Aktivitas Karyawan
            </h1>
            
            <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl lg:justify-end">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Cari Karyawan..."
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all text-sm font-medium dark:text-gray-200"
                />
              </div>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-[#004aad] dark:bg-blue-600 text-white rounded-xl font-bold"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Grid Container */}
            <div className="flex-1">
              {logsLoading && (
                <div className="flex items-center justify-center py-20 text-gray-500 dark:text-gray-400 font-medium">
                  Loading activity logs...
                </div>
              )}
              {!logsLoading && logsError && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400 font-medium">
                  <span>{logsError}</span>
                  <button
                    type="button"
                    onClick={() => setLogsError(null)}
                    className="shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              )}
              {!logsLoading && !logsError && logs.length === 0 && (
                <div className="flex items-center justify-center py-20 text-gray-400 dark:text-gray-500 font-medium">
                  No activity logs found.
                </div>
              )}
              {!logsLoading && !logsError && logs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {logs.map((log) => (
                    <ActivityCard
                      key={log.id}
                      log={log}
                      onDetailClick={(detail) => setSelectedDetail(detail)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Filter Sidebar (Desktop) */}
            <aside className="hidden lg:block w-72 shrink-0 space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm sticky top-28 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-8">
                   <Filter className="w-5 h-5 text-gray-900 dark:text-gray-100" />
                   <h2 className="font-extrabold text-lg text-gray-900 dark:text-white tracking-tight">Filter Pencarian</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-4">Rentang Tanggal</label>
                    <div className="space-y-3">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="dd/mm/yyyy" className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold outline-none dark:text-gray-200" />
                      </div>
                      <div className="text-center text-[10px] font-bold text-gray-300 dark:text-gray-700">TO</div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="dd/mm/yyyy" className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold outline-none dark:text-gray-200" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block mb-4">Tipe Masalah</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <button 
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all ${
                            selectedTag === tag 
                              ? 'bg-[#004aad] dark:bg-blue-600 text-white shadow-lg shadow-blue-100 dark:shadow-none' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-[#004aad] dark:bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 dark:hover:bg-blue-500 transition-all mt-4">
                    Apply Filters
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Global Modals/Panels */}
        <FilterModal 
          isOpen={isFilterOpen} 
          onClose={() => setIsFilterOpen(false)} 
          tags={tags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
        />

        <ChatSummaryPanel 
          isOpen={!!selectedDetail}
          onClose={() => setSelectedDetail(null)}
          detail={selectedDetail}
        />
      </main>
    </div>
  );
}