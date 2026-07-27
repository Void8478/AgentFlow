"use client";

import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/links";
import { GithubAuthIcon } from "@/components/common/AuthIcons";
import { Sparkles, Heart, FileText, Shield, ExternalLink, Mail, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer
      aria-label="Footer Navigation"
      className="w-full border-t border-white/10 bg-[#07080a]/90 backdrop-blur-xl text-slate-400 text-xs py-8 px-4 sm:px-8 relative z-10"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-all">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-white">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            {SITE_CONFIG.description}
          </p>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open Source {SITE_CONFIG.version}</span>
          </div>
        </div>

        {/* Resources Links */}
        <div className="space-y-2">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-semibold mb-3">
            Resources
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href={SITE_CONFIG.urls.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
                <span>Documentation</span>
              </a>
            </li>
            <li>
              <a
                href={SITE_CONFIG.urls.apiDocs}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>FastAPI OpenAPI Specs</span>
              </a>
            </li>
            <li>
              <a
                href={SITE_CONFIG.urls.githubContribute}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Contributing Guidelines
              </a>
            </li>
          </ul>
        </div>

        {/* Community & Code */}
        <div className="space-y-2">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-semibold mb-3">
            Community & Code
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href={SITE_CONFIG.urls.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <GithubAuthIcon className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                <span>GitHub Repository</span>
              </a>
            </li>
            <li>
              <a
                href={SITE_CONFIG.urls.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" aria-hidden="true" />
                <span>Discord Server</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE_CONFIG.urls.supportEmail}`}
                className="hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>Support Email</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-2">
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-slate-200 font-semibold mb-3">
            Legal & License
          </h4>
          <ul className="space-y-2">
            <li>
              <a
                href={SITE_CONFIG.urls.license}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>MIT License</span>
              </a>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500">
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" aria-hidden="true" /> using Next.js, FastAPI, Ollama and Supabase.
        </p>

        <p>© {new Date().getFullYear()} AgentFlow Open Source Community. All rights reserved.</p>
      </div>
    </footer>
  );
}
