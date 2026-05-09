import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

export default function Login({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex font-sans bg-white text-gray-900">
      {/* Left Panel - Branding (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#004aad] overflow-hidden items-center justify-center">
        {/* Background Overlay with Image/Pattern simulation */}
        <div 
          className="absolute inset-0 opacity-20 bg-center bg-cover mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop")' }}
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
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="lg:hidden absolute top-12 left-12">
          <div className="text-[#004aad] font-bold text-3xl tracking-tight">SEJAHE</div>
          <div className="text-gray-500 text-sm mt-1">Chatbot Pemantau</div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Login</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-[10px] sm:text-xs font-bold text-red-700 tracking-wider uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>Internal Network Only</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Corporate Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#004aad] transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#004aad] focus:bg-white transition-all outline-none text-gray-800 placeholder-gray-400 font-medium"
                  placeholder="engineer@epson.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-[#004aad] transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#004aad] focus:bg-white transition-all outline-none text-gray-800 placeholder-gray-400 font-medium trackers-widest"
                  placeholder="••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#004aad] transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm font-bold text-[#004aad] hover:underline transition-all">
                Lupa Sandi?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#004aad] text-white py-5 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200"
            >
              Sign In
              <ArrowRight className="h-5 w-5 font-bold" />
            </button>
          </form>

          <p className="mt-20 text-center text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto">
            Dengan Login, Anda mengakui bahwa semua aktivitas anda dipantau.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
