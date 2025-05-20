"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Users, BookOpen, Building, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="container px-4 py-12 mx-auto max-w-4xl">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-300">About</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-cyan-500">
            About FlopHouse
          </h1>
          <p className="text-zinc-400">
            Learn about our mission to transform startup failures into valuable lessons.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="md:w-2/3">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
              <p className="text-zinc-300 mb-4">
                FlopHouse was created to address a critical gap in entrepreneurial culture: 
                the reluctance to discuss and learn from failure. While success stories are 
                celebrated widely, the valuable lessons from failed ventures often remain hidden.
              </p>
              <p className="text-zinc-300 mb-4">
                We believe that by creating a space where founders can openly share their 
                post-mortems, we can collectively accelerate learning, reduce common mistakes, 
                and build a more resilient entrepreneurial ecosystem.
              </p>
              <p className="text-zinc-300">
                Our platform transforms individual setbacks into community wisdom, helping 
                the next generation of founders make better-informed decisions and increasing 
                their chances of success.
              </p>
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-4 rounded-lg border border-white/5">
                <Sparkles className="h-10 w-10 text-cyan-500 mb-2" />
                <h3 className="text-lg font-medium text-white mb-1">Transparency</h3>
                <p className="text-sm text-zinc-400">
                  Promoting open, honest discussions about startup failures.
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-4 rounded-lg border border-white/5">
                <Users className="h-10 w-10 text-cyan-500 mb-2" />
                <h3 className="text-lg font-medium text-white mb-1">Community</h3>
                <p className="text-sm text-zinc-400">
                  Building a supportive ecosystem for entrepreneurs.
                </p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-4 rounded-lg border border-white/5">
                <BookOpen className="h-10 w-10 text-cyan-500 mb-2" />
                <h3 className="text-lg font-medium text-white mb-1">Education</h3>
                <p className="text-sm text-zinc-400">
                  Turning individual experiences into collective knowledge.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Story Section */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Story</h2>
          <div className="flex flex-col gap-6">
            <p className="text-zinc-300">
              FlopHouse began as a simple thought shared on social media: "There should be an open 
              sourced list of failed startup ideas for others to grab." This spark of inspiration 
              quickly resonated with entrepreneurs who recognized the untapped value in startup 
              post-mortems.
            </p>
            <p className="text-zinc-300">
              Ideas are cheap, but execution is everything. Sometimes ideas fail not because they 
              were bad, but because of timing or team fit. If founders are no longer pursuing these 
              ideas, why not share them—along with lessons learned—to speed up the ideation process 
              for others?
            </p>
            <p className="text-zinc-300">
              This platform transforms individual setbacks into community wisdom. We believe 
              that by creating a space where founders can openly share their post-mortems, we 
              can collectively accelerate learning, reduce common mistakes, and build a more 
              resilient entrepreneurial ecosystem.
            </p>
          </div>
        </Card>

        {/* How It Works Section */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mb-4">
                <span className="text-2xl font-bold text-cyan-500">1</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Submit Your Story</h3>
              <p className="text-sm text-zinc-400">
                Share your startup's journey, what went wrong, and what you learned from the experience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mb-4">
                <span className="text-2xl font-bold text-cyan-500">2</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Review Process</h3>
              <p className="text-sm text-zinc-400">
                Our team reviews submissions to ensure they meet our community guidelines and contain valuable insights.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 mb-4">
                <span className="text-2xl font-bold text-cyan-500">3</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Share & Learn</h3>
              <p className="text-sm text-zinc-400">
                Approved stories are published on our platform, allowing the community to learn from shared experiences.
              </p>
            </div>
          </div>
        </Card>

        {/* Values Section */}
        <Card className="p-8 bg-muted/30 backdrop-blur-sm border border-white/10 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-cyan-500/10">
                <Sparkles className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Honesty & Transparency</h3>
                <p className="text-sm text-zinc-400">
                  We encourage candid sharing of what went wrong, without sugar-coating the reality.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-cyan-500/10">
                <Users className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Community Support</h3>
                <p className="text-sm text-zinc-400">
                  Creating a judgment-free space where entrepreneurs support each other.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-cyan-500/10">
                <Globe className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Global Perspective</h3>
                <p className="text-sm text-zinc-400">
                  Featuring stories from entrepreneurs worldwide, including Haiti and other regions with emerging startup ecosystems.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-cyan-500/10">
                <Building className="h-6 w-6 text-cyan-500" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Ecosystem Building</h3>
                <p className="text-sm text-zinc-400">
                  Contributing to stronger startup ecosystems through shared knowledge and experiences.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Call to Action */}
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Share Your Story?</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto mb-6">
            Your experience could help fellow entrepreneurs avoid the same pitfalls and build more successful ventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/submit">Share Your Story</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/browse">Browse Stories</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
