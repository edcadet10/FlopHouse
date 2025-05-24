"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  return (
    <header className="py-4 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/flop-houselogo.png" 
              alt="FlopHouse Logo" 
              width={32} 
              height={32}
              className="rounded-full"
            />
            <span className="text-white font-bold text-lg">FlopHouse</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/browse" className="text-zinc-400 hover:text-white transition-colors">
              Browse Stories
            </Link>
            <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-zinc-400 hover:text-white transition-colors">
              Contact
            </Link>
            <Button asChild>
              <Link href="/submit">
                Share Your Story
              </Link>
            </Button>
          </nav>
          
          {/* Mobile Navigation Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2 animate-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/" 
                className="py-2 px-4 rounded-md hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/browse" 
                className="py-2 px-4 rounded-md hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Stories
              </Link>
              <Link 
                href="/about" 
                className="py-2 px-4 rounded-md hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="py-2 px-4 rounded-md hover:bg-white/5 text-zinc-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Button 
                className="mt-2" 
                onClick={() => setIsMenuOpen(false)}
                asChild
              >
                <Link href="/submit">
                  Share Your Story
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
