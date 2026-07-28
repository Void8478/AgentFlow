"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Workflow,
  Bot,
  User,
  ArrowRight,
  X,
  Plus,
  History,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandBar({ isOpen, onClose }: CommandBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const actions = [
    {
      id: "launch-studio",
      label: "Launch AI Flow Studio",
      category: "Navigation",
      icon: <Workflow className="w-4 h-4 text-indigo-400" aria-hidden="true" />,
      action: () => {
        router.push("/studio");
        onClose();
      },
    },
    {
      id: "create-flow",
      label: "Create New Agent Swarm DAG",
      category: "Actions",
      icon: <Plus className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
      action: () => {
        router.push("/studio");
        onClose();
      },
    },
    {
      id: "view-history",
      label: "View Execution History Logs",
      category: "Navigation",
      icon: <History className="w-4 h-4 text-purple-400" aria-hidden="true" />,
      action: () => {
        router.push("/history");
        onClose();
      },
    },
    {
      id: "open-settings",
      label: "Open System & Ollama Settings",
      category: "Configuration",
      icon: <Settings className="w-4 h-4 text-emerald-400" aria-hidden="true" />,
      action: () => {
        router.push("/settings");
        onClose();
      },
    },
    {
      id: "user-profile",
      label: "View Account & Session Profile",
      category: "Account",
      icon: <User className="w-4 h-4 text-amber-400" aria-hidden="true" />,
      action: () => {
        router.push("/profile");
        onClose();
      },
    },
  ];

  const filteredActions = actions.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? (filteredActions.length || 1) - 1 : prev - 1
        );
      } else if (e.key === "Enter" && filteredActions[selectedIndex]) {
        e.preventDefault();
        filteredActions[selectedIndex].action();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredActions, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette Modal"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl glass-panel rounded-2xl border border-white/15 shadow-2xl overflow-hidden bg-[#0a0c12]/95"
        >
          {/* Input Bar */}
          <div className="p-3.5 border-b border-white/10 flex items-center gap-3">
            <Search className="w-4 h-4 text-indigo-400 shrink-0" aria-hidden="true" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              placeholder="Type a command or search flows, agents, and actions..."
              aria-label="Search command menu items"
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              aria-label="Close command palette"
              className="p-1 rounded text-slate-400 hover:text-white focus-visible:outline-2 focus-visible:outline-indigo-500"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Action List */}
          <div
            className="p-2 max-h-80 overflow-y-auto space-y-1"
            role="listbox"
            aria-label="Command Suggestions"
          >
            {filteredActions.length === 0 ? (
              <p className="p-4 text-center text-xs text-slate-400">
                No commands matching &quot;{query}&quot;
              </p>
            ) : (
              filteredActions.map((item, idx) => (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={idx === selectedIndex}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-xs text-slate-200 cursor-pointer transition-colors ${
                    idx === selectedIndex
                      ? "bg-indigo-600/30 text-white border border-indigo-500/40"
                      : "hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                      {item.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <kbd>↑</kbd> <kbd>↓</kbd> to navigate
            </span>
            <span className="flex items-center gap-1.5">
              <kbd>↵</kbd> to select
            </span>
            <span className="flex items-center gap-1.5">
              <kbd>ESC</kbd> to close
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
