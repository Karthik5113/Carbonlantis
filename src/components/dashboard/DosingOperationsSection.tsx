import React from 'react';
import {
  Gauge,
  Activity,
  Sliders,
  History,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Info
} from 'lucide-react';
import { DosingCycle, PumpController } from '../../types';

interface DosingOperationsSectionProps {
  cycles: DosingCycle[];
  pumps: PumpController[];
  onOpenCycleDetails: (cycle: DosingCycle) => void;
  onOpenConfigureDosing: () => void;
  onOpenDosingHistory: () => void;
}

export const DosingOperationsSection: React.FC<DosingOperationsSectionProps> = ({
  cycles,
  pumps,
  onOpenCycleDetails,
  onOpenConfigureDosing,
  onOpenDosingHistory,
}) => {
  // Helper for status badge styling
  const getStatusBadge = (status: DosingCycle['status']) => {
    switch (status) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
            <span>In Progress</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>Scheduled</span>
          </span>
        );
      case 'Aborted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Failed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 text-slate-700">
            <span>Ready</span>
          </span>
        );
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
              Dosing Operations
            </h2>
            <p className="text-xs text-slate-500">
              Active riverine alkalinity injection cycles, peristaltic pump controllers, and flow telemetry
            </p>
          </div>
        </div>

        {/* Contextual Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenDosingHistory}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-500" />
            <span>View Dosing History</span>
          </button>

          <button
            type="button"
            onClick={onOpenConfigureDosing}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Configure Dosing</span>
          </button>
        </div>
      </div>

      {/* Dosing Cycles Table */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/80">
            <tr>
              <th className="py-2.5 px-3">Cycle & Asset</th>
              <th className="py-2.5 px-3">Slurry Batch</th>
              <th className="py-2.5 px-3">Target vs Actual Rate</th>
              <th className="py-2.5 px-3">Delivered Quantity</th>
              <th className="py-2.5 px-3">Timeline & Elapsed</th>
              <th className="py-2.5 px-3">Cycle Status</th>
              <th className="py-2.5 px-3">Pump & Controller Telemetry</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
            {cycles.map((cycle, idx) => {
              const matchedPump = pumps[idx % pumps.length];
              const actualRateKgHr =
                cycle.status === 'In Progress'
                  ? cycle.targetRateKgHr + 2.0
                  : cycle.status === 'Completed'
                  ? cycle.targetRateKgHr + 0.5
                  : 0;

              return (
                <tr key={cycle.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <span className="font-bold font-mono text-slate-900 block">
                      Cycle #{cycle.cycleNumber}
                    </span>
                    <span className="text-slate-600 font-medium block">
                      {cycle.vesselName}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {cycle.catchment}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                      {idx === 0 ? '#SLR-441 (CaSiO₃)' : idx === 1 ? '#SLR-440 (CaSiO₃)' : '#SLR-442 (CaSiO₃)'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-slate-900">
                        {cycle.status === 'Scheduled' ? '—' : `${actualRateKgHr} kg/hr`}
                      </span>
                    </div>
                    <span className="text-[10.5px] text-slate-400 block">
                      Target: {cycle.targetRateKgHr} kg/hr
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span className="font-bold text-slate-900 block">
                      {cycle.totalReagentKg.toLocaleString()} kg
                    </span>
                    <span className="text-[10px] text-emerald-700 font-sans font-medium">
                      Plume pH: {cycle.meanPlumePh}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[11px]">
                    <span className="text-slate-800 font-medium block">{cycle.startTime}</span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      Duration: {cycle.durationMinutes}m ({cycle.endTime})
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {getStatusBadge(cycle.status)}
                  </td>
                  <td className="py-2.5 px-3">
                    {matchedPump ? (
                      <div className="text-[11px] font-mono leading-tight">
                        <span className="font-semibold text-slate-800 block">
                          {matchedPump.pumpName.split('(')[0]}
                        </span>
                        <span className="text-slate-500">
                          {matchedPump.status === 'Running' ? (
                            <span className="text-emerald-700 font-bold">
                              {matchedPump.flowRateLPerMin} L/min • {matchedPump.pressureBar} bar
                            </span>
                          ) : (
                            <span className="text-slate-400">Standby / Closed</span>
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">Standard Sonde</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onOpenCycleDetails(cycle)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Read-Only State & Hardware Interlock Disclaimer */}
      <div className="flex items-center justify-between bg-slate-50/90 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Supervisory Telemetry Mode:</strong> Pump actuation and variable-flow setpoints stream in read-only telemetry mode. Automated closed-loop execution requires authenticated physical hardware interlock validation.
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 shrink-0">
          Interlock: ARMED
        </span>
      </div>
    </section>
  );
};

