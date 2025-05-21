'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AuthButtonProps {
  mode?: 'button' | 'modal';
  onLoginSuccess?: () => void;
}

export default function Auth0Button({ 
  mode = 'button',
  onLoginSuccess 
}: AuthButtonProps) {
  const { user, error, isLoading } = useUser();
  const [showError, setShowError] = useState<string | null>(null);
  
  // Handle successful login
  useEffect(() => {
    if (user && onLoginSuccess) {
      onLoginSuccess();
    }
  }, [user, onLoginSuccess]);

  // Handle errors
  useEffect(() => {
    if (error) {
      setShowError(error.message);
    }
  }, [error]);

  if (isLoading) {
    return (
      <Button disabled className="w-full">
        <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <Button 
        onClick={() => window.location.href = '/api/auth/logout'}
        variant="outline"
        className="border-white/10"
      >
        Sign Out ({user.email || user.name || 'User'})
      </Button>
    );
  }

  const handleLogin = () => {
    // Clear any previous errors
    setShowError(null);
    
    // Redirect to Auth0 login
    window.location.href = '/api/auth/login';
  };

  // Simple button mode
  if (mode === 'button') {
    return (
      <div className="space-y-2">
        {showError && (
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-xs">{showError}</p>
          </div>
        )}
        <Button onClick={handleLogin}>
          Sign In
        </Button>
      </div>
    );
  }

  // Modal mode for upvoting and other actions
  return (
    <div className="space-y-4">
      {showError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-400 text-sm">{showError}</p>
        </div>
      )}
      
      <Button 
        className="w-full"
        onClick={handleLogin}
      >
        Continue with Auth0
      </Button>
      
      <p className="text-xs text-zinc-400 text-center mt-4">
        Sign in with your email or social accounts
      </p>
    </div>
  );
}
