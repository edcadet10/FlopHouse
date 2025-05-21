'use client';

import { AuthProvider as CustomAuthProvider } from './auth-context';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <CustomAuthProvider>{children}</CustomAuthProvider>;
}
