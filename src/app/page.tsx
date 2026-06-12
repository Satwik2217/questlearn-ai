"use client";

import { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Sword,
  Sparkles,
  BookOpen,
  Trophy,
  Users,
  Zap,
  Globe,
  Shield,
  Star,
  ChevronRight,
  Play,
  Menu,
  X,
  ArrowRight,
  GraduationCap,
  ScrollText,
  Swords,
  Gem,
} from "lucide-react";
import Link from "next/link";

const worlds = [
  { name: "Math World", icon: Calculator, color: "#6366f1", description: "Numbers & Equations" },
  { name: "Science World", icon: Flask, color: "#22c55e", description: "Experiments & Discovery" },
  { name: "English Kingdom", icon: BookOpen, color: "#f59e0b", description: "Literature & Language" },
  { name: "History Empire", icon: Landmark, color: "#ef4444", description: "Civilizations & Events" },
  { name: "Geography Realm", icon: Globe, color: "#06b6d4", description: "Continents & Cultures" },
];

const features = [
  { icon: Sword, title: "Boss Battles", description: "Test your knowledge in epic boss fights" },
  { icon: Sparkles, title: "AI-Powered", description: "Personalized learning paths" },
  { icon: Trophy, title: "Achievements", description: "Unlock rewards and collect items" },
  { icon: Users, title: "Multiplayer", description: "Compete with friends on leaderboards" },
  { icon: Zap, title: "Daily Quests", description: "Fresh challenges every day" },
  { icon: BookOpen, title: "Knowledge Map", description: "Visual progress tracking" },
];

const stats = [
  { value: "10,000+", label: "Active Students" },
  { value: "50,000+", label: "Quests Completed" },
  { value: "95%", label: "Improvement Rate" },
  { value: "5+", label: "Subjects Available" },
];

function Calculator() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="8" x2="8" y1="10" y2="10" />
      <line x1="12" x2="12" y1="10" y2="10" />
      <line x1="16" x2="16" y1="10" y2="10" />
      <line x1="8" x2="16" y1="14" y2="14" />
      <line x1="8" x2="8" y1="17" y2="17" />
      <line x1="12" x2="12" y1="17" y2="17" />
      <line x1="16" x2="16" y1="17" y2="17" />
    </svg>
  );
}

function Flask() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.24A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.8l5.51-10.24A2 2 0 0 0 10 8V2" />
      <path d="M6.453 15h11.094" />
      <path d="M8 2h8" />
    </svg>
  );
}

function Landmark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 10 12 2 21 10" />
      <line x1="3" x2="3" y1="10" y2="20" />
      <line x1="21" x2="21" y1="10" y2="20" />
      <line x1="2" x2="22" y1="20" y2="20" />
      <line x1="9" x2="9" y1="14" y2="18" />
      <line x1="12" x2="12" y1="13" y2="18" />
      <line x1="15" x2="15" y1="14" y2="18" />
    </svg>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Sword className="h-6 w-6 text-primary" />
            <span className="game-text text-lg font-bold text-foreground">
              QuestLearn AI
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#worlds" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Worlds
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </Link>
            <Link href="#stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Stats
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-foreground md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 top-16 z-40 border-b border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-4 p-6">
              <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-foreground transition-colors hover:bg-card">
                Features
              </Link>
              <Link href="#worlds" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-foreground transition-colors hover:bg-card">
                Worlds
              </Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-foreground transition-colors hover:bg-card">
                How It Works
              </Link>
              <Link href="#stats" onClick={() => setMobileMenuOpen(false)} className="rounded-lg px-4 py-3 text-foreground transition-colors hover:bg-card">
                Stats
              </Link>
              <hr className="border-border" />
              <Link
                href="/login"
                className="rounded-lg px-4 py-3 text-center text-foreground transition-colors hover:bg-card"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-4 py-3 text-center font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.section
        style={{ opacity, scale }}
        className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16"
      >
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/5 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 left-10 hidden text-primary/20 lg:block"
          >
            <Sword className="h-16 w-16" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 right-10 hidden text-accent/20 lg:block"
          >
            <Shield className="h-16 w-16" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 right-1/4 hidden text-secondary/20 lg:block"
          >
            <Star className="h-12 w-12" />
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary"
          >
            <Sparkles className="h-4 w-4" />
            AI-Powered Gamified Learning
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="game-text mb-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            QuestLearn{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-4 text-xl font-semibold text-accent sm:text-2xl"
          >
            Learn Through Adventure
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground"
          >
            Transform your education into an epic RPG adventure. Master subjects through
            quests, defeat knowledge bosses, and unlock achievements along the way.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Link
              href="/signup"
              className="group inline-flex h-14 items-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/50 hover:scale-105"
            >
              Start Learning Free
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-14 items-center gap-2 rounded-xl border border-border bg-card px-8 text-lg font-semibold text-foreground shadow-lg transition-all hover:bg-card/80 hover:border-primary/50"
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </Link>
          </motion.div>

          {/* Animated characters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 flex items-center justify-center gap-4"
          >
            {["knight", "wizard", "ninja", "archer"].map((character, i) => (
              <motion.div
                key={character}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                className="flex h-16 w-16 items-center justify-center rounded-xl border border-border bg-card sm:h-20 sm:w-20"
              >
                <CharacterIcon type={character} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            <h2 className="game-text mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Epic Learning Features
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to make learning an adventure
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            <h2 className="game-text mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Three simple steps to start your learning adventure
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Globe,
                title: "Choose Your Path",
                description: "Select your subject and board. Whether it's Math, Science, or History, embark on a quest tailored to your curriculum.",
                color: "from-primary/20 to-primary/5",
              },
              {
                step: "02",
                icon: ScrollText,
                title: "Learn Through Quests",
                description: "Complete interactive levels, solve challenges, and earn XP. Each quest brings you closer to mastery.",
                color: "from-secondary/20 to-secondary/5",
              },
              {
                step: "03",
                icon: Swords,
                title: "Master with Boss Battles",
                description: "Face epic boss battles at the end of each chapter. Answer questions to deal damage and prove your knowledge.",
                color: "from-accent/20 to-accent/5",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative rounded-xl border border-border bg-card p-8 text-center"
              >
                <div className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}>
                  <item.icon className="h-10 w-10 text-foreground" />
                </div>
                <div className="game-text mb-2 text-sm text-primary">{item.step}</div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Worlds Preview */}
      <section id="worlds" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 text-center"
          >
            <h2 className="game-text mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Explore Worlds
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Choose your realm and begin your adventure
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {worlds.map((world, i) => (
              <motion.div
                key={world.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group cursor-pointer rounded-xl border border-border bg-card p-6 text-center transition-all hover:scale-105 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
              >
                <div
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${world.color}20`, color: world.color }}
                >
                  <world.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{world.name}</h3>
                <p className="text-xs text-muted-foreground">{world.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border bg-card p-8 text-center"
              >
                <div className="game-text mb-2 text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-secondary/10 p-12 shadow-2xl shadow-primary/10"
          >
            <Gem className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h2 className="game-text mb-4 text-3xl font-bold text-foreground sm:text-4xl">
              Ready to Begin Your Quest?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join thousands of students already learning through adventure
            </p>
            <Link
              href="/signup"
              className="group inline-flex h-14 items-center gap-2 rounded-xl bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/50 hover:scale-105"
            >
              Start Your Adventure
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Sword className="h-5 w-5 text-primary" />
                <span className="game-text font-bold text-foreground">QuestLearn AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Learn Through Adventure
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Platform</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/worlds" className="hover:text-foreground">Worlds</Link>
                <Link href="/leaderboard" className="hover:text-foreground">Leaderboard</Link>
                <Link href="/achievements" className="hover:text-foreground">Achievements</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Resources</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-foreground">Documentation</Link>
                <Link href="#" className="hover:text-foreground">API</Link>
                <Link href="#" className="hover:text-foreground">Support</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="hover:text-foreground">Terms of Service</Link>
                <Link href="#" className="hover:text-foreground">Cookie Policy</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} QuestLearn AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function CharacterIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    knight: <Shield className="h-8 w-8 text-red-400" />,
    wizard: <Sparkles className="h-8 w-8 text-purple-400" />,
    ninja: <Sword className="h-8 w-8 text-slate-300" />,
    archer: <Star className="h-8 w-8 text-green-400" />,
  };
  return <>{icons[type]}</>;
}
