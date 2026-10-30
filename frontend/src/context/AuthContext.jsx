import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('k12_admin_token') || null;
    } catch {
      return null;
    }
  });

  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('k12_admin_info');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'admin'

  const logout = useCallback(() => {
    setToken(null);
    setAdmin(null);
    try {
      localStorage.removeItem('k12_admin_token');
      localStorage.removeItem('k12_admin_info');
    } catch (e) {
      console.warn('Storage clear error:', e);
    }
    setCurrentView('home');
  }, []);

  // Verify token validity on initial mount
  useEffect(() => {
    let isMounted = true;

    const verifyExistingSession = async () => {
      let storedToken = null;
      try {
        storedToken = localStorage.getItem('k12_admin_token');
      } catch (e) {
        console.warn(e);
      }

      if (!storedToken) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (isMounted) {
          if (response && response.success && response.admin) {
            setAdmin(response.admin);
          } else {
            logout();
          }
        }
      } catch (err) {
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    verifyExistingSession();

    return () => {
      isMounted = false;
    };
  }, [logout]);

  const login = async (email, password) => {
    const response = await api.login(email, password);
    if (response && response.success && response.token) {
      setToken(response.token);
      setAdmin(response.admin);
      try {
        localStorage.setItem('k12_admin_token', response.token);
        localStorage.setItem('k12_admin_info', JSON.stringify(response.admin));
      } catch (e) {
        console.warn(e);
      }
      setIsLoginModalOpen(false);
      setCurrentView('admin');
      return response;
    }
    throw new Error((response && response.message) || 'Authentication failed');
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
