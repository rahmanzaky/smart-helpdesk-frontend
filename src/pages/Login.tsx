import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Bot, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { UserInfo } from '../App';

type View = 'login' | 'forgot' | 'reset';

interface LoginPageProps {
  onLogin: (user: UserInfo) => void;
  initialView?: View;
  resetToken?: string;
  resetUserId?: number;
}

export default function Login({ onLogin, initialView = 'login', resetToken, resetUserId }: LoginPageProps) {
  const [view, setView] = useState<View>(initialView);

  // Login state
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Reset state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.toLowerCase().trim(), password }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Login failed'); return; }
      onLogin(json.data);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!forgotEmail) { setError('Masukkan email Anda'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.toLowerCase().trim() }),
      });
      const json = await res.json();
      if (res.status === 429) { setError(json.error); return; }
      setForgotSent(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) { setError('Isi semua kolom'); return; }
    if (newPassword !== confirmPassword) { setError('Password tidak cocok'); return; }
    if (newPassword.length < 8) { setError('Password minimal 8 karakter'); return; }
    if (!resetToken || !resetUserId) { setError('Link reset tidak valid'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: resetUserId, token: resetToken, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) { setError(json.error || 'Gagal reset password'); return; }
      setResetDone(true);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchView = (v: View) => { setError(''); setView(v); };

  const handleSubmit = view === 'login' ? handleLogin : view === 'forgot' ? handleForgot : handleReset;

  return (
    <div className="min-h-screen flex font-sans bg-white text-gray-900 dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Left Panel - Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#004aad] dark:bg-slate-900 overflow-hidden items-center justify-center">
        {/* Background Overlay with Image/Pattern simulation */}
        <div 
          className="absolute inset-0 opacity-20 bg-center bg-cover mix-blend-overlay dark:opacity-40"
          style={{ backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSkXtNsJ_HKg5Yr0nZ16warM5X3g9nRaoGmQ&s")' }}
        />
        
        <div className="relative z-10 w-full max-w-xl px-12 py-20 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 text-white mb-12">
              <Bot className="w-8 h-8" />
              <span className="text-2xl font-bold tracking-tight">SEJAHE</span>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                SEJAHE
              </h1>
              <p className="text-xl text-blue-100 max-w-md leading-relaxed">
                Smart Helpdesk Chatbot Berbasis Retrieval-Augmented Generation (RAG) untuk Optimalisasi Layanan TI di PT. Indonesia Epson Industry
              </p>
            </motion.div>
          </div>

          <div className="flex items-end gap-16">
            <div>
              <div className="text-4xl font-bold text-white">99.9%</div>
              <div className="text-blue-200 text-xs font-semibold tracking-widest uppercase mt-1">
                Precision Rating
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white">Real-time</div>
              <div className="text-blue-200 text-xs font-semibold tracking-widest uppercase mt-1">
                Log Analysis
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative dark:bg-gray-950 transition-colors duration-300">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden absolute top-12 left-12">
          <div className="text-[#004aad] dark:text-blue-400 font-bold text-3xl tracking-tight">SEJAHE</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm mt-1">Chatbot Pemantau</div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
              {view === 'login' ? 'Login' : view === 'forgot' ? 'Lupa Sandi' : 'Reset Password'}
            </h2>
            {view === 'login' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-full text-[10px] sm:text-xs font-bold text-red-700 dark:text-red-400 tracking-wider uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>Internal Network Only</span>
              </div>
            )}
            {view === 'forgot' && !forgotSent && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Masukkan email Anda dan kami akan mengirimkan link untuk reset password.</p>
            )}
            {view === 'reset' && !resetDone && (
              <p className="text-sm text-gray-500 dark:text-gray-400">Buat password baru untuk akun Anda.</p>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {view === 'login' && <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">Corporate Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#004aad] dark:group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-[#004aad] dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-gray-800 dark:text-white dark:focus:text-gray-800 placeholder-gray-400 font-medium"
                  placeholder="engineer@epson.com"
                  required
                />
              </div>
            </div>}

            {/* ── LOGIN view ── */}
            {view === 'login' && (<>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#004aad] dark:group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-[#004aad] dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-gray-800 dark:text-white dark:focus:text-gray-800 placeholder-gray-400 font-medium"
                    placeholder="••••••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#004aad] dark:hover:text-blue-400 transition-colors">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => switchView('forgot')} className="text-sm font-bold text-[#004aad] dark:text-blue-400 hover:underline transition-all">
                  Lupa Sandi?
                </button>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-[#004aad] dark:bg-blue-600 text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 dark:hover:bg-blue-500 active:scale-[0.98] transition-colors shadow-xl shadow-blue-200 dark:shadow-none disabled:opacity-60 disabled:cursor-not-allowed">
                {isLoading ? 'Signing in...' : 'Sign In'}
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </button>
            </>)}

            {/* ── FORGOT view ── */}
            {view === 'forgot' && (<>
              {forgotSent ? (
                <div className="flex flex-col items-center gap-4 py-6">
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                  <div className="text-center">
                    <p className="font-bold text-gray-800 dark:text-white text-lg mb-1">Email Terkirim!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cek inbox <strong>{forgotEmail}</strong> dan klik link untuk reset password. Link berlaku 15 menit.</p>
                  </div>
                  <button type="button" onClick={() => switchView('login')} className="flex items-center gap-2 text-sm font-bold text-[#004aad] dark:text-blue-400 hover:underline mt-2">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Login
                  </button>
                </div>
              ) : (<>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#004aad] transition-colors" />
                    </div>
                    <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value.toLowerCase())}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-[#004aad] focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-gray-800 dark:text-white placeholder-gray-400 font-medium"
                      placeholder="engineer@epson.com" required />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-[#004aad] dark:bg-blue-600 text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-colors shadow-xl shadow-blue-200 dark:shadow-none disabled:opacity-60">
                  {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                  {!isLoading && <ArrowRight className="h-5 w-5" />}
                </button>
                <button type="button" onClick={() => switchView('login')} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-[#004aad] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Kembali ke Login
                </button>
              </>)}
            </>)}

            {/* ── RESET view ── */}
            {view === 'reset' && (<>
              {resetDone ? (
                <div className="flex flex-col items-center gap-4 py-6">
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                  <div className="text-center">
                    <p className="font-bold text-gray-800 dark:text-white text-lg mb-1">Password Berhasil Diubah!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Silakan login dengan password baru Anda.</p>
                  </div>
                  <button type="button" onClick={() => switchView('login')} className="flex items-center gap-2 text-sm font-bold text-[#004aad] dark:text-blue-400 hover:underline mt-2">
                    <ArrowLeft className="w-4 h-4" /> Login Sekarang
                  </button>
                </div>
              ) : (<>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">Password Baru</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#004aad] transition-colors" />
                    </div>
                    <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      className="block w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-[#004aad] focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-gray-800 dark:text-white placeholder-gray-400 font-medium"
                      placeholder="Min. 8 karakter" required />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#004aad] transition-colors">
                      {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 ml-1">Konfirmasi Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#004aad] transition-colors" />
                    </div>
                    <input type={showNew ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-[#004aad] focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-gray-800 dark:text-white placeholder-gray-400 font-medium"
                      placeholder="Ulangi password baru" required />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-[#004aad] dark:bg-blue-600 text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-colors shadow-xl shadow-blue-200 dark:shadow-none disabled:opacity-60">
                  {isLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
                  {!isLoading && <ArrowRight className="h-5 w-5" />}
                </button>
              </>)}
            </>)}
          </form>

          <p className="mt-20 text-center text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-[280px] mx-auto">
            Dengan Login, Anda mengakui bahwa semua aktivitas anda dipantau.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
