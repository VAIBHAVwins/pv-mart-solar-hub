
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user?: any;
  role?: 'admin' | 'customer' | 'vendor';
}

interface AuthContextType {
  authState: AuthState | null;
  setAuthState: (state: AuthState | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState | null>(null);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
