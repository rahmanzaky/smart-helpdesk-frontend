import { useState } from 'react';
import Login from './pages/Login';
import Chat from './pages/Chat';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // In a real app, this would be handled by a router and proper auth
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <Chat onLogout={handleLogout} />
  ) : (
    <div onClick={handleLogin}>
      <Login />
    </div>
  );
}
