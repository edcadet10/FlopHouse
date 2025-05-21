"use client";

import { ReactNode, useEffect, useState } from 'react';

// This is a client component wrapper that prevents rendering on the server
export default function ClientOnly({ children }: { children: ReactNode }) {
  // State to track if we're in the client
  const [isClient, setIsClient] = useState(false);

  // Effect to update state once client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render anything on the server
  if (!isClient) {
    return null;
  }

  // Render children only on client-side
  return <>{children}</>;
}
