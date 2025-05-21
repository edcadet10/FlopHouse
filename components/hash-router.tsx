"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import StoryViewerClient from '@/app/story-viewer-client';

export default function HashRouter() {
  const [currentRoute, setCurrentRoute] = useState<string | null>(null);
  const [storySlug, setStorySlug] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Function to handle hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentRoute(hash);
      
      // Check if this is a story route
      if (hash.startsWith('#/story/')) {
        const slug = hash.replace('#/story/', '');
        setStorySlug(slug);
      } else {
        setStorySlug(null);
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Don't render anything on the server
  if (typeof window === 'undefined') {
    return null;
  }

  // If we have a story slug, render the story viewer
  if (storySlug) {
    return <StoryViewerClient slug={storySlug} />;
  }

  // Otherwise, don't render anything (let the normal page content show)
  return null;
}
