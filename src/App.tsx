import { useState } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Admin from './pages/Admin';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
  const [currentPage, setCurrentPage] = useState<'chat' | 'admin'>('chat');

  const handleLogin = (email: string, pass: string) => {
    if (email === 'admin@admin' && pass === 'admin') {
      setUserRole('admin');
      setIsLoggedIn(true);
      setCurrentPage('admin');
    } else {
      setUserRole('user');
      setIsLoggedIn(true);
      setCurrentPage('chat');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleNavigate = (page: 'chat' | 'admin') => {
    if (page === 'admin' && userRole !== 'admin') {
      return;
    }
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return currentPage === 'chat' ? (
    <Chat onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />
  ) : (
    <Admin onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />
  );
}