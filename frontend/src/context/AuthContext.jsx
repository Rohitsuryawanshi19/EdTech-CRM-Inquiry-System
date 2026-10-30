import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('k12_admin_token') || null);
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('k12_admin_info');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'admin'

  // Verify token validity on initial mount
  useEffect(() => {
    const verifyExistingSession = async () => {
      const storedToken = localStorage.getItem('k12_admin_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response.success && response.admin) {
          setAdmin(response.admin);
        } else {
          logout();
        }
      } catch (err) {
        // If token expired or invalid, log out
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyExistingSession();
  }, []);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    if (response.success && response.token) {
      setToken(response.token);
      setAdmin(response.admin);
      localStorage.setItem('k12_admin_token', response.token);
      localStorage.setItem('k12_admin_info', JSON.stringify(response.admin));
      setIsLoginModalOpen(false);
      setCurrentView('admin'); // Seamlessly navigate into admin dashboard upon login
      return response;
    }
    throw new Error(response.message || 'Authentication failed');
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('k12_admin_token');
    localStorage.removeItem('k12_admin_info');
    setCurrentView('home');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        isAuthenticated: !!token,
        isLoading,
        isLoginModalOpen,
        setIsLoginModalOpen,
        currentView,
        setCurrentView,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
