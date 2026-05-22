import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUserAPI } from '../api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser && storedUser !== 'undefined') {
        const parsed = JSON.parse(storedUser);
        if (parsed && (typeof parsed.id === 'number' || (parsed.id && String(parsed.id).length < 10))) {
          localStorage.removeItem('userInfo');
          setUser(null);
        } else {
          setUser(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse user info', e);
      localStorage.removeItem('userInfo');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const data = await registerUserAPI(name, email, password);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('userInfo', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
