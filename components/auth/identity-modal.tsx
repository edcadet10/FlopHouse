"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NetlifyIdentityWidget from 'netlify-identity-widget';

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
    if (typeof window !== 'undefined') {
      // Initialize with the correct site URL if not already initialized
      const siteUrl = window.location.hostname.includes('localhost') 
        ? 'flop-house.netlify.app' 
        : window.location.hostname;
      
      // Only initialize if not already initialized
      if (!NetlifyIdentityWidget.gotrue) {
        try {
          NetlifyIdentityWidget.init({
            APIUrl: `https://${siteUrl}/.netlify/identity`,
            logo: false
          });
          console.log('Initialized Netlify Identity for modal with site:', siteUrl);
        } catch (err) {
          console.error('Failed to initialize Netlify Identity:', err);
          setError('Authentication service initialization failed. Please try again later.');
        }
      }

      // Handle login success
      const handleLogin = (user: unknown): void => {
        console.log('Login success:', user);
        setLoading(false);
        onSuccess();
        onClose();
      };

      // Handle login error
      const handleLoginError = (err: Error): void => {
        console.error('Login error:', err);
        setLoading(false);
        setError(err.message || 'Failed to authenticate. Please try again.');
      };

      // Listen for events
      NetlifyIdentityWidget.on('login', handleLogin);
      NetlifyIdentityWidget.on('error', handleLoginError);

      // Add timeout to detect if modal doesn't open properly
      const modalTimeout = setTimeout(() => {
        if (loading) {
          setLoading(false);
          setError('Authentication service timeout. Please check your Netlify Identity setup or network connection.');
        }
      }, 5000); // 5 second timeout

      // Cleanup event listeners
      return () => {
        NetlifyIdentityWidget.off('login', handleLogin);
        NetlifyIdentityWidget.off('error', handleLoginError);
        clearTimeout(modalTimeout);
      };
    }
  }, [onSuccess, onClose, loading]);

  const handleLogin = () => {
    if (typeof window !== 'undefined') {
      setLoading(true);
      setError(null);
      
      try {
        // Log debug information
        console.log('Opening Netlify Identity login modal');
        
        // Use open method to display the login modal
        NetlifyIdentityWidget.open('login');
      } catch (e) {
        console.error('Error opening login modal:', e);
        setError('Authentication service not available. Please try again later.');
        setLoading(false);
      }
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
                Opening Login...
              </>
            ) : (
              'Continue with Email'
            )}
          </Button>
          
          {loading && (
            <Button 
              variant="outline" 
              className="w-full mt-2 border-white/10 text-zinc-300"
              onClick={() => {
                setLoading(false);
                setError('Login process was cancelled.');
              }}
            >
              Cancel
            </Button>
          )}
          
          <p className="text-xs text-zinc-400 text-center mt-4">
            {loading ? 
              'If the login widget doesn\'t appear, try refreshing the page or check your Netlify settings.' : 
              'We\'ll send you a magic link to your email. No password required!'}
          </p>
        </div>
      </div>
    </div>
  );
}
