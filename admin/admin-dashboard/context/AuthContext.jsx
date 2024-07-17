import React, { createContext, useState, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [idadmin, setIdadmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if ('id' in decodedToken) {
          const idValue = decodedToken['id'];
          setIdadmin(idValue);
          console.log('Admin ID set from context:', idValue);
        }
        if ('username' in decodedToken) {
          const usernameValue = decodedToken['username'];
          setUsername(usernameValue);
          console.log('Username set from context:', usernameValue);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  const login = (newToken, newUsername, newIdadmin) => {
    setToken(newToken);
    setUsername(newUsername);
    setIdadmin(newIdadmin);
    console.log('Token and idadmin stored in context:', newToken, newIdadmin);
  };

  const logout = () => {
    setToken(null);
    setUsername('');
    setIdadmin(null);
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <AuthContext.Provider value={{ token, username, idadmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
