import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Parse user data from URL params
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');
    const tokenParam = params.get('token');

    if (userParam) {
      try {
        const decodedUser = JSON.parse(atob(userParam));
        setUser(decodedUser);
        localStorage.setItem('user', JSON.stringify(decodedUser));
      } catch (error) {
        console.error('Error decoding user data:', error);
      }
    }

    if (tokenParam) {
      setToken(tokenParam);
      localStorage.setItem('token', tokenParam);
    }

    // Fallback to localStorage if URL params are not available
    if (!user) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }
    }

    if (!token) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'http://localhost/RSB/public/index.html';
  };

  const value = {
    user,
    token,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
