"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon } from "./Icons";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#07080a]/80 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 group-hover:border-indigo-400 transition-all">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              AgentFlow
              <span className="text-[10px] font-mono font-medium px-2 py-0.2 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a
            href="#features"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Features
          </a>
          <a
            href="#architecture"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Architecture
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            How it Works
          </a>
          <a
            href="#open-source"
            className="hover:text-white transition-colors flex items-center gap-1"
          >
            Open Source
          </a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2 px-3.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all flex items-center gap-2"
          >
            <GithubIcon className="w-4 h-4 text-slate-300" />
            <span>Star on GitHub</span>
            <span className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
              1.4k
            </span>
          </a>

          <Link
            href="/studio"
            className="py-2 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 hover:gap-2 active:scale-95"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel border-b border-white/10 px-4 py-5 space-y-4"
          >
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-300">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Features
              </a>
              <a
                href="#architecture"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Architecture
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                How it Works
              </a>
              <a
                href="#open-source"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-white py-1"
              >
                Open Source
              </a>
            </nav>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-medium bg-white/5 text-slate-200 border border-white/10 flex items-center justify-center gap-2"
              >
                <GithubIcon className="w-4 h-4" />
                <span>Star on GitHub (1.4k)</span>
              </a>

              <Link
                href="/studio"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 text-white flex items-center justify-center gap-2"
              >
                <span>Launch Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
