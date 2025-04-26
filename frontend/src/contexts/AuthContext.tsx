import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app, this would call an API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation
      if (email === 'admin@example.com' && password === 'admin123') {
        const adminUser: User = { id: '1', email, role: 'admin' };
        localStorage.setItem('user', JSON.stringify(adminUser));
        setUser(adminUser);
      } else if (email === 'user@example.com' && password === 'user123') {
        const regularUser: User = { id: '2', email, role: 'user' };
        localStorage.setItem('user', JSON.stringify(regularUser));
        setUser(regularUser);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (email: string, password: string, role: 'user' | 'admin') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new user
      const newUser: User = { id: Math.random().toString(36).substr(2, 9), email, role };
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
