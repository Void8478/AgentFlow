"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { GoogleIcon, GithubAuthIcon } from "@/components/common/AuthIcons";
import { Sparkles, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function RegisterFormContent() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/studio`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      if (data.session) {
        router.push("/studio");
        router.refresh();
      } else {
        setSuccess(
          "Account created successfully! Check your inbox for confirmation link."
        );
        setLoading(false);
      }
    }
  };

  const handleOAuthSignUp = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    setError(null);

    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/studio`,
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
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[160px] pointer-events-none" />

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
        <h1 className="text-xl font-bold text-slate-100">Create Your Account</h1>
        <p className="text-xs text-slate-400 mt-1">
          Start orchestrating autonomous AI agent swarms in minutes.
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

        {success && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuthSignUp("google")}
            disabled={loading || !!oauthLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {oauthLoading === "google" ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
            ) : (
              <GoogleIcon className="w-4 h-4" />
            )}
            <span>Sign Up with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignUp("github")}
            disabled={loading || !!oauthLoading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {oauthLoading === "github" ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-300" />
            ) : (
              <GithubAuthIcon className="w-4 h-4" />
            )}
            <span>Sign Up with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-[#0c0e14] text-[11px] font-mono text-slate-500 uppercase">
            Or Register With Email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password (6+ characters)
            </label>
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
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080a] flex items-center justify-center text-slate-400 text-xs">
          Loading authentication engine...
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
