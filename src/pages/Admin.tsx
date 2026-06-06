import { useState, useEffect, useCallback } from 'react';
import {
  Menu,
  Search,
  Filter,
  ShieldCheck,
  Calendar,
  Send,
  Sparkles,
  MessageSquare,
  Users,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from '../elements/Sidebar';
import ActivityCard, { ActivityLog, ActivityDetail } from '../elements/ActivityCard';
import FilterModal from '../elements/FilterModal';
import ChatSummaryPanel, { AdminChat } from '../elements/ChatSummaryPanel';


interface AdminPageProps {
  onLogout: () => void;
  onNavigate: (page: 'chat' | 'admin' | 'settings') => void;
  userRole?: 'user' | 'admin';
  currentUserId?: number;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdTime: string;
  mustChangePassword: boolean;
}

interface ApiLog {
  id: number;
  action: string;
  userId: number;
  userName: string;
  createdTime: string;
}

interface Summary {
  total: number;
  byAction: Record<string, number>;
  byUser: { userId: number; userName: string; count: number }[];
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
        date: new Date(l.createdTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        time: new Date(l.createdTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      })),
    });
  });

  return result;
}

export default function Admin({ onLogout, onNavigate, userRole = 'admin', currentUserId }: AdminPageProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<ActivityDetail | null>(null);
  const [selectedTag, setSelectedTag] = useState('All');
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);

  // Date range filter state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Send report state
  const [isSending, setIsSending] = useState(false);
  const [sendMessage, setSendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Chat sessions for summary panel
  const [allChats, setAllChats] = useState<AdminChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<AdminChat | null>(null);
  const [activeTab, setActiveTab] = useState<'activity' | 'chats' | 'users'>('activity');

  // User management state
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ email: '', name: '', role: 'employee' as 'employee' | 'admin' });
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [userToast, setUserToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchLogs = useCallback((start?: string, end?: string) => {
    setLogsLoading(true);
    setLogsError(null);

    let url = '/api/v1/generate-report';
    const params = new URLSearchParams();
    if (start) params.set('s', start);
    if (end) params.set('e', end);
    const qs = params.toString();
    if (qs) url += `?${qs}`;

    fetch(url, { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error(`Request failed with status ${r.status}`);
        return r.json();
      })
      .then((json) => {
        const apiLogs: ApiLog[] = Array.isArray(json?.data?.logs) ? json.data.logs : [];
        setLogs(apiLogsToActivityLogs(apiLogs));
        if (json?.data?.summary) {
          setSummary(json.data.summary);
        }
      })
      .catch((err) => {
        console.error('Failed to load activity logs:', err);
        setLogsError('Failed to load activity logs. Please try again.');
      })
      .finally(() => setLogsLoading(false));
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetch('/api/v1/chat/admin/chats', { credentials: 'include' })
      .then(r => r.json())
      .then(json => { if (json.data) setAllChats(json.data); })
      .catch(err => console.error('Failed to load admin chats:', err));
  }, []);

  const fetchUsers = useCallback(() => {
    setUsersLoading(true);
    setUsersError(null);
    fetch('/api/v1/admin/users', { credentials: 'include' })
      .then(r => {
        if (!r.ok) throw new Error(`Request failed with status ${r.status}`);
        return r.json();
      })
      .then(json => {
        if (Array.isArray(json?.data)) setAdminUsers(json.data);
      })
      .catch(err => {
        console.error('Failed to load users:', err);
        setUsersError('Gagal memuat daftar pengguna.');
      })
      .finally(() => setUsersLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchUsers]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddUserLoading(true);
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserForm),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? `Error ${res.status}`);
      setAdminUsers(prev => [...prev, json.data]);
      setIsAddUserModalOpen(false);
      setNewUserForm({ email: '', name: '', role: 'employee' });
      setUserToast({ type: 'success', text: 'Akun berhasil dibuat! Email selamat datang telah dikirim.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal membuat akun.';
      setUserToast({ type: 'error', text: message });
    } finally {
      setAddUserLoading(false);
      setTimeout(() => setUserToast(null), 4000);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Yakin ingin menghapus pengguna ini?')) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error ?? `Error ${res.status}`);
      }
      setAdminUsers(prev => prev.filter(u => u.id !== id));
      setUserToast({ type: 'success', text: 'Pengguna berhasil dihapus.' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal menghapus pengguna.';
      setUserToast({ type: 'error', text: message });
    } finally {
      setTimeout(() => setUserToast(null), 4000);
    }
  };

  const handleApplyFilters = () => {
    fetchLogs(startDate || undefined, endDate || undefined);
  };

  const handleSendReport = async () => {
    setIsSending(true);
    setSendMessage(null);
    try {
      const res = await fetch('/api/v1/generate-report', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(startDate ? { start: startDate } : {}),
          ...(endDate ? { end: endDate } : {}),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message ?? `Error ${res.status}`);
      setSendMessage({ type: 'success', text: 'Laporan berhasil dikirim!' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim laporan.';
      setSendMessage({ type: 'error', text: message });
    } finally {
      setIsSending(false);
      setTimeout(() => setSendMessage(null), 4000);
    }
  };

  // Client-side search filter
  const filteredLogs = searchQuery.trim()
    ? logs.filter((log) => log.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : logs;

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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Log Aktivitas Karyawan
            </h1>

            <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl lg:justify-end">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Cari Karyawan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all text-sm font-medium dark:text-gray-200"
                />
              </div>
              <button
                onClick={handleSendReport}
                disabled={isSending}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#004aad] dark:bg-blue-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Send report feedback */}
          {sendMessage && (
            <div className={`mb-6 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-medium border ${
              sendMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
            }`}>
              <span>{sendMessage.text}</span>
              <button
                type="button"
                onClick={() => setSendMessage(null)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'activity'
                  ? 'bg-[#004aad] dark:bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
            >
              <Filter className="w-4 h-4" />
              Log Aktivitas
            </button>
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'chats'
                  ? 'bg-[#004aad] dark:bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Ringkasan Chat
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'users'
                  ? 'bg-[#004aad] dark:bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800'
              }`}
            >
              <Users className="w-4 h-4" />
              Kelola Pengguna
            </button>
          </div>

          {/* Summary Stats Bar */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total Aktivitas', value: summary.total },
                { label: 'Total Chat', value: (summary.byAction['CHAT'] ?? 0) + (summary.byAction['MESSAGE'] ?? 0) },
                { label: 'Total Login', value: summary.byAction['LOGIN'] ?? 0 },
                { label: 'Total Users', value: summary.byUser.length },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white dark:bg-gray-900 rounded-2xl px-6 py-5 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col gap-1"
                >
                  <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{stat.value}</span>
                  <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Grid Container */}
            <div className="flex-1">
              {activeTab === 'activity' && (
                <>
                  {logsLoading && (
                    <div className="flex items-center justify-center py-20 text-gray-500 dark:text-gray-400 font-medium">
                      Loading activity logs...
                    </div>
                  )}
                  {!logsLoading && logsError && (
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-sm text-red-600 dark:text-red-400 font-medium">
                      <span>{logsError}</span>
                      <button type="button" onClick={() => setLogsError(null)} className="shrink-0 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors">✕</button>
                    </div>
                  )}
                  {!logsLoading && !logsError && filteredLogs.length === 0 && (
                    <div className="flex items-center justify-center py-20 text-gray-400 dark:text-gray-500 font-medium">
                      {searchQuery.trim() ? 'Tidak ada karyawan yang cocok.' : 'No activity logs found.'}
                    </div>
                  )}
                  {!logsLoading && !logsError && filteredLogs.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredLogs.map((log) => (
                        <ActivityCard key={log.id} log={log} onDetailClick={(detail) => setSelectedDetail(detail)} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'users' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      {adminUsers.length} pengguna terdaftar
                    </p>
                    <button
                      onClick={() => setIsAddUserModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#004aad] dark:bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      Tambah Pengguna
                    </button>
                  </div>

                  {userToast && (
                    <div className={`mb-4 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-medium border ${
                      userToast.type === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                    }`}>
                      <span>{userToast.text}</span>
                      <button onClick={() => setUserToast(null)} className="shrink-0 opacity-60 hover:opacity-100">✕</button>
                    </div>
                  )}

                  {usersLoading && <div className="py-20 text-center text-gray-400 font-medium">Memuat pengguna...</div>}
                  {!usersLoading && usersError && <div className="py-8 text-center text-red-500 font-medium">{usersError}</div>}
                  {!usersLoading && !usersError && (
                    <div className="space-y-3">
                      {adminUsers.map(u => (
                        <div key={u.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#004aad] dark:text-blue-400 font-extrabold text-sm shrink-0">
                            {u.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-gray-900 dark:text-white">{u.name}</p>
                              {u.mustChangePassword && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 uppercase tracking-wider">Ganti Password</span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">{u.email}</p>
                          </div>
                          <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                              : 'bg-blue-50 dark:bg-blue-900/20 text-[#004aad] dark:text-blue-400'
                          }`}>
                            {u.role}
                          </span>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="shrink-0 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'chats' && (
                <div className="space-y-3">
                  {allChats.length === 0 && (
                    <div className="flex items-center justify-center py-20 text-gray-400 dark:text-gray-500 font-medium">
                      Belum ada sesi chat.
                    </div>
                  )}
                  {allChats
                    .filter(c => !searchQuery.trim() || c.authorName.toLowerCase().includes(searchQuery.trim().toLowerCase()) || c.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                    .map(chat => {
                      const hasSummary = !!chat.summary;
                      let category: string | null = null;
                      if (hasSummary) {
                        try { category = JSON.parse(chat.summary!).category; } catch {}
                      }
                      return (
                        <motion.div
                          key={chat.id}
                          layout
                          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4 hover:shadow-md transition-all"
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-[#004aad] dark:text-blue-400 font-extrabold text-sm shrink-0">
                            {chat.authorName.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{chat.title}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                              {chat.authorName} · {new Date(chat.createdTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          {category && (
                            <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-900/20 text-[#004aad] dark:text-blue-400 uppercase tracking-wider">
                              {category}
                            </span>
                          )}
                          <button
                            onClick={() => setSelectedChat(chat)}
                            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-[#004aad] dark:bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            {hasSummary ? 'Lihat Analisis' : 'Analisis'}
                          </button>
                        </motion.div>
                      );
                    })}
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
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold outline-none dark:text-gray-200"
                        />
                      </div>
                      <div className="text-center text-[10px] font-bold text-gray-300 dark:text-gray-700">TO</div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-xs font-bold outline-none dark:text-gray-200"
                        />
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

                  <button
                    onClick={handleApplyFilters}
                    className="w-full bg-[#004aad] dark:bg-blue-600 text-white py-4 rounded-xl font-bold text-sm shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 dark:hover:bg-blue-500 transition-all mt-4"
                  >
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
          startDate={startDate}
          endDate={endDate}
          onApply={(start, end) => {
            setStartDate(start);
            setEndDate(end);
            fetchLogs(start || undefined, end || undefined);
          }}
        />

        {/* Add User Modal */}
        <AnimatePresence>
          {isAddUserModalOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setIsAddUserModalOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
              <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="pointer-events-auto w-full max-w-[480px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                  <div className="px-8 pt-8 pb-5 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Tambah Pengguna</h2>
                    <button onClick={() => setIsAddUserModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleAddUser} className="px-8 py-6 space-y-5">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Nama</label>
                      <input type="text" required value={newUserForm.name} onChange={e => setNewUserForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Nama lengkap"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#004aad] text-sm font-medium dark:text-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Email</label>
                      <input type="email" required value={newUserForm.email} onChange={e => setNewUserForm(p => ({ ...p, email: e.target.value.toLowerCase() }))}
                        placeholder="email@epson.com"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#004aad] text-sm font-medium dark:text-gray-200" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Role</label>
                      <select value={newUserForm.role} onChange={e => setNewUserForm(p => ({ ...p, role: e.target.value as 'employee' | 'admin' }))}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#004aad] text-sm font-bold dark:text-gray-200">
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Password sementara akan dikirim otomatis ke email. Pengguna wajib menggantinya saat login pertama.</p>
                    <button type="submit" disabled={addUserLoading}
                      className="w-full bg-[#004aad] dark:bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60">
                      {addUserLoading ? 'Membuat akun...' : 'Buat Akun & Kirim Email'}
                    </button>
                  </form>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>

        <ChatSummaryPanel
          isOpen={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          chat={selectedChat}
          onSummaryGenerated={(chatId, summaryStr) => {
            setAllChats(prev => prev.map(c => c.id === chatId ? { ...c, summary: summaryStr } : c));
            setSelectedChat(prev => prev?.id === chatId ? { ...prev, summary: summaryStr } : prev);
          }}
        />
      </main>
    </div>
  );
}
