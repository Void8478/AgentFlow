"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Workflow,
  History,
  Settings,
  Bot,
  Activity,
  Database,
  Sparkles,
  Radio,
} from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" aria-hidden="true" />,
      active: pathname === "/dashboard",
    },
    {
      label: "Visual Studio",
      href: "/studio",
      icon: <Workflow className="w-4 h-4 text-indigo-400" aria-hidden="true" />,
      active: pathname === "/studio",
    },
    {
      label: "Execution History",
      href: "/history",
      icon: <History className="w-4 h-4 text-purple-400" aria-hidden="true" />,
      active: pathname === "/history",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
      active: pathname === "/settings",
    },
  ];

  return (
    <aside
      className="w-64 glass-panel border-r border-white/10 flex flex-col h-full z-20 select-none"
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-indigo-500 rounded-xl"
          aria-label="AgentFlow Home"
        >
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-all">
            <Sparkles className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white block leading-none">
              AgentFlow
            </span>
            <span className="text-[10px] font-mono text-slate-400 mt-1 flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" aria-hidden="true" />
              Mission Control
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation items */}
      <nav aria-label="Main Navigation" className="p-3 space-y-1 flex-1 overflow-y-auto">
        <p className="text-[11px] font-mono font-medium text-slate-400 px-2 py-1 uppercase tracking-wider">
          Control Station
        </p>

        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-indigo-500 ${
              item.active
                ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm"
                : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-white/10 bg-black/20">
        <Link
          href="/profile"
          aria-label="Developer Profile and Account Settings"
          className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group focus-visible:outline-2 focus-visible:outline-indigo-500"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-200 font-bold text-xs">
            AF
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
              Developer Profile
            </h4>
            <p className="text-[10px] font-mono text-slate-400 truncate">Account Settings</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
