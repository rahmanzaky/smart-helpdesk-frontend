import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, Bot } from 'lucide-react';
import type { UserInfo } from '../App';

interface Props {
  user: UserInfo;
  onPasswordChanged: (updatedUser: UserInfo) => void;
}

export default function ForceChangePassword({ user, onPasswordChanged }: Props) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Isi semua kolom');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Password baru tidak cocok');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password baru minimal 8 karakter');
      return;
    }
    if (newPassword === currentPassword) {
      setError('Password baru harus berbeda dari password sementara');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Gagal mengganti password');
        return;
      }
      onPasswordChanged({ ...user, mustChangePassword: false });
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9] dark:bg-gray-950 px-4">
      <div className="w-full max-w-[440px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        {/* Header */}
        <div className="bg-[#004aad] px-8 py-6">
          <div className="flex items-center gap-2 text-white mb-2">
            <Bot className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">SEJAHE</span>
          </div>
          <p className="text-blue-200 text-sm font-medium">PT. Indonesia Epson Industry</p>
        </div>

        <div className="px-8 py-8">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">Ganti Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Halo <strong>{user.name}</strong>! Anda wajib mengganti password sementara sebelum melanjutkan.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Password Sementara</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#004aad] text-sm font-medium dark:text-gray-200"
                  placeholder="Password sementara dari email"
                  required
                />
                <button type="button" onClick={() => setShowCurrent(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004aad] transition-colors">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#004aad] text-sm font-medium dark:text-gray-200"
                  placeholder="Min. 8 karakter"
                  required
                />
                <button type="button" onClick={() => setShowNew(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004aad] transition-colors">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Konfirmasi Password Baru</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showNew ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-[#004aad] text-sm font-medium dark:text-gray-200"
                  placeholder="Ulangi password baru"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#004aad] text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-60 mt-2"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan & Lanjutkan'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
