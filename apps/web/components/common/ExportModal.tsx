"use client";

import React, { useState } from "react";
import { Download, FileText, FileCode, Printer, X, Check, Sparkles } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  workflowId: string;
  content: string;
  model?: string;
}

export function ExportModal({
  isOpen,
  onClose,
  title,
  workflowId,
  content,
  model = "llama3:latest",
}: ExportModalProps) {
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(true);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportMarkdown = async () => {
    setDownloadingFormat("md");
    try {
      const res = await fetch("http://localhost:8000/api/v1/export/markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflow_id: workflowId,
          title,
          content,
          model,
          include_metadata: includeMetadata,
        }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, "_")}_${workflowId}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Markdown export failed:", err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleExportJSON = async () => {
    setDownloadingFormat("json");
    try {
      const res = await fetch("http://localhost:8000/api/v1/export/json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflow_id: workflowId,
          title,
          content,
          model,
          include_metadata: includeMetadata,
        }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, "_")}_${workflowId}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("JSON export failed:", err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  const handleExportPDF = async () => {
    setDownloadingFormat("pdf");
    try {
      const res = await fetch("http://localhost:8000/api/v1/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflow_id: workflowId,
          title,
          content,
          model,
          include_metadata: includeMetadata,
        }),
      });

      const html = await res.text();
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
      }
    } catch (err) {
      console.error("PDF export failed:", err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-white/10 space-y-6 shadow-2xl bg-[#07080a]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <Download className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-extrabold text-white tracking-tight">
              Export Workflow Output
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Toggle */}
        <div className="glass-panel p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <div>
              <p className="text-white font-semibold">Include Executive Metadata</p>
              <p className="text-[11px] text-slate-400">Timestamps, model info, and workflow IDs</p>
            </div>
          </div>
          <input
            type="checkbox"
            checked={includeMetadata}
            onChange={(e) => setIncludeMetadata(e.target.checked)}
            className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
          />
        </div>

        {/* Export Options Grid */}
        <div className="space-y-3">
          <button
            onClick={handleExportMarkdown}
            disabled={downloadingFormat !== null}
            className="w-full flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10 hover:border-indigo-500/40 text-left group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Markdown Document (.md)</p>
                <p className="text-xs text-slate-400">Clean markdown with YAML frontmatter</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={handleExportJSON}
            disabled={downloadingFormat !== null}
            className="w-full flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10 hover:border-indigo-500/40 text-left group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Structured Data (.json)</p>
                <p className="text-xs text-slate-400">Complete execution state & telemetry</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>

          <button
            onClick={handleExportPDF}
            disabled={downloadingFormat !== null}
            className="w-full flex items-center justify-between p-4 rounded-2xl glass-panel border border-white/10 hover:border-indigo-500/40 text-left group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Executive PDF (.pdf)</p>
                <p className="text-xs text-slate-400">Styled document layout print dialog</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
