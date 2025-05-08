
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../lib/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast(); // Use the toast from useToast hook

  // Check if the user is authenticated
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data as User);
        setLoading(false);
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data as AuthResponse;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
      
      // Check if there's a stored redirect path
      const redirectPath = localStorage.getItem('redirectPath') || '/dashboard';
      localStorage.removeItem('redirectPath'); // Clear the stored path after use
      
      navigate(redirectPath);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Fix: Use the correct endpoint for signup (changed from /register to /signup)
      const response = await axios.post('/api/auth/signup', { name, email, password });
      const { token: authToken, user: userData } = response.data as AuthResponse;
      
      localStorage.setItem('token', authToken);
      setToken(authToken);
      setUser(userData);
      
      navigate('/dashboard');
      
      // Show success toast
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Signup error details:', error);
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!token, 
      user, 
      token, 
      loading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
