"use client";

import React from "react";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AgentCardGrid } from "@/components/common/AgentCardGrid";
import { RecentRunsTable } from "@/components/dashboard/RecentRunsTable";

export default function DashboardPage() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07080a] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Header */}
        <DashboardHeader />

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 relative bg-grid-pattern">
          {/* Telemetry Stat Cards */}
          <StatisticsCards />

          {/* Quick Action Grid */}
          <QuickActions />

          {/* Active Agent Swarm Monitor Cards */}
          <AgentCardGrid />

          {/* Execution History Logs */}
          <RecentRunsTable />
        </main>
      </div>
    </div>
  );
}
