"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GoogleIcon, GithubAuthIcon } from "@/components/common/AuthIcons";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/studio";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    urlError ? "Authentication session failed. Please try again." : null
  );

  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push(redirectTo);
      router.refresh();
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    setError(null);

    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          redirectTo
        )}`,
      },
    });

    if (oauthErr) {
      setError(oauthErr.message);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#07080a] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden bg-grid-pattern">
      {/* Glow Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[160px] pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center z-10">
        <Link href="/" className="inline-flex items-center gap-2.5 group mb-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-all">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            AgentFlow
          </span>
        </Link>
        <h1 className="text-xl font-bold text-slate-100">Welcome Back</h1>
        <p className="text-xs text-slate-400 mt-1">
          Sign in to access your visual AI multi-agent studio.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative z-10">
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthLogin("google")}
            disabled={loading || !!oauthLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {oauthLoading === "google" ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
            ) : (
              <GoogleIcon className="w-4 h-4" />
            )}
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin("github")}
            disabled={loading || !!oauthLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {oauthLoading === "github" ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
            ) : (
              <GithubAuthIcon className="w-4 h-4" />
            )}
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-[#0c0e14] text-[11px] font-mono text-slate-500 uppercase">
            Or Sign In With Email
          </span>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!oauthLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account yet?{" "}
          <Link
            href="/register"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080a] flex items-center justify-center text-slate-400 text-xs">
          Loading authentication engine...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
