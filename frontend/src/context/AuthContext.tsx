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
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('civictrack_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('civictrack_token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const safetyTimer = setTimeout(() => {
      if (isMounted) setIsLoading(false);
    }, 1500);

    const initAuth = async () => {
      const storedToken = localStorage.getItem('civictrack_token');
      if (storedToken && !user) {
        try {
          const currentUser = await Promise.race([
            authService.getMe(),
            new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
          ]);
          if (isMounted) setUser(currentUser);
        } catch {
          const saved = localStorage.getItem('civictrack_user');
          if (saved && isMounted) {
            try {
              setUser(JSON.parse(saved));
            } catch {
              localStorage.removeItem('civictrack_token');
              localStorage.removeItem('civictrack_user');
              if (isMounted) {
                setToken(null);
                setUser(null);
              }
            }
          }
        }
      }
      if (isMounted) setIsLoading(false);
    };

    initAuth();
    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
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
