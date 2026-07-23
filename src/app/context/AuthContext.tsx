import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  stats: {
    totalScans: number;
    verified: number;
    flagged: number;
    accuracy: number;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (api.isAuthenticated()) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
        } catch (e: any) {
          console.error('Failed to load profile:', e);
          api.logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
    } catch (e: any) {
      setError(e.message || 'Login failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.signup(name, email, password);
      setUser(data.user);
    } catch (e: any) {
      setError(e.message || 'Registration failed');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
    setError(null);
  };

  const updateProfile = async (name: string, email: string) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await api.updateProfile(name, email);
      setUser(updatedUser);
    } catch (e: any) {
      setError(e.message || 'Failed to update profile');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (api.isAuthenticated()) {
      try {
        const profile = await api.getProfile();
        setUser(profile);
      } catch (e: any) {
        console.error('Failed to refresh user profile:', e);
      }
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        signup,
        logout,
        updateProfile,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
