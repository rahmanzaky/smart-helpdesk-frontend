import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import ForceChangePassword from './components/ForceChangePassword';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  mustChangePassword?: boolean;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [currentPage, setCurrentPage] = useState<'chat' | 'admin' | 'settings'>('chat');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/auth/me', { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(json => {
        if (json?.data) {
          setUser(json.data);
          setIsLoggedIn(true);
          setCurrentPage(json.data.role === 'admin' ? 'admin' : 'chat');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = (userData: UserInfo) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage(userData.role === 'admin' ? 'admin' : 'chat');
  };

  const handleLogout = async () => {
    await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setIsLoggedIn(false);
    setUser(null);
    setCurrentPage('chat');
  };

  const handleNavigate = (page: 'chat' | 'admin' | 'settings') => {
    if (page === 'admin' && user?.role !== 'admin') return;
    setCurrentPage(page);
  };

  const urlParams = new URLSearchParams(window.location.search);
  const isResetFlow = urlParams.get('action') === 'reset-password';

  if (isResetFlow) {
    return (
      <ErrorBoundary>
        <Login
          onLogin={handleLogin}
          initialView="reset"
          resetToken={urlParams.get('token') ?? undefined}
          resetUserId={urlParams.get('id') ? Number(urlParams.get('id')) : undefined}
        />
      </ErrorBoundary>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400 font-medium">Loading...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <ErrorBoundary>
        <Login onLogin={handleLogin} />
      </ErrorBoundary>
    );
  }

  if (user?.mustChangePassword) {
    return (
      <ErrorBoundary>
        <ForceChangePassword user={user} onPasswordChanged={(updated) => setUser(updated)} />
      </ErrorBoundary>
    );
  }

  const userRole = user?.role === 'admin' ? 'admin' : 'user';

  switch (currentPage) {
    case 'chat':
      return (
        <ErrorBoundary>
          <Chat onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} user={user} />
        </ErrorBoundary>
      );
    case 'admin':
      return (
        <ErrorBoundary>
          <Admin onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />
        </ErrorBoundary>
      );
    case 'settings':
      return (
        <ErrorBoundary>
          <Settings onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />
        </ErrorBoundary>
      );
    default:
      return (
        <ErrorBoundary>
          <Chat onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} user={user} />
        </ErrorBoundary>
      );
  }
}
