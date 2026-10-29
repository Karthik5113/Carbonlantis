import React from 'react';
import { Layers, Activity, Droplets, ShieldCheck, Info } from 'lucide-react';
import { DashboardOverviewKpis } from '../../types';

interface DashboardPlatformKpisProps {
  kpis: DashboardOverviewKpis;
}

export const DashboardPlatformKpis: React.FC<DashboardPlatformKpisProps> = ({ kpis }) => {
  return (
    <div className="space-y-2">
      {/* Platform KPI Grid (Exactly 4 Core Operational Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Active Deployments */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-sans">
              Active Deployments
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                {kpis.activeDeploymentsCount}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {kpis.totalDeploymentsCount} platforms
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>12 Operational • 2 Standby</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Online Monitoring Stations */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-sans">
              Online Monitoring Stations
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                4 Sondes
              </span>
              <span className="text-xs text-slate-500 font-medium font-mono">
                (208 nodes)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>100% Ingest Stream Active (1 Hz)</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Active Dosing Operations */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-sans">
              Active Dosing Operations
            </span>
            <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                2 Active Cycles
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Net Feed: 322.5 kg/hr CaSiO₃</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Data Quality Status */}
        <div className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-sans">
              Data Quality Status
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
                99.9%
              </span>
              <span className="text-xs text-emerald-700 font-semibold font-mono">
                Nominal
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>QA/QC Verified • 0 Dropped Packets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Demonstration Data Banner */}
      <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-1.5 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>
            Demonstration Telemetry • Values represent simulated baseline operations prior to field controller synchronization.
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 font-semibold">
          DRF API v1 Ready
        </span>
      </div>
    </div>
  );
};

