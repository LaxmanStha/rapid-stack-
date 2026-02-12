import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
// Always talk to PHP/XAMPP on localhost (not the React dev server origin)
const API_BASE = `http://localhost/RSB/api`;
const LOGIN_PAGE_URL = `http://localhost/RSB/public/index.html`;

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

  const logout = async () => {
    console.log('AuthContext logout function called');
    try {
      const currentToken = token || localStorage.getItem('token');
      if (currentToken) {
        await fetch(`${API_BASE}/logout.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`,
          },
          body: JSON.stringify({ token: currentToken }),
        }).catch(() => {});
      }
    } finally {
      console.log('Clearing user and token');
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Send user back to PHP login form
      console.log('Redirecting to login page with loggedOut flag');
      window.location.href = `${LOGIN_PAGE_URL}?loggedOut=1`;
    }
  };

  const value = {
    user,
    token,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
