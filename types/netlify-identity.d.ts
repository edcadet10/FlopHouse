// Global type declarations for Netlify Identity Widget
// This ensures TypeScript recognizes window.netlifyIdentity

// Import the NetlifyIdentityWidget type from the @types/netlify-identity-widget package
import NetlifyIdentityWidget from 'netlify-identity-widget';

// Extend the Window interface to include netlifyIdentity
declare global {
  interface Window {
    netlifyIdentity: typeof NetlifyIdentityWidget;
  }
}
