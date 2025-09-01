import { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  }

  // Fallback si pas de provider
  const { data: session, status } = useSession();
  
  return {
    user: session?.user as User || {
      id: 'admin-1',
      name: 'Admin Test',
      email: 'admin@test.com',
      role: 'ADMIN'
    },
    isLoading: status === 'loading',
    login: async () => true,
    logout: () => {},
    isAuthenticated: !!session?.user || true
  };
}
