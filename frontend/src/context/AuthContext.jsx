import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api, { setupInterceptors } from '../api/axiosconfig';
import axios from 'axios';

// 1. Removed "export" to satisfy Vite's Fast Refresh rules
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Wrapped in useCallback to prevent infinite render loops with interceptors
  const refreshTokens = useCallback(async () => {
    try {
      const response = await axios.post(
        'http://localhost:7300/api/users/refresh', 
        {}, 
        { withCredentials: true }
      );
      setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      return response.data.accessToken;
    } catch (err) {
      // NOTE: A 401 Unauthorized error will naturally trigger here if the user 
      // is logged out. This is expected behavior and perfectly safe!
      setAccessToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is cached safely

  // Dynamically configure and handle Axios interceptor lifecycle attachments
  useEffect(() => {
    const { requestIntercept, responseIntercept } = setupInterceptors(
      accessToken, 
      refreshTokens, 
      setAccessToken
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, refreshTokens]); // Added refreshTokens to dependency array securely

  // Run on initial app load to see if user has a valid active refresh session
  useEffect(() => {
    refreshTokens();
  }, [refreshTokens]);

  // Login handler
  const login = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
    return response.data;
  };

  // Logout handler
  const logout = async () => {
    try {
      await api.post('/users/logout');
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, user, login, logout, refreshTokens, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook placed at the bottom
export const useAuth = () => {
  return useContext(AuthContext);
};