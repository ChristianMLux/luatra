"use client";

import { MasonryGrid } from "@repo/ui";
import { 
  CurrencyDollarIcon, 
  BriefcaseIcon, 
  ChartBarIcon, 
  ClockIcon 
} from "@heroicons/react/24/outline";
import { AppCard } from "./AppCard";
import { WidgetPlaceholder } from "./WidgetPlaceholder";
import { JobPipelineWidget } from "./JobPipelineWidget";
import { ActivityWidget } from "./ActivityWidget";
import { ChronatraWidget } from "./ChronatraWidget";

export function HubGrid() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* 4.1. App Gateway Section */}
      <section>
        <h2 className="text-2xl font-light mb-6 text-foreground tracking-tight">
          System Gateway
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppCard
            appName="Finatra"
            description="Financial Intelligence & Asset Tracking System. Monitor cash flow, manage expenses, and consult with the Financial AI Agent."
            href="http://localhost:3001"
            port={3001}
            icon={<CurrencyDollarIcon className="w-6 h-6" />}
            status="online"
          />
          <AppCard
            appName="Joatra"
            description="Career trajectory & Application Management. Track job opportunities, generate cover letters, and analyze market fit."
            href="http://localhost:3002"
            port={3002}
            icon={<BriefcaseIcon className="w-6 h-6" />}
            status="online"
          />
          <AppCard
            appName="Chronatra"
            description="Time Intelligence & Work-Life Balance. Smart timer, focus mode, and automatic timesheet generation."
            href="http://localhost:3003"
            port={3003}
            icon={<ClockIcon className="w-6 h-6" />}
            status="online"
          />
        </div>
      </section>

      {/* 4.2. Dashboard Widgets Section */}
      <section>
        <h2 className="text-2xl font-light mb-6 text-foreground tracking-tight flex items-center gap-2">
          Operations Overview 
          <span className="text-xs font-mono text-muted-foreground bg-glass-medium px-2 py-1 rounded-full">v0.2</span>
        </h2>
        
        <MasonryGrid columnCount={3} gap={24}>
          {/* Finatra Widgets */}
          <WidgetPlaceholder title="Net Worth Overview" minHeight="h-[250px]">
            <div className="text-center space-y-2">
              <ChartBarIcon className="w-10 h-10 mx-auto text-cyber-neon/50" />
              <div className="text-2xl font-mono text-cyber-neon">$124,592.00</div>
              <p className="text-xs text-muted-foreground">+2.4% this month</p>
            </div>
          </WidgetPlaceholder>


          {/* Recent Activity Widget - LIVE DATA */}
          <ActivityWidget />

          {/* Joatra Widget - LIVE DATA */}
          <JobPipelineWidget />

          {/* Chronatra Widget - LIVE DATA */}
          <ChronatraWidget />

          <WidgetPlaceholder title="System Status" state="loading" minHeight="h-[150px]" />
          
          <WidgetPlaceholder title="Quick Actions" minHeight="h-[180px]">
             <div className="grid grid-cols-2 gap-3 w-full">
                <button className="p-2 border border-glass-border rounded hover:bg-glass-medium transition text-xs">New Transaction</button>
                <button className="p-2 border border-glass-border rounded hover:bg-glass-medium transition text-xs">Log Application</button>
             </div>
          </WidgetPlaceholder>

        </MasonryGrid>
      </section>
    </div>
  );
}
