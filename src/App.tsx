import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router';
import Admin from './pages/Admin';
import Chat from './pages/Chat';
import Login from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
