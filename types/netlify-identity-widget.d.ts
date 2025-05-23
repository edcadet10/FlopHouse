declare module 'netlify-identity-widget' {
  interface User {
    jwt: () => Promise<string>;
    app_metadata?: any;
    user_metadata?: any;
    email?: string;
    id?: string;
    role?: string;
  }

  type EventCallback = ((user?: User) => void) | ((err: Error) => void);

  interface NetlifyIdentityWidget {
    init: (options?: { APIUrl?: string; logo?: boolean }) => void;
    open: (tab?: string) => void;
    openModal: (tab?: string) => void;
    close: () => void;
    logout: () => void;
    refresh: () => Promise<string>;
    currentUser: () => User | null;
    on: (event: string, callback: EventCallback) => void;
    off: (event: string, callback: EventCallback) => void;
    gotrue?: any;
  }

  const netlifyIdentity: NetlifyIdentityWidget;
  export default netlifyIdentity;
}

// Ensure TS knows about window.netlifyIdentity
declare global {
  interface Window {
    netlifyIdentity: typeof netlifyIdentity;
  }
}
