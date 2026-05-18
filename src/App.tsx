import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Settings from './pages/Settings';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
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

  if (loading) return null;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const userRole = user?.role === 'admin' ? 'admin' : 'user';

  switch (currentPage) {
    case 'chat':
      return <Chat onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} user={user} />;
    case 'admin':
      return <Admin onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />;
    case 'settings':
      return <Settings onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />;
    default:
      return <Chat onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} user={user} />;
  }
}
