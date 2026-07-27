"use client";

import React, { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  Settings,
  Sliders,
  Cpu,
  Database,
  Moon,
  Save,
  CheckCircle2,
  User,
  Zap,
  Globe,
  Lock,
  LogOut,
} from "lucide-react";

export default function SettingsPage() {
  const [theme, setTheme] = useState<string>("dark");
  const [ollamaHost, setOllamaHost] = useState<string>("http://localhost:11434");
  const [defaultModel, setDefaultModel] = useState<string>("llama3:latest");
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(4096);
  const [enableStreaming, setEnableStreaming] = useState<boolean>(true);
  const [enableMemory, setEnableMemory] = useState<boolean>(true);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [fullName, setFullName] = useState<string>("Principal AI Engineer");
  const [email, setEmail] = useState<string>("engineer@agentflow.dev");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07080a] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Header */}
        <DashboardHeader />

        {/* Scrollable View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 relative bg-grid-pattern max-w-5xl mx-auto w-full">
          {/* Title Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="flex items-center gap-2.5">
                <Settings className="w-6 h-6 text-indigo-400" />
                <h1 className="text-xl font-extrabold text-white tracking-tight">
                  System Settings & Preferences
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Configure Ollama model parameters, ChromaDB memory retention, UI themes, and user profile.
              </p>
            </div>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Saved Successfully!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>

          {/* Section 1: Ollama LLM Engine */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <Cpu className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                Ollama Engine & Model Parameters
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Ollama Host URL */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Ollama Host URL
                </label>
                <input
                  type="text"
                  value={ollamaHost}
                  onChange={(e) => setOllamaHost(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-mono"
                />
              </div>

              {/* Default Model Selector */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  Default Agent Model
                </label>
                <select
                  value={defaultModel}
                  onChange={(e) => setDefaultModel(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 focus:border-indigo-500/50 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-mono"
                >
                  <option value="llama3:latest">llama3:latest (8B)</option>
                  <option value="codellama:13b">codellama:13b</option>
                  <option value="mistral:7b">mistral:7b</option>
                  <option value="phi3:mini">phi3:mini</option>
                </select>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-slate-400" />
                    Temperature
                  </label>
                  <span className="font-mono text-indigo-400">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={0.0}
                  max={1.0}
                  step={0.05}
                  value={temperature}
                  onChange={(e) => setTemperature(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Max Tokens Limit</label>
                <input
                  type="number"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-mono"
                />
              </div>

              {/* Real-time Streaming Toggle */}
              <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex items-center justify-between col-span-1 md:col-span-2">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-white font-semibold">Real-Time WebSockets Streaming</p>
                    <p className="text-slate-400 text-[11px]">Stream token chunks live during agent execution</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={enableStreaming}
                  onChange={(e) => setEnableStreaming(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Memory & Theme */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ChromaDB Vector Memory */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                <Database className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-extrabold text-white tracking-tight">
                  ChromaDB Vector Memory
                </h2>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <p className="text-white font-semibold">Enable Vector Retention</p>
                  <p className="text-slate-400 text-[11px]">Index execution history vectors</p>
                </div>
                <input
                  type="checkbox"
                  checked={enableMemory}
                  onChange={(e) => setEnableMemory(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* UI Theme & Auto Save */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                <Moon className="w-5 h-5 text-indigo-400" />
                <h2 className="text-sm font-extrabold text-white tracking-tight">
                  Interface & Auto Save
                </h2>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <div>
                  <p className="text-white font-semibold">Auto-Save Workflow State</p>
                  <p className="text-slate-400 text-[11px]">Automatically persist step progress</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Profile Settings */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <User className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                Profile & User Account
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-semibold">Account Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 text-white text-xs rounded-xl px-3.5 py-2.5 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
