"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (resetErr) {
      setError(resetErr.message);
    } else {
      setSuccess("Password reset instructions have been sent to your email.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#07080a] text-slate-100 flex flex-col justify-center items-center px-4 relative overflow-hidden bg-grid-pattern">
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
        <h1 className="text-xl font-bold text-slate-100">Reset Your Password</h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter your email to receive password reset instructions.
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

        <form onSubmit={handleResetRequest} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Registered Email Address
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
