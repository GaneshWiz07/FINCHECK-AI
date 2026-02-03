import { createContext, useContext, useState, type ReactNode } from 'react';

// Mock profile without Supabase
interface Profile {
  id: string;
  email: string;
  business_name: string;
  industry: string;
  annual_revenue: string;
  language: 'en' | 'hi';
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  loading: boolean;
  updateProfile: (updates: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default demo user - no authentication required
const defaultUser = {
  id: 'demo-user-001',
  email: 'demo@fincheck.ai',
};

const defaultProfile: Profile = {
  id: 'demo-user-001',
  email: 'demo@fincheck.ai',
  business_name: 'Demo Business',
  industry: 'technology',
  annual_revenue: '1Cr-5Cr',
  language: 'en',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(defaultProfile);

  function updateProfile(updates: Partial<Profile>) {
    setProfile(prev => ({ ...prev, ...updates }));
  }

  return (
    <AuthContext.Provider
      value={{
        user: defaultUser,
        profile,
        loading: false,
        updateProfile,
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
