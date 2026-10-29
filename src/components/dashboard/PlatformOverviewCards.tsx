import React from 'react';
import {
  Sparkles,
  Layers,
  Radio,
  Activity,
  Droplets,
  Server,
  TrendingUp
} from 'lucide-react';
import { DashboardOverviewKpis } from '../../types';

interface PlatformOverviewCardsProps {
  kpis: DashboardOverviewKpis;
}

export const PlatformOverviewCards: React.FC<PlatformOverviewCardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* KPI 1: Cumulative CO2 Removed */}
      <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-carbon-muted">
            CO₂ Removed (Net)
          </span>
          <Sparkles className="w-4 h-4 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-semibold text-carbon-text tracking-tight">
              {kpis.cumulativeCo2RemovedTonnes.toLocaleString()}
            </span>
            <span className="text-xs text-carbon-muted font-mono">tCO₂</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+12.4 tCO₂ / 24h</span>
          </div>
        </div>
      </div>

      {/* KPI 2: Alkalinity Injected */}
      <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-carbon-muted">
            Alkalinity Injected
          </span>
          <Droplets className="w-4 h-4 text-carbon-navy" />
        </div>
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-semibold text-carbon-text tracking-tight">
              {kpis.netAlkalinityInjectedTons.toLocaleString()}
            </span>
            <span className="text-xs text-carbon-muted font-mono">tons</span>
          </div>
          <div className="text-[11px] text-carbon-muted truncate">
            CaSiO₃ slurry equivalent
          </div>
        </div>
      </div>

      {/* KPI 3: Asset Deployments */}
      <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-carbon-muted">
            Active Deployments
          </span>
          <Layers className="w-4 h-4 text-indigo-600" />
        </div>
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-semibold text-carbon-text tracking-tight">
              {kpis.activeDeploymentsCount}
            </span>
            <span className="text-xs text-carbon-muted font-mono">/ {kpis.totalDeploymentsCount} active</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Fleet operational</span>
          </div>
        </div>
      </div>

      {/* KPI 4: Real-time Sensor Nodes */}
      <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-carbon-muted">
            Sensor Nodes
          </span>
          <Radio className="w-4 h-4 text-purple-600" />
        </div>
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-semibold text-carbon-text tracking-tight">
              {kpis.realtimeSensorsCount}
            </span>
            <span className="text-xs text-carbon-muted font-mono">nodes</span>
          </div>
          <div className="text-[11px] text-carbon-muted truncate">
            1 Hz optical / ISFET array
          </div>
        </div>
      </div>

      {/* KPI 5: Mean Delta pH Buffer */}
      <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-carbon-muted">
            Mean Delta pH
          </span>
          <Activity className="w-4 h-4 text-carbon-navy" />
        </div>
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-semibold text-carbon-navy tracking-tight">
              +{kpis.averageDeltaPh}
            </span>
            <span className="text-xs text-carbon-muted font-mono">pH unit</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">
            &lt; 8.50 safety ceiling
          </div>
        </div>
      </div>

      {/* KPI 6: Telemetry Reliability */}
      <div className="bg-white rounded-lg p-4 border border-carbon-border shadow-card flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-carbon-muted">
            Ingest Uptime
          </span>
          <Server className="w-4 h-4 text-teal-600" />
        </div>
        <div>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-2xl font-semibold text-carbon-text tracking-tight">
              {kpis.systemReliabilityPct}%
            </span>
          </div>
          <div className="text-[11px] text-carbon-muted font-mono">
            {kpis.telemetryIngestRatePps} packets / sec
          </div>
        </div>
      </div>
    </div>
  );
};
