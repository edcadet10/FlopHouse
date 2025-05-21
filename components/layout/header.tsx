"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Auth0Button from "@/components/auth/auth0-button"
import { useUser } from '@auth0/nextjs-auth0/client'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isLoading } = useUser();
  
  return (
    <header className="py-4 border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
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
            <div className="ml-2">
              <Auth0Button mode="button" />
            </div>
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
              <div className="py-2 px-4">
                <Auth0Button mode="button" />
              </div>
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
