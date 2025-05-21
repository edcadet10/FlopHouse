"use client";

import { useEffect } from 'react';

export default function NetlifyIdentityInit() {
  useEffect(() => {
    // Make sure netlifyIdentity is available before using it
    if (typeof window !== 'undefined' && window.netlifyIdentity) {
      // Initialize with the correct site URL
      const siteUrl = window.location.hostname.includes('localhost') 
        ? 'flop-house.netlify.app' 
        : window.location.hostname;
      
      window.netlifyIdentity.init({
        APIUrl: `https://${siteUrl}/.netlify/identity`,
        logo: false // Optional - set to your logo if desired
      });
      
      console.log('Netlify Identity initialized with site:', siteUrl);
      
      // Set up event handlers for debugging
      window.netlifyIdentity.on('login', user => {
        console.log('User logged in:', user);
      });
      
      window.netlifyIdentity.on('error', err => {
        console.error('Netlify Identity error:', err);
      });
    } else {
      console.warn('Netlify Identity widget not loaded yet');
    }
  }, []);
  
  // This component doesn't render anything
  return null;
}
