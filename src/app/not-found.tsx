"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sword, Home, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const glitchText = "404 - Level Not Found";

export default function NotFound() {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Lost character animation */}
        <motion.div
          animate={{
            x: [0, 10, -10, 5, -5, 0],
            y: [0, -5, 5, -3, 3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-2xl border border-border bg-card"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sword className="h-16 w-16 text-primary/60" />
          </motion.div>
        </motion.div>

        {/* 404 with glitch effect */}
        <div className="relative mb-4">
          <motion.h1
            className={`game-text text-7xl font-bold text-primary sm:text-8xl ${glitch ? "opacity-0" : ""}`}
          >
            404
          </motion.h1>
          {glitch && (
            <motion.h1
              initial={{ x: -2 }}
              animate={{ x: 2 }}
              className="game-text absolute inset-0 text-7xl font-bold text-destructive sm:text-8xl"
            >
              404
            </motion.h1>
          )}
        </div>

        {/* Glitch text */}
        <p className={`game-text mb-2 text-xl text-foreground transition-all ${glitch ? "tracking-[0.2em] text-destructive" : "tracking-normal"}`}>
          {glitchText}
        </p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 text-muted-foreground"
        >
          This page seems to have wandered off the map. Even our bravest explorers
          couldn&apos;t find it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link href="/">
            <Button variant="game-primary" size="lg" className="gap-2">
              <Home className="h-5 w-5" />
              Return to Hub
            </Button>
          </Link>
          <Link href="/worlds">
            <Button variant="outline" size="lg" className="gap-2">
              <Search className="h-5 w-5" />
              Explore Worlds
            </Button>
          </Link>
        </motion.div>

        {/* Map decoration */}
        <div className="mt-12 flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.3, 1, 0.3], scale: 1 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="h-2 w-2 rounded-full bg-primary/50"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
