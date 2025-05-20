"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { TrendingUp, Zap, ArrowLeft, FileText, Flame, ThumbsUp, AlertCircle } from "lucide-react"

// Mock data for static export
const mockStories = [
  {
    id: "1",
    title: "TaskMaster: What Went Wrong",
    companyName: "TaskMaster Inc.",
    industry: "SaaS",
    fundingAmount: "$1.2M",
    failureReason: "Lack of Product-Market Fit",
    content: "A deep dive into how we misunderstood the market need and built features nobody wanted.\n\n## The Beginning\n\nWe started TaskMaster with a simple mission: help teams manage tasks better. We raised a $1.2M seed round and assembled a team of 6 engineers.\n\n## Where We Went Wrong\n\nWe built features we thought users would want, without validating our assumptions. We spent 8 months building an AI-powered task prioritization system, only to find out most users just wanted simple kanban boards.\n\n## Lessons Learned\n\n1. Talk to users before building features\n2. Launch with a minimal viable product\n3. Focus on solving one problem really well",
    contentHtml: "<p>A deep dive into how we misunderstood the market need and built features nobody wanted.</p>\n<h2>The Beginning</h2>\n<p>We started TaskMaster with a simple mission: help teams manage tasks better. We raised a $1.2M seed round and assembled a team of 6 engineers.</p>\n<h2>Where We Went Wrong</h2>\n<p>We built features we thought users would want, without validating our assumptions. We spent 8 months building an AI-powered task prioritization system, only to find out most users just wanted simple kanban boards.</p>\n<h2>Lessons Learned</h2>\n<ol>\n<li>Talk to users before building features</li>\n<li>Launch with a minimal viable product</li>\n<li>Focus on solving one problem really well</li>\n</ol>",
    date: "3 days ago",
    readTime: "5 min read",
    upvotes: 24,
    slug: "taskmaster-what-went-wrong"
  },
  {
    id: "2",
    title: "CodeBuddy: Our Journey to Shutdown",
    companyName: "CodeBuddy",
    industry: "Developer Tools",
    fundingAmount: "$800K",
    failureReason: "Business Model",
    content: "We built a great product that developers loved, but our business model couldn't sustain growth.\n\n## The Product\n\nCodeBuddy was an AI-powered code review tool that integrated with GitHub and provided real-time feedback on code quality, security vulnerabilities, and performance issues.\n\n## The Problem\n\nDevelopers loved our free tier, but we struggled to convert them to paying customers. Our pricing model didn't align with the value we provided.\n\n## Lessons Learned\n\n1. Validate willingness to pay early on\n2. Build a business model that aligns with user value\n3. Focus on enterprise sales earlier",
    contentHtml: "<p>We built a great product that developers loved, but our business model couldn't sustain growth.</p>\n<h2>The Product</h2>\n<p>CodeBuddy was an AI-powered code review tool that integrated with GitHub and provided real-time feedback on code quality, security vulnerabilities, and performance issues.</p>\n<h2>The Problem</h2>\n<p>Developers loved our free tier, but we struggled to convert them to paying customers. Our pricing model didn't align with the value we provided.</p>\n<h2>Lessons Learned</h2>\n<ol>\n<li>Validate willingness to pay early on</li>\n<li>Build a business model that aligns with user value</li>\n<li>Focus on enterprise sales earlier</li>\n</ol>",
    date: "1 week ago",
    readTime: "7 min read",
    upvotes: 56,
    slug: "codebuddy-our-journey-to-shutdown"
  },
  {
    id: "3",
    title: "LaunchNow: Lessons from Our Failure",
    companyName: "LaunchNow",
    industry: "No-Code",
    fundingAmount: "$500K",
    failureReason: "Market Timing",
    content: "Our no-code platform gained early traction but failed to convert free users to paying customers.\n\n## The Vision\n\nLaunchNow was a no-code platform designed to help non-technical founders build MVPs without writing a single line of code.\n\n## What Happened\n\nWe entered a crowded market too late, competing with established players like Bubble and Webflow. Our differentiators weren't strong enough to convince users to switch.\n\n## Key Takeaways\n\n1. Market timing is crucial - being first mover or having a strong differentiation\n2. Free users don't always convert, even if they love your product\n3. Listen to the market before building complex features",
    contentHtml: "<p>Our no-code platform gained early traction but failed to convert free users to paying customers.</p>\n<h2>The Vision</h2>\n<p>LaunchNow was a no-code platform designed to help non-technical founders build MVPs without writing a single line of code.</p>\n<h2>What Happened</h2>\n<p>We entered a crowded market too late, competing with established players like Bubble and Webflow. Our differentiators weren't strong enough to convince users to switch.</p>\n<h2>Key Takeaways</h2>\n<ol>\n<li>Market timing is crucial - being first mover or having a strong differentiation</li>\n<li>Free users don't always convert, even if they love your product</li>\n<li>Listen to the market before building complex features</li>\n</ol>",
    date: "2 weeks ago",
    readTime: "6 min read",
    upvotes: 32,
    slug: "launchnow-lessons"
  },
  {
    id: "placeholder",
    title: "Startup Post-Mortem",
    companyName: "Example Company",
    industry: "Tech",
    fundingAmount: "$1M",
    failureReason: "Various Factors",
    content: "This is a placeholder for startup post-mortems.",
    contentHtml: "<p>This is a placeholder for startup post-mortems.</p>",
    date: "Recently",
    readTime: "5 min read",
    upvotes: 10,
    slug: "placeholder"
  }
];

export default function StoryClient({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upvoting, setUpvoting] = useState(false)
  const [upvoted, setUpvoted] = useState(false)
  
  useEffect(() => {
    const loadStory = async () => {
      try {
        setLoading(true)
        
        // First try to find in mock data (for static generation and offline usage)
        const mockStory = mockStories.find(s => s.id === params.id || s.slug === params.id);
        
        if (mockStory) {
          setStory(mockStory);
          setError(null);
          return;
        }
        
        // In a production environment with static export, you would fetch data from a JSON file
        // or an external API instead of using serverless functions
        try {
          // Only try to fetch from API when in a browser environment (not during static generation)
          if (typeof window !== 'undefined') {
            const response = await fetch(`/.netlify/functions/get-story/${params.id}`);
            
            if (!response.ok) {
              if (response.status === 404) {
                throw new Error("Story not found");
              }
              throw new Error(`Error: ${response.status}`);
            }
            
            const data = await response.json();
            setStory(data);
          }
        } catch (fetchError) {
          console.error("Failed to fetch from API:", fetchError);
          // If not found in API and we're here, show the error
          if (!mockStory) {
            throw new Error("Story not found or error fetching data");
          }
        }
      } catch (err: any) {
        console.error("Failed to load story:", err);
        setError(err.message || "Failed to load story. Please try again later.");
        setStory(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadStory();
    
    // Check if user has upvoted this story before
    if (typeof window !== 'undefined') {
      const upvotedStories = localStorage.getItem('upvotedStories');
      if (upvotedStories) {
        const upvotedList = JSON.parse(upvotedStories);
        setUpvoted(upvotedList.includes(params.id));
      }
    }
  }, [params.id]);
  
  // Handle upvote
  const handleUpvote = async () => {
    if (upvoted || !story) return;
    
    setUpvoting(true);
    
    try {
      // For static export, we'll just handle this on the client side
      // In a production app, you'd call an API endpoint
      setStory((prev: any) => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
      setUpvoted(true);
      
      // Store in localStorage to prevent multiple upvotes
      if (typeof window !== 'undefined') {
        const upvotedStories = localStorage.getItem('upvotedStories');
        const upvotedList = upvotedStories ? JSON.parse(upvotedStories) : [];
        localStorage.setItem('upvotedStories', JSON.stringify([...upvotedList, story.id]));
      }
      
      // In development or when connected to internet, try the API
      if (typeof window !== 'undefined') {
        try {
          await fetch('/.netlify/functions/upvote-story', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ storyId: story.id })
          });
        } catch (error) {
          console.error('Error calling API:', error);
          // We already updated the UI, so no need to show an error
        }
      }
    } catch (err) {
      console.error('Error upvoting:', err);
    } finally {
      setUpvoting(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="container px-4 py-12 mx-auto max-w-4xl">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </main>
    );
  }
  
  // Error state
  if (error) {
    return (
      <main className="min-h-screen">
        <div className="container px-4 py-12 mx-auto max-w-4xl">
          <div className="bg-muted/30 border border-red-500/20 rounded-lg p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-white mb-2">Something went wrong</h2>
            <p className="text-zinc-400 mb-6">{error}</p>
            <Button asChild>
              <Link href="/browse">
                Browse Other Stories
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }
  
  // No story found
  if (!story) {
    return (
      <main className="min-h-screen">
        <div className="container px-4 py-12 mx-auto max-w-4xl">
          <div className="bg-muted/30 border border-white/10 rounded-lg p-12 text-center">
            <FileText className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-white mb-2">Story Not Found</h2>
            <p className="text-zinc-400 mb-6">The story you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/browse">
                Browse Available Stories
              </Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen">
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/browse" className="hover:text-cyan-400 transition-colors">Browse</Link>
            <span>/</span>
            <span className="text-zinc-300">{story.title}</span>
          </div>
          
          <Link href="/browse" className="inline-flex items-center text-sm text-zinc-400 hover:text-cyan-400 transition-colors mb-4">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to all stories
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {story.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-3 md:gap-6 text-sm mb-6">
            <div className="px-3 py-1 bg-white/5 rounded-full text-cyan-300 border border-cyan-500/20 flex items-center">
              <Zap className="h-3 w-3 mr-1" />
              {story.industry}
            </div>
            
            <div className="px-3 py-1 bg-white/5 rounded-full text-cyan-300 border border-cyan-500/20 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {story.fundingAmount}
            </div>
            
            <div className="px-3 py-1 bg-white/5 rounded-full text-cyan-300 border border-cyan-500/20 flex items-center">
              <Flame className="h-3 w-3 mr-1" />
              {story.failureReason}
            </div>
            
            <div className="text-zinc-400">
              <span className="mr-4">{story.companyName}</span>
              <span className="mr-4">•</span>
              <span className="mr-4">{story.date}</span>
              <span>{story.readTime}</span>
            </div>
          </div>
        </div>
        
        {/* Story content */}
        <div className="bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 md:p-8 mb-8">
          <div className="prose prose-invert prose-cyan max-w-none">
            <div dangerouslySetInnerHTML={{ __html: story.contentHtml }} />
          </div>
        </div>
        
        {/* Engagement footer */}
        <div className="bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Button 
              variant={upvoted ? "default" : "outline"}
              size="sm"
              className={upvoted ? "cursor-default" : ""}
              onClick={handleUpvote}
              disabled={upvoting || upvoted}
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              {upvoted ? "Upvoted" : "Upvote"} • {story.upvotes}
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-3 text-zinc-400 text-sm">
            <span>Help others learn from your failures</span>
            <Button asChild size="sm">
              <Link href="/submit">
                Share Your Story
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}