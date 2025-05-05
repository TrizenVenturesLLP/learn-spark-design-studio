
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

type User = {
  _id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean; // Added the isAuthenticated property
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!user && !!token; // Added isAuthenticated computed property

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    }
  }, []);

  const fetchUserData = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      setLoading(false);
      setError('Failed to authenticate. Please login again.');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5001/api/auth/login', {
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
      throw err;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post('http://localhost:5001/api/auth/signup', {
        name,
        email,
        password
      });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, error, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
