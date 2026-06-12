"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
  UserPlus,
  ShieldCheck,
  Shield,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
  icon: typeof ShieldCheck;
} {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-danger", icon: ShieldAlert };
  if (score <= 4) return { score, label: "Medium", color: "bg-accent", icon: Shield };
  return { score, label: "Strong", color: "bg-success", icon: ShieldCheck };
}

export function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: name,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        toast.error(signUpError.message);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await (supabase as any)
          .from("profiles")
          .insert([
            {
              user_id: authData.user.id,
              display_name: name,
              character_type: "explorer",
              role: "student",
              total_xp: 0,
              level: 1,
              coins: 0,
              streak_days: 0,
              last_active: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }
      }

      toast.success("Account created! Welcome to QuestLearn AI!");
      router.push("/onboarding");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const { error: oAuthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oAuthError) {
        toast.error(oAuthError.message);
        setGoogleLoading(false);
      }
    } catch {
      toast.error("Failed to sign up with Google");
      setGoogleLoading(false);
    }
  };

  const StrengthIcon = passwordStrength.icon;

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <User className="size-4 text-primary" />
          Display Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-4 py-3 pl-11 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
          disabled={loading}
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Mail className="size-4 text-primary" />
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-4 py-3 pl-11 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
          disabled={loading}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Lock className="size-4 text-primary" />
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-4 py-3 pl-11 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
            disabled={loading}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {password && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <StrengthIcon
                className={cn(
                  "size-4",
                  passwordStrength.score <= 2
                    ? "text-danger"
                    : passwordStrength.score <= 4
                      ? "text-accent"
                      : "text-success"
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  passwordStrength.score <= 2
                    ? "text-danger"
                    : passwordStrength.score <= 4
                      ? "text-accent"
                      : "text-success"
                )}
              >
                {passwordStrength.label}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                className={cn("h-full rounded-full transition-all", passwordStrength.color)}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Lock className="size-4 text-primary" />
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          className="w-full bg-slate-800/60 border border-slate-600/50 rounded-lg px-4 py-3 pl-11 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
          disabled={loading}
          autoComplete="new-password"
        />
        {confirmPassword && password !== confirmPassword && (
          <p className="text-xs text-danger mt-1">Passwords do not match</p>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-2"
        >
          {error}
        </motion.p>
      )}

      <Button
        type="submit"
        variant="game-primary"
        size="xl"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            <UserPlus className="size-5" />
            Create Account
          </>
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-600/50" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-slate-900 px-4 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="xl"
        className="w-full"
        onClick={handleGoogleSignUp}
        disabled={googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <svg className="size-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Sign up with Google
      </Button>
    </form>
  );
}
