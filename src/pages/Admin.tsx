import { useState } from 'react';
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
  onNavigate: (page: 'chat' | 'admin') => void;
  userRole?: 'user' | 'admin';
}

const MOCK_LOGS: ActivityLog[] = [
  {
    id: '1',
    name: 'Nama Karyawan',
    employeeId: 'ID: XX-XXX',
    chats: 3,
    lastTime: '10:45',
    initials: 'NK',
    details: [
      { title: 'Title', status: 'Terselesaikan', time: '9:15' },
      { title: 'Title', status: 'Terselesaikan', time: '9:15' },
      { title: 'Title', status: 'Terselesaikan', time: '9:15' },
      { title: 'Title', status: 'Terselesaikan', time: '9:15' },
    ]
  },
  // Repeat for grid visualization
  ...Array(5).fill(null).map((_, i) => ({
    id: `${i + 2}`,
    name: 'Nama Karyawan',
    employeeId: 'ID: XX-XXX',
    chats: Math.floor(Math.random() * 5) + 1,
    lastTime: '10:45',
    initials: 'NK',
    details: [
      { title: 'Hardware Issue', status: 'Terselesaikan', time: '9:15' },
      { title: 'Software Update', status: 'Process', time: '11:20' },
    ]
  }))
];

export default function Admin({ onLogout, onNavigate, userRole = 'admin' }: AdminPageProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<ActivityDetail | null>(null);
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = ['All', 'T-Stress', 'Alignment', 'Gasket', 'Pressure'];

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
        currentPage="admin"
        onNavigate={onNavigate}
        userRole={userRole}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-6 lg:px-10 bg-white border-b border-gray-50 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-[10px] font-bold text-[#004aad] uppercase tracking-wider text-nowrap">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secure LAN Connection
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900">Admin Panel</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Super User</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" alt="avatar" />
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* Dashboard Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Log Aktivitas Karyawan
            </h1>
            
            <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl lg:justify-end">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Cari Karyawan..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all text-sm font-medium"
                />
              </div>
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-[#004aad] text-white rounded-xl font-bold"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Grid Container */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_LOGS.map((log) => (
                  <ActivityCard 
                    key={log.id} 
                    log={log} 
                    onDetailClick={(detail) => setSelectedDetail(detail)}
                  />
                ))}
              </div>
            </div>

            {/* Filter Sidebar (Desktop) */}
            <aside className="hidden lg:block w-72 shrink-0 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
                <div className="flex items-center gap-2 mb-8">
                   <Filter className="w-5 h-5 text-gray-900" />
                   <h2 className="font-extrabold text-lg text-gray-900 tracking-tight">Filter Pencarian</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Rentang Tanggal</label>
                    <div className="space-y-3">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="dd/mm/yyyy" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none" />
                      </div>
                      <div className="text-center text-[10px] font-bold text-gray-300">TO</div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="dd/mm/yyyy" className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Tipe Masalah</label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <button 
                          key={tag}
                          onClick={() => setSelectedTag(tag)}
                          className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all ${
                            selectedTag === tag 
                              ? 'bg-[#004aad] text-white shadow-lg shadow-blue-100' 
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="w-full bg-[#004aad] text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all mt-4">
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
