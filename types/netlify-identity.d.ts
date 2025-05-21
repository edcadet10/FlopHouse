// Global type declarations for Netlify Identity Widget
// This ensures TypeScript recognizes window.netlifyIdentity

// Import the NetlifyIdentityWidget type from the @types/netlify-identity-widget package
import NetlifyIdentityWidget from 'netlify-identity-widget';

// Extend the types to include the jwt method on User objects
declare module 'netlify-identity-widget' {
  interface User {
    // Add the jwt method that returns a Promise with the JWT token
    jwt: () => Promise<string>;
    // Add any other missing properties or methods used in your code
  }

  // Augment the module's default export to include 'gotrue'
  interface NetlifyIdentityAPI {
    gotrue?: unknown;
  }
}

// Extend the Window interface to include netlifyIdentity
declare global {
  interface Window {
    netlifyIdentity: typeof NetlifyIdentityWidget;
  }
}
