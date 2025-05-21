"use client";

import React from 'react';
import { X } from 'lucide-react';
import Auth0Button from './auth0-button';

interface Auth0ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  message?: string;
}

export default function Auth0Modal({ 
  isOpen, 
  onClose, 
  onSuccess,
  message = "Sign in with your email to upvote this story"
}: Auth0ModalProps) {
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
        
        <Auth0Button mode="modal" onLoginSuccess={onSuccess} />
      </div>
    </div>
  );
}
