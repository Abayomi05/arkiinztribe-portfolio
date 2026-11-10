"use client";

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data?.error?.message || "Sign in failed");
      } else {
        window.location.href = "/dashboard";
      }
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
      <div className="w-full max-w-md glass rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Neon accent corner */}
        <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-[var(--neon-purple)] via-[var(--neon-cyan)] to-[var(--neon-pink)]" />

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Welcome back</h1>
          <p className="text-[var(--muted)]">
            Sign in to your ARKIINZTRIBE account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text)]">
              Email address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)] transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[var(--text)]">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[var(--surface)] border border-[var(--line)] rounded-xl text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-cyan)] transition-all"
                required
              />
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[var(--neon-purple)] via-[var(--neon-cyan)] to-[var(--neon-pink)] text-white font-bold rounded-xl shadow-lg hover:shadow-[var(--neon-purple-glow)] hover:shadow-[var(--neon-cyan-glow)] transition-all disabled:opacity-70"
          >
            <ArrowRight className="w-5 h-5" /> Sign in
          </button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[var(--line)]"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider">
              <span className="px-4 bg-[var(--surface)] text-[var(--muted)]">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              className="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--line)] rounded-xl bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
              onClick={() => {
                window.location.href = "/api/auth/sign-in/google";
              }}
            >
              Google
            </button>
            <button
              className="flex items-center justify-center gap-2 px-4 py-3 border border-[var(--line)] rounded-xl bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] transition-all"
              onClick={() => {
                window.location.href = "/api/auth/sign-in/github";
              }}
            >
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-[var(--muted)]">
          Don't have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="text-[var(--neon-cyan)] hover:text-[var(--neon-pink)] font-semibold transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}