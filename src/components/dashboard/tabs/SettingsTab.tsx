import React, { useState } from 'react';
import {
  Settings,
  Database,
  HardDrive,
  SlidersHorizontal,
  Info,
  ShieldCheck,
  Download,
  Save,
  CheckCircle2,
  RefreshCw,
  Server
} from 'lucide-react';
import { backupHistoryData, assetConfigData } from '../../../data/dashboardData';
import { BackupHistoryRecord, AssetConfigItem } from '../../../types';

export const SettingsTab: React.FC = () => {
  const [assetConfigs, setAssetConfigs] = useState<AssetConfigItem[]>(assetConfigData);
  const [globalCeiling, setGlobalCeiling] = useState<number>(8.50);
  const [warningThreshold, setWarningThreshold] = useState<number>(8.35);
  const [retentionDays, setRetentionDays] = useState<number>(90);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveNotice('Platform parameters, safety ceilings, and telemetry retention policies updated.');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* 1. Carbonlantis Platform Information & Node Status */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
                Carbonlantis Platform Information
              </h3>
              <p className="text-xs text-slate-500">
                Core runtime architecture, methodology version & DRF backend integration
              </p>
            </div>
          </div>

          <span className="text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/60 px-3 py-1 rounded-xl font-bold">
            v2.4.0-Enterprise
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans uppercase tracking-wider">Methodology</span>
            <strong className="text-slate-900 text-xs font-sans">IWAE-MRV-v3.2</strong>
            <span className="text-[10px] text-emerald-700 block mt-0.5">ISO 14064-2 Aligned</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans uppercase tracking-wider">DRF API Gateway</span>
            <strong className="text-blue-700 text-xs">http://localhost:8000/api/v1</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">REST + WebSocket 1 Hz</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans uppercase tracking-wider">Active Basin Catchment</span>
            <strong className="text-slate-900 text-xs font-sans">Godavari Delta Pilot Reach</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">Kesinapalli Main Drain</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-400 block font-sans uppercase tracking-wider">Frontend Stack</span>
            <strong className="text-slate-900 text-xs font-sans">React 18 • TypeScript • Tailwind</strong>
            <span className="text-[10px] text-slate-500 block mt-0.5">Leaflet Geographic Engine</span>
          </div>
        </div>
      </div>

      {/* 2. Safety Ceilings & Regulatory Threshold Configuration */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
                Safety Thresholds & Global Dosing Limits
              </h3>
              <p className="text-xs text-slate-500">
                Freshwater environmental protection ceilings & automated dosing cut-off boundaries
              </p>
            </div>
          </div>

          <span className="text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl font-bold">
            Autonomous Watchdog Armed
          </span>
        </div>

        {saveNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveNotice}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Global pH Ceiling Limit
              </label>
              <input
                type="number"
                step="0.01"
                min="8.0"
                max="8.8"
                value={globalCeiling}
                onChange={(e) => setGlobalCeiling(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-1 focus:ring-blue-600 outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Regulatory maximum limit (Default: 8.50 pH)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Warning Feed Modulation Threshold
              </label>
              <input
                type="number"
                step="0.01"
                min="8.0"
                max="8.5"
                value={warningThreshold}
                onChange={(e) => setWarningThreshold(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-1 focus:ring-blue-600 outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Triggers automated feed throttling (Default: 8.35 pH)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Hot Telemetry Retention (Days)
              </label>
              <input
                type="number"
                min="30"
                max="365"
                value={retentionDays}
                onChange={(e) => setRetentionDays(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-sm focus:ring-1 focus:ring-blue-600 outline-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">Cold archives stored indefinitely in S3</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0A1628] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Regulatory Thresholds</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Asset Modifications & Fleet Calibration Settings */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
              Asset Modifications & Calibration Schedules
            </h3>
            <p className="text-xs text-slate-500">
              Per-asset parameter limits, sampling frequency & calibration intervals
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">3 Core Assets Configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[10px]">
                <th className="py-3 px-4">Asset Code</th>
                <th className="py-3 px-3">Asset Name</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Max pH Ceiling</th>
                <th className="py-3 px-3">Warning Threshold</th>
                <th className="py-3 px-4 text-right">Sampling Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {assetConfigs.map((cfg) => (
                <tr key={cfg.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{cfg.assetCode}</td>
                  <td className="py-3 px-3 font-sans text-slate-800">{cfg.name}</td>
                  <td className="py-3 px-3 font-sans text-slate-600">{cfg.type}</td>
                  <td className="py-3 px-3 text-rose-600 font-bold">{cfg.maxPhCeiling.toFixed(2)} pH</td>
                  <td className="py-3 px-3 text-amber-600 font-bold">{cfg.warningPhThreshold.toFixed(2)} pH</td>
                  <td className="py-3 px-4 text-right text-slate-700 font-bold">{cfg.telemetryIntervalSec} sec</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Backup & Report History */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
                Automated Backups & Report History
              </h3>
              <p className="text-xs text-slate-500">
                Encrypted cloud snapshots, verified checksums & ledger recovery archives
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => alert("Snapshot creation initiated. Encrypting raw telemetry ledger with AES-256...")}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Create Snapshot Now</span>
          </button>
        </div>

        <div className="space-y-3">
          {backupHistoryData.map((bak) => (
            <div
              key={bak.id}
              className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <strong className="text-slate-900 font-bold">{bak.type}</strong>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full font-mono">
                    {bak.status}
                  </span>
                </div>
                <div className="text-slate-500 font-mono text-[11px]">
                  Timestamp: {bak.timestamp} • Size: {bak.sizeMb} MB
                </div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                  Checksum: {bak.checksum}
                </div>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  onClick={() => alert(`Downloading archive ${bak.id}...`)}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Archive</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

