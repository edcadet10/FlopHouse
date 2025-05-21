import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

// This middleware protects routes that require authentication
export default withMiddlewareAuthRequired();

export const config = {
  // Skip middleware for these paths
  matcher: [
    // Auth routes
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)'
  ],
};
