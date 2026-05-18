import { useState } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import Settings from './pages/Settings';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');
  const [currentPage, setCurrentPage] = useState<'chat' | 'admin' | 'settings'>('chat');

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

  const handleNavigate = (page: 'chat' | 'admin' | 'settings') => {
    if (page === 'admin' && userRole !== 'admin') {
      return;
    }
    setCurrentPage(page);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'chat':
        return <Chat onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />;
      case 'admin':
        return <Admin onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />;
      case 'settings':
        return <Settings onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />;
      default:
        return <Chat onLogout={handleLogout} onNavigate={handleNavigate} userRole={userRole} />;
    }
  };

  return renderPage();
}