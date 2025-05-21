import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MoveUpRight, Sparkles, Zap, TrendingUp, Flame, PieChart } from 'lucide-react';
import { HeroSection } from '@/components/home/hero-section';
import RecentStories from '@/components/home/recent-stories';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Lamp Effect */}
      <HeroSection />

      {/* Value Proposition - Respecting Miller's Law with limited options */}
      <section className="w-full py-20 md:py-28">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-secondary">Why Share Your Failure?</h2>
            <p className="mx-auto max-w-[700px] text-zinc-400 md:text-xl">
              Transforming startup failures into collective wisdom for the ecosystem.
            </p>
          </div>
          {/* Law of Common Region - Grouping achieved via spacing and background */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-b from-muted/50 to-muted/30 border-primary/20 card-animated">
              <CardHeader>
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-primary/10 mb-3">
                  <Flame className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-white">Help Others Avoid Mistakes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  Your experience can help founders avoid common pitfalls and make better decisions.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-b from-muted/50 to-muted/30 border-secondary/20 card-animated">
              <CardHeader>
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-secondary/10 mb-3">
                  <Sparkles className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle className="text-white">Process Your Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  Writing about failure is therapeutic and helps you understand what went wrong and why.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-b from-muted/50 to-muted/30 border-accent/20 card-animated">
              <CardHeader>
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-accent/10 mb-3">
                  <TrendingUp className="h-5 w-5 text-accent" />
                </div>
                <CardTitle className="text-white">Connect With Others</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400">
                  Join a community of resilient entrepreneurs who understand the startup journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Stories - Jakob's Law with familiar card patterns */}
      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-white to-accent">Recent Post-Mortems</h2>
              <p className="mt-2 text-zinc-400">
                Learn from the latest shared experiences and analyses.
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/browse">
                View All Stories
                <MoveUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <RecentStories />
        </div>
      </section>

      {/* CTA - Peak-End Rule with strong final call to action */}
      <section className="w-full py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 backdrop-blur-3xl"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-lg rounded-full px-4 py-1 text-sm border border-white/10 mb-4">
            <span className="text-white">Join hundreds of founders who've shared their stories</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-secondary">Ready to Share Your Story?</h2>
          <p className="max-w-[700px] text-zinc-300 md:text-xl">
            If you're no longer pursuing an idea, why not share it with lessons learned? 
            Speed up the ideation process for others in the ecosystem.
          </p>
          {/* Von Restorff Effect - vibrant button for primary action */}
          <Button asChild size="lg" className="mt-4">
            <Link href="/submit">
              <Sparkles className="mr-2 h-4 w-4" />
              Submit Your Post-Mortem
            </Link>
          </Button>
        </div>
      </section>


    </main>
  );
}
