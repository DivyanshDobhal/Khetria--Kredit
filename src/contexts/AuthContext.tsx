import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, authAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'BORROWER' | 'LENDER') => Promise<void>;
  logout: () => void;
  switchRole: () => Promise<void>; // For demo purposes
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check for stored auth token and user data
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          const response = await authAPI.getCurrentUser();
          localStorage.setItem('user_data', JSON.stringify(response.data));
          setUser(response.data);
        } catch (error) {
          console.error('Error restoring user session:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Listen for storage changes to sync user state across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_data' && e.newValue) {
        try {
          const parsedUser = JSON.parse(e.newValue);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data from storage:', error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Call the actual API
      const response = await authAPI.login({ email, password });
      const { token, user: userData } = response.data;

      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);

      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.name}!`,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Please check your credentials and try again.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'BORROWER' | 'LENDER') => {
    try {
      setIsLoading(true);

      // Call the actual API
      const response = await authAPI.register({ name, email, password, role });
      const { token, user: userData } = response.data;

      // Store token and user data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      // Update user state immediately and wait for it to be set
      setUser(userData);
      
      // Small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      toast({
        title: "Registration Successful",
        description: `Welcome to Kshetra Kredit, ${name}!`,
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || "Please try again with different details.";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Demo function to switch between roles for hackathon demo
  const switchRole = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const response = await authAPI.switchRole();
      const { token, user: updatedUser } = response.data;

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      setUser(updatedUser);

      toast({
        title: `Switched to ${updatedUser.role}`,
        description: `You are now viewing as a ${updatedUser.role.toLowerCase()}.`,
      });
    } catch (error: any) {
      console.error('Role switch error:', error);
      toast({
        title: "Role Switch Failed",
        description: error.response?.data?.message || "Please log in again and try switching roles.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
