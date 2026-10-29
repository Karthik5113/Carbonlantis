import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  Wifi,
  Sliders,
  Battery,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { SubsystemHealth } from '../../types';

interface SystemStatusPanelProps {
  subsystems: SubsystemHealth[];
}

export const SystemStatusPanel: React.FC<SystemStatusPanelProps> = ({ subsystems }) => {
  const getStatusBadge = (status: 'nominal' | 'warning' | 'degraded') => {
    switch (status) {
      case 'nominal':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Nominal</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Check</span>
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
            <XCircle className="w-3 h-3 text-rose-600" />
            <span>Degraded</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-carbon-border shadow-card p-4 sm:p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-carbon-border pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-carbon-navy shrink-0" />
            <div>
              <h2 className="text-base font-semibold text-carbon-text">
                Subsystem Telemetry Health
              </h2>
              <p className="text-xs text-carbon-muted">
                Hardware sensor drift, gateway latency & dosing actuation loops
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
            All Core Subsystems Operational
          </span>
        </div>

        {/* Subsystem Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subsystems.map((sub) => (
            <div
              key={sub.id}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div>
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 block">
                    {sub.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {sub.name}
                  </h4>
                </div>
                {getStatusBadge(sub.status)}
              </div>

              <div className="flex items-baseline justify-between text-xs my-2 font-mono bg-white p-2 rounded-lg border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Current</span>
                  <strong className="text-slate-900 text-xs">{sub.metric}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-sans">Target Envelope</span>
                  <span className="text-slate-600 text-xs">{sub.target}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {sub.details}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer System Status summary */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Failsafe Watchdog: <strong>Engaged (Autonomous Shutoff Ready)</strong></span>
        </span>
        <span className="font-mono text-slate-400">
          Sync cycle 10s
        </span>
      </div>
    </div>
  );
};

