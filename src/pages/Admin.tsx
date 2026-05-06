import React, { useState } from 'react';
import { 
    ClipboardList, 
    Settings, 
    ShieldCheck, 
    Menu, 
    X, 
    Search, 
    Filter, 
    ChevronRight, 
    Sparkles, 
    FileText, 
    Image as ImageIcon,
    Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';

const Admin: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleFilterModal = () => setIsFilterModalOpen(!isFilterModalOpen);
  const openSummary = () => setIsSummaryOpen(true);
  const closeSummary = () => setIsSummaryOpen(false);

  const employees = [
    { id: 'NK-001', name: 'Nama Karyawan', initials: 'NK', count: 3, time: '10:45' },
    { id: 'AS-042', name: 'Ahmad Saputra', initials: 'AS', count: 5, time: '11:20' },
    { id: 'JD-089', name: 'John Doe', initials: 'JD', count: 2, time: '09:15' },
  ];

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
            <ClipboardList className="w-5 h-5" />
            Log Aktivitas
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
                    System Status
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
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
            <span className="hidden sm:inline text-sm font-medium text-slate-600">Super Admin</span>
            <div className="w-8 h-8 rounded-full bg-[#0047AB] text-white flex items-center justify-center text-[10px] font-bold">SA</div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Activity Logs */}
          <div className="flex-1 flex flex-col p-4 lg:p-8 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4">
              <h1 className="text-2xl lg:text-4xl font-bold text-slate-900">Log Aktivitas Karyawan</h1>
              <div className="flex items-center gap-2">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari Karyawan..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0047AB]/10 transition-all text-sm"
                  />
                </div>
                <button onClick={toggleFilterModal} className="lg:hidden p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Employee Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {employees.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase())).map((emp) => (
                  <motion.div 
                    key={emp.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-100 rounded-2xl lg:rounded-3xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4 lg:mb-6">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#E0E7FF] text-[#0047AB] rounded-full flex items-center justify-center font-bold text-sm lg:text-base">
                          {emp.initials}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm lg:text-lg">{emp.name}</h3>
                          <p className="text-[10px] lg:text-xs text-slate-400 font-medium">ID: {emp.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs lg:text-sm font-bold text-[#0047AB]">{emp.count} Chats</p>
                        <p className="text-[8px] lg:text-[10px] text-slate-400 font-medium uppercase tracking-wider text-nowrap">Today • {emp.time}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button onClick={openSummary} className="w-full flex items-center justify-between p-3 lg:p-4 bg-slate-50 rounded-xl lg:rounded-2xl hover:bg-[#E0E7FF] transition-colors group/item">
                        <div className="text-left">
                          <p className="font-bold text-xs lg:text-sm group-hover/item:text-[#0047AB]">Technical Analysis</p>
                          <p className="text-[10px] lg:text-xs text-slate-400">Terselesaikan 9:15</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-[#0047AB]" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Filter Panel (Desktop) */}
          <aside className="hidden lg:block w-80 bg-white border-l border-slate-200 p-8 shrink-0 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-8">
              <Filter className="w-5 h-5 text-[#0047AB]" />
              <h2 className="text-xl font-bold">Filter Pencarian</h2>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rentang Tanggal</p>
                <div className="space-y-3">
                  <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0047AB]/10" />
                  <p className="text-center text-[10px] text-slate-300 font-bold">TO</p>
                  <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0047AB]/10" />
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipe Masalah</p>
                <div className="flex flex-wrap gap-2">
                  <button className="px-4 py-2 bg-[#0047AB] text-white rounded-full text-xs font-bold">All</button>
                  <button className="px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-100">T-Stress</button>
                  <button className="px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-xs font-bold hover:bg-slate-100">Alignment</button>
                </div>
              </div>

              <button className="w-full py-4 bg-[#0047AB] text-white rounded-2xl font-bold shadow-lg shadow-[#0047AB]/20 hover:bg-[#003d94] transition-all transform active:scale-95">
                Apply Filters
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex items-end">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={toggleFilterModal}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="relative bg-white w-full rounded-t-[32px] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Filter Pencarian</h2>
                <button onClick={toggleFilterModal} className="p-2 hover:bg-slate-100 rounded-full">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rentang Tanggal</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
                    <input type="date" className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm" />
                  </div>
                </div>
                <button 
                  onClick={toggleFilterModal}
                  className="w-full py-4 bg-[#0047AB] text-white rounded-2xl font-bold"
                >
                    Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Summary AI */}
      <AnimatePresence>
        {isSummaryOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSummary}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-6 lg:p-10 space-y-6 lg:space-y-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">Technical Analysis</h2>
                    <p className="text-[10px] lg:text-sm text-slate-400 font-medium uppercase tracking-wider">QC-9921-X-04 • 12:44 PM</p>
                  </div>
                  <button onClick={closeSummary} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0047AB] rounded-full w-fit">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">AI Generated Summary</span>
                  </div>
                  <div className="bg-slate-50 p-6 lg:p-8 rounded-[24px] lg:rounded-[32px] border border-slate-100">
                    <p className="text-sm lg:text-base text-slate-600 leading-relaxed italic">
                      "Karyawan menanyakan tentang prosedur kalibrasi pada mesin T-Stress seri terbaru. AI memberikan panduan langkah-demi-langkah sesuai SOP manual teknis. Masalah terselesaikan dengan konfirmasi keberhasilan dari karyawan."
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Attachments</p>
                    <div className="flex gap-3">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-300" />
                        </div>
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-slate-300" />
                        </div>
                    </div>
                </div>

                <button onClick={closeSummary} className="w-full py-4 lg:py-5 bg-slate-900 text-white rounded-full font-bold text-base lg:text-lg hover:bg-slate-800 transition-all">
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
