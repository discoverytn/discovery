import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('Selim Ben Said'); 
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
