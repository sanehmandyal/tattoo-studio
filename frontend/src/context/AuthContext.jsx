import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('ink_carvers_token'));
  const [loading, setLoading] = useState(true);

  // Load current user on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res.success) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.success) {
        localStorage.setItem('ink_carvers_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome back, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const res = await authAPI.register({ name, email, password, phone });
      if (res.success) {
        localStorage.setItem('ink_carvers_token', res.token);
        setToken(res.token);
        setUser(res.user);
        toast.success(`Welcome to INK CARVERS, ${res.user.name}!`);
        return { success: true, user: res.user };
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('ink_carvers_token');
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully');
  };

  const reloadUser = async () => {
    if (token) {
      try {
        const res = await authAPI.getMe();
        if (res.success) setUser(res.user);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, reloadUser, isAdmin }}>
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
