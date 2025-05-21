"use client";

import { useEffect, useState } from "react";

// Story type definition
export interface Story {
  id: string;
  title: string;
  companyName: string;
  industry: string;
  fundingAmount: string;
  failureReason: string;
  content: string;
  contentHtml: string;
  date: string;
  readTime: string;
  upvotes: number;
  slug: string;
}

// Story fetcher hook
export function useStoryFetcher(slug: string | undefined) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        
        // Check if we have the story data in sessionStorage first
        if (typeof window !== 'undefined') {
          const storedStoryData = sessionStorage.getItem('currentStory');
          if (storedStoryData) {
            // Clear it to prevent stale data on refresh
            sessionStorage.removeItem('currentStory');
            
            const parsedData = JSON.parse(storedStoryData);
            setStory(parsedData);
            setError(null);
            setLoading(false);
            return; // Exit early if we have the data
          }
          
          // Check if we have a slug in session storage
          const storedSlug = sessionStorage.getItem('storySlug');
          if (storedSlug) {
            // Clear it to prevent stale data on refresh
            sessionStorage.removeItem('storySlug');
            
            // Use the stored slug instead
            slug = storedSlug;
          }
        }
        
        // Only proceed if we have a valid slug
        if (!slug || slug === "[id]") {
          setLoading(false);
          setError("Story ID is missing");
          return;
        }
        
        console.log("Fetching story with slug:", slug);
        
        // Try to fetch from API
        const response = await fetch(`/.netlify/functions/get-story/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Story not found");
          }
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setStory(data);
        setError(null);
      } catch (err: unknown) {
        console.error("Failed to load story:", err);
        // Type guard to safely access error message
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load story. Please try again later.");
        }
        setStory(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStory();
  }, [slug]);
  
  return { story, loading, error };
}
