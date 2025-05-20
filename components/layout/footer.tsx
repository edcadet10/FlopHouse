"use client"

import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()
  
  return (
    <footer className="mt-auto py-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-white font-bold">FlopHouse</span>
            <span className="text-zinc-500 text-sm">©{year}</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
            <Link href="/about" className="text-zinc-400 hover:text-cyan-400 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-zinc-400 hover:text-cyan-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-zinc-400 hover:text-cyan-400 transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-zinc-400 hover:text-cyan-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-zinc-500">
          <p>FlopHouse is a platform for sharing and learning from startup failures.</p>
          <p className="mt-1">By using this site, you agree to our <Link href="/terms" className="text-zinc-400 hover:text-cyan-400 transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-zinc-400 hover:text-cyan-400 transition-colors">Privacy Policy</Link>.</p>
        </div>
      </div>
    </footer>
  )
}
