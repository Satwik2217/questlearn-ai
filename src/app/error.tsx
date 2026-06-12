"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Game Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-destructive/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-lg text-center">
        {/* Error icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10"
        >
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </motion.div>

        {/* Error message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="game-text mb-2 text-4xl font-bold text-foreground sm:text-5xl"
        >
          Game Error
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-2 text-muted-foreground"
        >
          Something went wrong in this level. Our game masters have been notified.
        </motion.p>

        {error.digest && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 font-mono text-xs text-muted-foreground"
          >
            Error ID: {error.digest}
          </motion.p>
        )}

        {!error.digest && <div className="mb-8" />}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button
            variant="game-primary"
            size="lg"
            className="gap-2"
            onClick={() => reset()}
          >
            <RefreshCw className="h-5 w-5" />
            Restart Level
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="gap-2">
              <Home className="h-5 w-5" />
              Return to Hub
            </Button>
          </Link>
        </motion.div>

        {/* Screen glitch effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.03, 0, 0.02, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="pointer-events-none fixed inset-0 bg-destructive"
        />
      </div>
    </div>
  );
}
