"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { Button } from "@/components/ui/button";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <LampContainer color="cyan" className="min-h-[90vh]">
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="bg-gradient-to-br from-white to-white/80 py-4 bg-clip-text text-center text-5xl font-bold tracking-tight text-transparent md:text-7xl max-w-5xl"
      >
        Transform Failed Startups <br /> Into Valuable Lessons
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.5,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 max-w-xl text-center text-zinc-300 md:text-xl"
      >
        A community-driven platform for sharing and learning
        from startup failures. Turn your setbacks into
        stepping stones for the ecosystem.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.7,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex flex-col sm:flex-row gap-4 mt-12"
      >
        <Button 
          size="lg" 
          asChild
        >
          <Link href="/browse">
            <span>Browse Stories</span>
            <MoveUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          asChild
        >
          <Link href="/submit">
            Share Your Story
          </Link>
        </Button>
      </motion.div>
    </LampContainer>
  );
}
