'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Define user type
interface User {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

// Define context type
interface AuthContextType {
  user: User | null;
  error: Error | null;
  isLoading: boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  error: null,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to fetch the user session
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/.netlify/functions/auth/session');
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
        
      } catch (err) {
        console.error('Error fetching user session:', err);
        setUser(null);
        setError(err instanceof Error ? err : new Error('Failed to fetch user session'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up event listener for storage changes to detect login/logout in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_session_state') {
        fetchSession();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, error, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useUser() {
  return useContext(AuthContext);
}
