import React, { useState } from 'react';
import { X, Gauge, Activity, Droplets, CheckCircle2, Clock, AlertTriangle, Info, Sliders } from 'lucide-react';
import { DosingCycle, PumpController } from '../../../types';

interface DosingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cycle: DosingCycle | null;
  pumps: PumpController[];
  mode?: 'details' | 'configure' | 'history';
}

export const DosingDetailsModal: React.FC<DosingDetailsModalProps> = ({
  isOpen,
  onClose,
  cycle,
  pumps,
  mode = 'details',
}) => {
  const [activeMode, setActiveMode] = useState<'details' | 'configure' | 'history'>(mode);
  const [targetRateInput, setTargetRateInput] = useState<string>(cycle?.targetRateKgHr.toString() || '160');
  const [configNotice, setConfigNotice] = useState<string | null>(null);

  if (!isOpen || !cycle) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigNotice(`Dosing rate setpoint updated to ${targetRateInput} kg/hr for ${cycle.vesselName}. Closed-loop PID adjusted.`);
    setTimeout(() => {
      setConfigNotice(null);
      setActiveMode('details');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Dosing Cycle #{cycle.cycleNumber} — {cycle.vesselName}
              </h3>
              <p className="text-xs text-slate-500">
                {cycle.catchment} • Operator: {cycle.operator}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-nav Tabs */}
        <div className="px-5 pt-3 border-b border-slate-100 flex items-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveMode('details')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeMode === 'details'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Telemetry & Plume pH
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('configure')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeMode === 'configure'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Configure Setpoint
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('history')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeMode === 'history'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Cycle Event Log
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-xs font-sans space-y-4">
          {configNotice && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{configNotice}</span>
            </div>
          )}

          {activeMode === 'details' && (
            <div className="space-y-4">
              {/* Telemetry Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Target Feed Rate</span>
                  <strong className="text-sm font-bold text-slate-900 font-mono">
                    {cycle.targetRateKgHr} kg/hr
                  </strong>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Total Delivered</span>
                  <strong className="text-sm font-bold text-blue-700 font-mono">
                    {cycle.totalReagentKg.toLocaleString()} kg
                  </strong>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Mean Plume pH</span>
                  <strong className="text-sm font-bold text-emerald-700 font-mono">
                    {cycle.meanPlumePh}
                  </strong>
                  <span className="text-[9.5px] text-slate-400 block font-mono">Threshold &lt; 8.5</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-semibold">Duration</span>
                  <strong className="text-sm font-bold text-slate-900 font-mono">
                    {cycle.durationMinutes} mins
                  </strong>
                  <span className="text-[9.5px] text-slate-400 block">{cycle.status}</span>
                </div>
              </div>

              {/* Pump hardware state */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Peristaltic Dosing Controller</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Running (Velocity Proportional)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Speed</span>
                    <strong>185 RPM</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Flow Rate</span>
                    <strong className="text-blue-700">28.5 L/min</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Line Pressure</span>
                    <strong>2.35 bar</strong>
                  </div>
                </div>
              </div>

              {/* Simulated Note */}
              <div className="p-3 rounded-lg bg-slate-100 text-slate-600 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  Telemetry updates every 1 second over encrypted LoRaWAN/Cellular telemetry stream.
                </span>
              </div>
            </div>
          )}

          {activeMode === 'configure' && (
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Adjust Target Injection Rate (kg/hr)
                </label>
                <input
                  type="number"
                  min="20"
                  max="400"
                  step="5"
                  value={targetRateInput}
                  onChange={(e) => setTargetRateInput(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Permitted catchment envelope: 50 – 300 kg/hr based on Godavari hydrological discharge.
                </span>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Modifying target setpoints modulates peristaltic displacement velocity and triggers real-time plume sensor monitoring alarms if ΔpH &gt; 0.4.
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMode('details')}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  Update Setpoint
                </button>
              </div>
            </form>
          )}

          {activeMode === 'history' && (
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-800">Cycle Started</span>
                <span className="font-mono text-slate-500">{cycle.startTime}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-800">Nozzle 1 Injection Initialized (180 kg/hr)</span>
                <span className="font-mono text-slate-500">10 mins after start</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-800">Mixing Zone pH Stabilized (pH 8.28)</span>
                <span className="font-mono text-slate-500">25 mins after start</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-800">Automated Fresh Water Flush</span>
                <span className="font-mono text-slate-500">{cycle.endTime}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

