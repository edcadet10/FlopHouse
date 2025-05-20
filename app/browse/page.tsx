"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, Filter, Zap, PieChart, TrendingUp, Flame, MoveUpRight, Sparkles } from "lucide-react"

export default function BrowsePage() {
  // State for stories
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter state
  const [industryFilter, setIndustryFilter] = useState("all")
  const [reasonFilter, setReasonFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        const response = await fetch("/.netlify/functions/get-stories")
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }
        
        const data = await response.json()
        setStories(data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch stories:", err)
        setError("Failed to load stories. Please try again later.")
        // Fall back to mock data in case of error
        setStories(mockFailures)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStories()
  }, [])

  // Mock data as fallback
  const mockFailures = [
    {
      id: 1,
      title: "TaskMaster: What Went Wrong",
      companyName: "TaskMaster Inc.",
      industry: "SaaS",
      fundingAmount: "$1.2M",
      failureReason: "Lack of Product-Market Fit",
      summary: "A deep dive into how we misunderstood the market need and built features nobody wanted.",
      date: "3 days ago",
      readTime: "5 min read",
      upvotes: 24
    },
    {
      id: 2,
      title: "CodeBuddy: Our Journey to Shutdown",
      companyName: "CodeBuddy",
      industry: "Developer Tools",
      fundingAmount: "$800K",
      failureReason: "Business Model",
      summary: "We built a great product that developers loved, but our business model couldn't sustain growth.",
      date: "1 week ago",
      readTime: "7 min read",
      upvotes: 56
    },
    {
      id: 3,
      title: "LaunchNow: The No-Code Platform That Failed",
      companyName: "LaunchNow",
      industry: "No-Code",
      fundingAmount: "$3.5M",
      failureReason: "Competition",
      summary: "Our no-code platform gained early traction but failed to convert free users to paying customers.",
      date: "2 weeks ago",
      readTime: "6 min read",
      upvotes: 38
    }
  ]

  // Industry filter options
  const industries = [
    { value: "all", label: "All Industries" },
    { value: "SaaS", label: "SaaS" },
    { value: "Developer Tools", label: "Developer Tools" },
    { value: "No-Code", label: "No-Code" },
    { value: "Logistics", label: "Logistics" },
    { value: "Health & Fitness", label: "Health & Fitness" },
    { value: "EdTech", label: "EdTech" },
  ]

  // Failure reason filter options
  const failureReasons = [
    { value: "all", label: "All Reasons" },
    { value: "Lack of Product-Market Fit", label: "Lack of Product-Market Fit" },
    { value: "Business Model", label: "Business Model" },
    { value: "Competition", label: "Competition" },
    { value: "Cash Flow", label: "Cash Flow" },
    { value: "User Acquisition", label: "User Acquisition" },
    { value: "Sales Cycle", label: "Sales Cycle" },
  ]

  // Sort options
  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "popular", label: "Most Popular" },
    { value: "funding", label: "Highest Funding" },
  ]
  
  // Apply filters and sorting
  const filteredStories = stories
    .filter(story => {
      // Apply industry filter
      if (industryFilter !== "all" && story.industry !== industryFilter) return false
      
      // Apply failure reason filter
      if (reasonFilter !== "all" && story.failureReason !== reasonFilter) return false
      
      // Apply search filter
      if (searchQuery && !story.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !story.companyName.toLowerCase().includes(searchQuery.toLowerCase())) return false
      
      return true
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "newest") {
        // Newer items first (in this mock data, lower IDs are newer)
        return a.id - b.id
      } else if (sortBy === "popular") {
        // Higher upvotes first
        return b.upvotes - a.upvotes
      } else if (sortBy === "funding") {
        // Extract numeric funding value (remove $ and M/K)
        const aFunding = parseFloat(a.fundingAmount.replace('$', '').replace('M', '')) * (a.fundingAmount.includes('M') ? 1000000 : (a.fundingAmount.includes('K') ? 1000 : 1))
        const bFunding = parseFloat(b.fundingAmount.replace('$', '').replace('M', '')) * (b.fundingAmount.includes('M') ? 1000000 : (b.fundingAmount.includes('K') ? 1000 : 1))
        return bFunding - aFunding
      }
      return 0
    })

  return (
    <main className="min-h-screen">
      <div className="container px-4 py-12 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-300">Browse Stories</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-secondary">
            Failed Startup Stories
          </h1>
          <p className="text-zinc-400">
            Explore post-mortems from founders who've been through startup failure and lived to tell the tale.
          </p>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="bg-muted/30 border border-red-500/20 rounded-lg p-6 text-center">
            <Sparkles className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Something went wrong</h3>
            <p className="text-zinc-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Filters Section - Applying Hick's Law by organizing choices */}
            <div className="bg-muted/30 border border-white/10 rounded-lg p-6 mb-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by title or company name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  />
                  <Search 
                    className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" 
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {isFiltersOpen ? "Hide Filters" : "Show Filters"}
                  </Button>
                  
                  {/* Sort - Applying Fitts's Law with accessible dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-400">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="h-10 px-3 py-2 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Filter Pills - Applying Miller's Law with limited options */}
              {isFiltersOpen && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex flex-wrap gap-3">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-zinc-300 flex items-center">
                        <Zap className="h-3 w-3 mr-1 text-cyan-500" />
                        Industry:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {industries.map(industry => (
                          <button
                            key={industry.value}
                            onClick={() => setIndustryFilter(industry.value)}
                            className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                              industryFilter === industry.value 
                                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                                : 'bg-white/5 text-zinc-400 hover:bg-cyan-500/10 hover:text-cyan-300'
                            }`}
                          >
                            {industry.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-zinc-300 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1 text-cyan-500" />
                        Failure Reason:
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {failureReasons.map(reason => (
                          <button
                            key={reason.value}
                            onClick={() => setReasonFilter(reason.value)}
                            className={`px-3 py-1 text-sm rounded-full transition-all duration-300 ${
                              reasonFilter === reason.value 
                                ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                                : 'bg-white/5 text-zinc-400 hover:bg-cyan-500/10 hover:text-cyan-300'
                            }`}
                          >
                            {reason.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results - Jakob's Law with familiar card patterns */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  <span className="inline-flex items-center justify-center w-8 h-8 mr-2 bg-cyan-500 rounded-full text-white">
                    {filteredStories.length}
                  </span>
                  {filteredStories.length === 1 ? 'Story' : 'Stories'} Found
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <Link href={`/story/${story.id}`} key={story.id} className="group">
                    <Card className="overflow-hidden h-full bg-muted/50 backdrop-blur-sm border-white/10 hover-scale card-animated">
                      <CardHeader>
                        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
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
                          {story.summary}
                        </p>
                        <div className="mt-4 inline-block px-3 py-1 bg-white/5 rounded-full text-xs text-cyan-300 border border-cyan-500/20">
                          {story.failureReason}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t border-white/10 text-sm">
                        <div className="text-zinc-500">{story.date}</div>
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-400 flex items-center">
                            <Flame className="h-3 w-3 mr-1 text-cyan-400" />
                            {story.readTime}
                          </span>
                          <span className="flex items-center text-zinc-400">
                            <TrendingUp className="h-3 w-3 mr-1 text-cyan-400" />
                            {story.upvotes}
                          </span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredStories.length === 0 && (
              <div className="text-center py-16 bg-muted/30 rounded-lg border border-white/10 backdrop-blur-sm">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-white/5 mb-4 animate-pulse">
                  <Sparkles className="h-8 w-8 text-cyan-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No Stories Found</h3>
                <p className="text-zinc-400 max-w-md mx-auto mb-6">
                  We couldn't find any stories matching your filters. Try adjusting your search criteria.
                </p>
                <Button 
                  onClick={() => {
                    setIndustryFilter("all")
                    setReasonFilter("all")
                    setSearchQuery("")
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Pagination - Applying Fitts's Law with large, well-spaced controls */}
            {filteredStories.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="h-10 w-10 p-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </Button>
                  <Button className="h-10 w-10 p-0">1</Button>
                  <Button variant="outline" className="h-10 w-10 p-0">2</Button>
                  <Button variant="outline" className="h-10 w-10 p-0">3</Button>
                  <Button variant="outline" className="h-10 w-10 p-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}