import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { authService, LoginParams, RegisterParams } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (params: LoginParams) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => void;
  isCitizen: boolean;
  isModerator: boolean;
  isOperations: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('civictrack_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('civictrack_token');
      if (storedToken) {
        try {
          const currentUser = await authService.getMe();
          setUser(currentUser);
        } catch (error) {
          console.error('Session expired or invalid', error);
          localStorage.removeItem('civictrack_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (params: LoginParams) => {
    const data = await authService.login(params);
    localStorage.setItem('civictrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (params: RegisterParams) => {
    const data = await authService.register(params);
    localStorage.setItem('civictrack_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('civictrack_token');
    setToken(null);
    setUser(null);
  };

  const isCitizen = user?.role === 'ROLE_CITIZEN';
  const isModerator = user?.role === 'ROLE_MODERATOR';
  const isOperations = user?.role === 'ROLE_OPERATIONS';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        isCitizen,
        isModerator,
        isOperations,
      }}
    >
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
