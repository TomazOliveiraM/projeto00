import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded.user);
        } else {
          setUser(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Token inválido:", error);
        setUser(null);
        localStorage.removeItem('token');
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    setTokenState(newToken);
  };

  const register = async (userData) => {
    await api.post('/auth/register', userData);
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    localStorage.removeItem('token');
  };

  const setToken = (newToken) => {
    setTokenState(newToken);
    localStorage.setItem('token', newToken);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    register,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};