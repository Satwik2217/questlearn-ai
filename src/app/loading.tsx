"use client";

import { motion } from "framer-motion";
import { Sword, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated sword */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex h-24 w-24 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/20"
        >
          <motion.div
            animate={{
              filter: [
                "drop-shadow(0 0 8px rgba(139,92,246,0.4))",
                "drop-shadow(0 0 20px rgba(139,92,246,0.8))",
                "drop-shadow(0 0 8px rgba(139,92,246,0.4))",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sword className="h-12 w-12 text-primary" />
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <div className="text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="game-text mb-2 text-xl font-bold text-foreground"
          >
            Preparing Your Adventure
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            Loading resources and generating content...
          </motion.p>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -8, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
              className="h-3 w-3 rounded-full bg-primary"
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="h-2 w-64 overflow-hidden rounded-full bg-card">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
          />
        </div>

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute"
          >
            <Sparkles className="h-4 w-4 text-accent" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
