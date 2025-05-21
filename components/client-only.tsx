"use client";

// This is a client component wrapper that delegates rendering to children
// Use this to explicitly mark client-only content in server components
import { ReactNode } from 'react';

export default function ClientOnly({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
