import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Bot, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    if (email && password) {
        navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden bg-white text-slate-900 antialiased">
      {/* Left Side: Branding (Hidden on mobile) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-[40%] bg-[#0047AB] relative flex-col justify-between p-16 text-white shrink-0"
      >
        {/* Background Image Overlay */}
        <div 
          className="absolute inset-0 opacity-15 mix-blend-overlay bg-cover bg-center"
          style={{ backgroundImage: "url('https://picsum.photos/seed/epson/1920/1080')" }}
        />
        
        <div className="relative z-10 flex items-center gap-2">
          <Bot className="w-8 h-8" />
          <span className="text-2xl font-bold tracking-tighter">SEJAHE</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-6xl font-bold leading-tight">SEJAHE</h1>
          <p className="text-xl text-blue-100 max-w-md leading-relaxed">
            Smart Helpdesk Chatbot Berbasis Retrieval-Augmented Generation (RAG) untuk Optimalisasi Layanan TI di PT. Indonesia Epson Industry
          </p>
        </div>

        <div className="relative z-10 flex gap-12">
          <div>
            <p className="text-4xl font-bold">99.9%</p>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Precision Rating</p>
          </div>
          <div>
            <p className="text-4xl font-bold">Real-time</p>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Log Analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Mobile Header */}
      <div className="lg:hidden w-full bg-[#0047AB] p-8 text-white flex flex-col items-center text-center space-y-4">
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2"
        >
          <Bot className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tighter">SEJAHE</span>
        </motion.div>
        <h1 className="text-3xl font-bold">SEJAHE</h1>
        <p className="text-sm text-blue-100 max-w-xs">Smart Helpdesk Chatbot Berbasis RAG untuk PT. Indonesia Epson Industry</p>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white lg:min-h-screen">
        <motion.div 
            id="login-form-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md space-y-8 lg:space-y-10"
        >
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Login</h2>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF1F2] text-[#E11D48] rounded-full text-[10px] font-bold uppercase tracking-wider">
              <AlertCircle className="w-3 h-3" />
              INTERNAL NETWORK ONLY
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Corporate Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0047AB] transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="engineer@epson.com" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0047AB]/20 focus:bg-white transition-all outline-none text-lg"
                    required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0047AB] transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••" 
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-[#0047AB]/20 focus:bg-white transition-all outline-none text-lg"
                    required
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-[#0047AB] text-sm font-bold hover:underline">Lupa Sandi?</a>
            </div>

            <motion.button 
                whileHover={{ scale: 1.01, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full py-5 bg-[#0047AB] text-white rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-[0_20px_40px_-15px_rgba(0,71,171,0.2)] hover:bg-[#003d94] transition-all mt-4 lg:mt-8"
            >
              Sign In
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </form>

          <p className="text-center text-slate-400 text-sm leading-relaxed max-w-xs mx-auto pt-8">
            Dengan Login, Anda mengakui bahwa semua aktivitas anda dipantau.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
