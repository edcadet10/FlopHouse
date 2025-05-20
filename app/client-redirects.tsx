"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function ClientRedirects() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Handle story slug redirects
    if (pathname === '/story/[id]' || pathname === '/story/[id]/') {
      const storySlug = sessionStorage.getItem('storySlug');
      if (storySlug) {
        // Clear the storySlug to prevent infinite loops
        sessionStorage.removeItem('storySlug');
        
        // Fetch the story data
        fetch(`/api/get-story/${storySlug}`)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Story not found');
          })
          .then(story => {
            console.log('Story data loaded:', story);
            // Set story data in session storage to be used by the story page
            sessionStorage.setItem('currentStory', JSON.stringify(story));
          })
          .catch(error => {
            console.error('Error loading story:', error);
          });
      }
    }
    
    // Check if we have a redirectPath in sessionStorage (from 404.html)
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath && pathname === '/') {
      // Clear the redirectPath to prevent infinite loops
      sessionStorage.removeItem('redirectPath');
      
      // Navigate to the stored path
      router.push('/' + redirectPath);
    }
  }, [pathname, router]);

  return null;
}
