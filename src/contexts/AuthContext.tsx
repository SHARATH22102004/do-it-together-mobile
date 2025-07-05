import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User } from '@/types/task';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (provider: 'google' | 'github' | 'facebook' | 'apple') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data for demo purposes
const mockUsers = {
  google: {
    id: 'google-123',
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    provider: 'google' as const,
  },
  github: {
    id: 'github-456',
    name: 'Jane Smith',
    email: 'jane.smith@github.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    provider: 'github' as const,
  },
  facebook: {
    id: 'facebook-789',
    name: 'Mike Johnson',
    email: 'mike.johnson@facebook.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    provider: 'facebook' as const,
  },
  apple: {
    id: 'apple-012',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@icloud.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    provider: 'apple' as const,
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('todo-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to load user from localStorage:', error);
        localStorage.removeItem('todo-user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('todo-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('todo-user');
    }
  }, [user]);

  const login = useCallback(async (provider: 'google' | 'github' | 'facebook' | 'apple') => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would handle actual OAuth flow
      const mockUser = mockUsers[provider];
      setUser(mockUser);
      
      toast({
        title: "Welcome back!",
        description: `Successfully signed in with ${provider}.`,
      });
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('todo-tasks'); // Clear tasks on logout
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};