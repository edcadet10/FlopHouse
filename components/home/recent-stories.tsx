"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Zap, PieChart } from "lucide-react"

// Define the Story type
type Story = {
  id: string
  title: string
  companyName: string
  industry: string
  fundingAmount: string
  failureReason: string
  summary: string
  date: string
  readTime: string
  upvotes: number
  slug: string
}

export default function RecentStories() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        const response = await fetch('/.netlify/functions/get-stories?limit=3')
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        setStories(data.stories || [])
        setError(null)
      } catch (err) {
        console.error("Failed to fetch stories:", err)
        setError("Failed to load recent stories")
        setStories([]) // Empty array on error
      } finally {
        setLoading(false)
      }
    }
    
    fetchStories()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden h-full bg-muted/50 backdrop-blur-sm border-white/10 animate-pulse">
            <CardHeader>
              <div className="h-6 w-32 bg-white/10 rounded mb-4"></div>
              <div className="h-8 w-full bg-white/10 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-24 w-full bg-white/10 rounded"></div>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-white/10">
              <div className="h-4 w-24 bg-white/10 rounded"></div>
              <div className="h-4 w-24 bg-white/10 rounded"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <p className="text-zinc-400">Please try again later.</p>
      </div>
    )
  }

  // No stories found
  if (stories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-400 mb-4">No stories found.</p>
        <p className="text-zinc-400">
          <Link href="/submit" className="text-cyan-400 hover:underline">Submit your story</Link> to be the first!
        </p>
      </div>
    )
  }

  // Display actual stories
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story) => (
        <Link href={`/story/${story.slug}`} key={story.id} className="group">
          <Card className="overflow-hidden h-full bg-muted/50 backdrop-blur-sm border-white/10 hover-scale card-animated">
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 mb-2">
                <div className="bg-cyan-500/10 text-cyan-400 rounded-full px-2 py-0.5 text-xs flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  <span>{story.industry}</span>
                </div>
                <div className="bg-cyan-500/10 text-cyan-400 rounded-full px-2 py-0.5 text-xs flex items-center">
                  <PieChart className="h-3 w-3 mr-1" />
                  <span>{story.fundingAmount}</span>
                </div>
              </div>
              <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">
                {story.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-400">
                {story.summary || "A fascinating post-mortem of a startup journey."}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t border-white/10 text-sm">
              <div className="text-zinc-500">{story.date}</div>
              <div className="text-zinc-400 flex items-center">
                <Flame className="h-3 w-3 mr-1 text-cyan-400" />
                {story.readTime}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
