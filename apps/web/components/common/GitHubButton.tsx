"use client";

import React, { useState } from "react";
import { SITE_CONFIG } from "@/config/links";
import { GithubAuthIcon } from "@/components/common/AuthIcons";
import { Star, Copy, Check, ExternalLink, Bug, Lightbulb, GitPullRequest } from "lucide-react";

export function GitHubRepoButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={SITE_CONFIG.urls.githubRepo}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-all focus-visible:outline-2 focus-visible:outline-indigo-500 ${className}`}
    >
      <GithubAuthIcon className="w-4 h-4 text-white" aria-hidden="true" />
      <span>GitHub Repository</span>
      <ExternalLink className="w-3 h-3 text-slate-400" aria-hidden="true" />
    </a>
  );
}

export function StarOnGitHubButton() {
  return (
    <a
      href={SITE_CONFIG.urls.githubStar}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-amber-400"
    >
      <Star className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
      <span>Star on GitHub</span>
    </a>
  );
}

export function CopyRepoUrlButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SITE_CONFIG.urls.githubRepo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy GitHub Repository URL"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono bg-black/40 hover:bg-black/60 text-slate-300 border border-white/10 transition-all focus-visible:outline-2 focus-visible:outline-indigo-500"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span className="text-emerald-400">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
          <span>git clone repo URL</span>
        </>
      )}
    </button>
  );
}

export function GitHubCommunityLinks() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={SITE_CONFIG.urls.githubIssues}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
      >
        <GitPullRequest className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
        <span>Open Issues</span>
      </a>

      <a
        href={SITE_CONFIG.urls.githubBugReport}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
      >
        <Bug className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
        <span>Report Bug</span>
      </a>

      <a
        href={SITE_CONFIG.urls.githubFeatureRequest}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
      >
        <Lightbulb className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
        <span>Request Feature</span>
      </a>
    </div>
  );
}
