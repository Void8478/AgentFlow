"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  User as UserIcon,
  Mail,
  ShieldCheck,
  Calendar,
  LogOut,
  ArrowLeft,
  Sparkles,
  Key,
  Layers,
  Loader2,
} from "lucide-react";
import { GoogleIcon, GithubAuthIcon } from "@/components/common/AuthIcons";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) {
        router.push("/login?redirectTo=/profile");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    }
    loadUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080a] flex flex-col items-center justify-center text-slate-400 text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mb-2" />
        <span>Loading user profile session...</span>
      </div>
    );
  }

  if (!user) return null;

  const provider = user.app_metadata?.provider || "email";
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Agent Developer";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen w-full bg-[#07080a] text-slate-100 p-4 sm:p-8 relative overflow-hidden bg-grid-pattern">
      {/* Background Accent */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[180px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Top Navbar */}
        <div className="flex items-center justify-between">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors glass-panel px-3 py-1.5 rounded-xl border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Studio Canvas</span>
          </Link>

          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-sm text-white">AgentFlow Profile</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xl text-white shadow-xl shadow-indigo-600/30 shrink-0">
                {initials}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  {fullName}
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Active Session
                  </span>
                </h1>
                <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="py-2 px-4 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {loggingOut ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span>Sign Out Session</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Auth Provider */}
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                Authentication Provider
              </span>
              <div className="flex items-center gap-2 text-sm font-semibold text-white pt-1">
                {provider === "google" && <GoogleIcon className="w-4 h-4" />}
                {provider === "github" && <GithubAuthIcon className="w-4 h-4" />}
                {provider === "email" && <Mail className="w-4 h-4 text-indigo-400" />}
                <span className="capitalize">{provider} Auth</span>
              </div>
            </div>

            {/* Created At */}
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Account Created
              </span>
              <p className="text-sm font-semibold text-white pt-1">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>

            {/* User ID */}
            <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-1 sm:col-span-2">
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Supabase User UUID
              </span>
              <p className="text-xs font-mono text-slate-300 break-all pt-1">
                {user.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
