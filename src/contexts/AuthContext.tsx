'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('access_token');
      if (token) {
        setAccessToken(token);
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string) => {
    setAccessToken(token);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('access_token', token);
    }
  };

  const logout = () => {
    setAccessToken(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('access_token');
    }
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
