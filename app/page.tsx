import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { MoveUpRight, Sparkles, Zap, TrendingUp, Flame, PieChart } from 'lucide-react';
import { HeroSection } from '@/components/home/hero-section';

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
            <Button variant="ghost">
              View All Stories
              <MoveUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Link href={`/story/${i}`} key={i} className="group">
                <Card className="overflow-hidden h-full bg-muted/50 backdrop-blur-sm border-white/10 hover-scale card-animated">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mb-2">
                      <span>SaaS</span>
                      <span>•</span>
                      <span>Funding: $1.2M</span>
                    </div>
                    <CardTitle className="text-lg text-white group-hover:text-cyan-400 transition-colors">
                      {["TaskMaster", "CodeBuddy", "LaunchNow"][i-1]}: What Went Wrong
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-400">
                      {[
                        "A deep dive into how we misunderstood the market need and built features nobody wanted.",
                        "We built a great product that developers loved, but our business model couldn't sustain growth.",
                        "Our no-code platform gained early traction but failed to convert free users to paying customers."
                      ][i-1]}
                    </p>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-white/10 text-sm">
                    <div className="text-zinc-500">3 days ago</div>
                    <div className="text-zinc-400 flex items-center">
                      <Flame className="h-3 w-3 mr-1 text-cyan-400" />
                      5 min read
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
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
            Your transparency helps others learn. Turn your startup failure into valuable lessons for the community.
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

      {/* Footer */}
      <footer className="w-full py-6 border-t border-white/10 bg-gradient-to-b from-background to-background/80">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400"></div>
                <span className="text-xl font-bold ml-2 text-white">FlopHouse</span>
              </div>
              <span className="text-zinc-500">©2025</span>
            </div>
            <div className="flex gap-4 text-zinc-400">
              <Link href="/about" className="hover:text-cyan-400 transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
