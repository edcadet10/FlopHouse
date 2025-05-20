"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { TrendingUp, Zap, ArrowLeft, FileText, Flame, ThumbsUp, AlertCircle } from "lucide-react"

// Story interface
interface Story {
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

export default function StoryPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<Story | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [upvoting, setUpvoting] = useState(false)
  const [upvoted, setUpvoted] = useState(false)
  
  useEffect(() => {
    // Function to fetch the story
    const fetchStory = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/.netlify/functions/get-story/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Story not found")
          }
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        setStory(data)
        setError(null)
      } catch (err: any) {
        console.error("Failed to fetch story:", err)
        setError(err.message || "Failed to load story. Please try again later.")
        setStory(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStory()
    
    // Check if user has upvoted this story before
    const upvotedStories = localStorage.getItem('upvotedStories')
    if (upvotedStories) {
      const upvotedList = JSON.parse(upvotedStories)
      setUpvoted(upvotedList.includes(params.id))
    }
  }, [params.id])
  
  // Handle upvote
  const handleUpvote = async () => {
    if (upvoted || !story) return
    
    setUpvoting(true)
    
    try {
      const response = await fetch('/.netlify/functions/upvote-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ storyId: story.id })
      })
      
      if (!response.ok) {
        throw new Error('Failed to upvote')
      }
      
      // Update local state
      setStory(prev => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null)
      setUpvoted(true)
      
      // Store in localStorage to prevent multiple upvotes
      const upvotedStories = localStorage.getItem('upvotedStories')
      const upvotedList = upvotedStories ? JSON.parse(upvotedStories) : []
      localStorage.setItem('upvotedStories', JSON.stringify([...upvotedList, story.id]))
      
    } catch (err) {
      console.error('Error upvoting:', err)
    } finally {
      setUpvoting(false)
    }
  }
  
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
    )
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
    )
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
    )
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
  )
}