"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Get the current path from the URL
    const path = window.location.pathname;
    
    // Check if this is a story detail page
    if (path.startsWith('/story/')) {
      const slug = path.split('/').pop();
      
      // Store the slug in session storage
      if (slug) {
        sessionStorage.setItem('storySlug', slug);
      }
      
      // Navigate to the story page
      router.push('/story/[id]');
    } else {
      // For other 404s, go to home
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-zinc-400 mb-6">Redirecting you to a better place...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
      </div>
    </div>
  );
}
