import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { UsersPage } from './pages/UsersPage';
import './App.scss';

export const App = () => {
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={<LoginPage setToken={setToken} token={token} />} />
        <Route path='/info' element={<UsersPage token={token} />} />
      </Routes>
    </div>
  );
}
