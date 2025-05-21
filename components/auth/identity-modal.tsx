"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    netlifyIdentity: any;
  }
}

interface IdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  message?: string;
}

export default function IdentityModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  message = "Sign in with your email to upvote stories"
}: IdentityModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Ensure the widget is loaded
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      // Handle login success
      const handleLogin = () => {
        setLoading(false);
        onSuccess();
        onClose();
      };

      // Handle login error
      const handleLoginError = (err: Error) => {
        setLoading(false);
        setError(err.message || 'Failed to authenticate. Please try again.');
      };

      // Listen for events
      window.netlifyIdentity.on('login', handleLogin);
      window.netlifyIdentity.on('error', handleLoginError);

      // Cleanup event listeners
      return () => {
        window.netlifyIdentity.off('login', handleLogin);
        window.netlifyIdentity.off('error', handleLoginError);
      };
    }
  }, [onSuccess, onClose]);

  const handleLogin = () => {
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      setLoading(true);
      setError(null);
      window.netlifyIdentity.open('login');
    } else {
      setError('Authentication service not available. Please try again later.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-muted/50 to-muted/30 backdrop-blur-md border border-white/10 rounded-lg w-full max-w-md p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-white mb-2">Quick Authentication</h3>
          <p className="text-zinc-300">{message}</p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <Button 
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                Authenticating...
              </>
            ) : (
              'Continue with Email'
            )}
          </Button>
          
          <p className="text-xs text-zinc-400 text-center">
            We'll send you a magic link to your email. <br />
            No password required!
          </p>
        </div>
      </div>
    </div>
  );
}
