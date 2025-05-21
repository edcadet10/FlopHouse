import { handleAuth } from '@auth0/nextjs-auth0';

// Configure Auth0 handler for App Router
export const GET = handleAuth();
export const POST = handleAuth();
