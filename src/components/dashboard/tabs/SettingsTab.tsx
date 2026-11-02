import React, { useState } from 'react';
import {
  Database,
  Cloud,
  FileText,
  FileSpreadsheet,
  Settings,
  Plus,
  Minus,
  Info,
  Box,
  Leaf,
  SlidersHorizontal,
  FlaskConical,
  ChevronRight,
  X,
  Download,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  backupHistoryData as initialBackups,
  activityLogsData,
  mrvReportPackagesData,
  operationalAssetsData
} from '../../../data/dashboardData';
import { BackupHistoryRecord, OperationalAsset } from '../../../types';

type ActiveModalType =
  | 'backup'
  | 'assets-history'
  | 'reports'
  | 'add-asset'
  | 'deactivate-asset'
  | 'about-assets'
  | 'about-approach'
  | 'about-monitoring'
  | 'about-chemistry'
  | null;

export const SettingsTab: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);
  const [backups, setBackups] = useState<BackupHistoryRecord[]>(initialBackups);
  const [assets, setAssets] = useState<OperationalAsset[]>(operationalAssetsData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);

  // Add Asset Form State
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetType, setNewAssetType] = useState<'mobile-dosing' | 'mrv-station' | 'buoy-gateway'>('mobile-dosing');
  const [newAssetCatchment, setNewAssetCatchment] = useState('Kesinapalli Main Drain');
  const [newAssetInterval, setNewAssetInterval] = useState('1');

  // Activity filter state
  const [activitySearch, setActivitySearch] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleCreateBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBak: BackupHistoryRecord = {
        id: `bak-${Date.now().toString().slice(-4)}`,
        timestamp: 'Just now',
        type: 'Hourly Telemetry Snapshot',
        sizeMb: +(40 + Math.random() * 8).toFixed(1),
        checksum: `sha256:${Math.random().toString(16).substring(2, 10)}...`,
        status: 'Stored (Encrypted S3/Cloud)'
      };
      setBackups([newBak, ...backups]);
      setIsBackingUp(false);
      triggerToast('Database snapshot created and encrypted successfully with AES-256.');
    }, 1000);
  };

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) return;

    const newId = `ast-${Date.now().toString().slice(-4)}`;
    const newCode = `CL-${newAssetType === 'mobile-dosing' ? 'ADR' : newAssetType === 'mrv-station' ? 'RN' : 'AQN'}-${Math.floor(100 + Math.random() * 900)}`;

    const createdAsset: OperationalAsset = {
      id: newId,
      name: newAssetName,
      code: newCode,
      type: newAssetType,
      status: 'Active',
      catchment: newAssetCatchment,
      coordinates: [16.5412, 81.9125],
      batteryPct: 100,
      solarWatts: 320,
      signalStrengthDbm: -65,
      waterDischargeM3s: 14.5,
      lastPing: 'Just now',
      firmwareVersion: 'v2.8.4-rt',
      operatorInCharge: 'Platform Admin',
      healthScore: 100
    };

    setAssets([createdAsset, ...assets]);
    setNewAssetName('');
    setActiveModal(null);
    triggerToast(`Asset "${createdAsset.name}" successfully registered and activated for live monitoring.`);
  };

  const handleToggleAssetStatus = (id: string) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'Active' ? 'Standby' : 'Active';
          triggerToast(`Asset ${a.code} changed status to: ${nextStatus}`);
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your data, assets and platform information</p>
      </div>

      {/* Top Grid: Data Management & Asset Modifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Data Management */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Data Management</h2>
                <p className="text-xs text-slate-500">Backup, history and data records</p>
              </div>
            </div>

            {/* List Items */}
            <div className="space-y-3">
              {/* 1. Backup History */}
              <button
                type="button"
                onClick={() => setActiveModal('backup')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/90 hover:border-slate-200 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Cloud className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Backup History
                    </h4>
                    <p className="text-[11px] text-slate-500">View and restore database backups</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* 2. Assets History */}
              <button
                type="button"
                onClick={() => setActiveModal('assets-history')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/90 hover:border-slate-200 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Assets History
                    </h4>
                    <p className="text-[11px] text-slate-500">View asset configuration and activity logs</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* 3. Reports History */}
              <button
                type="button"
                onClick={() => setActiveModal('reports')}
                className="w-full text-left p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/90 hover:border-slate-200 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      Reports History
                    </h4>
                    <p className="text-[11px] text-slate-500">Access previously generated reports</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Asset Modifications */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Settings className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Asset Modifications</h2>
                <p className="text-xs text-slate-500">Add, activate and manage assets</p>
              </div>
            </div>

            {/* List Items */}
            <div className="space-y-3.5">
              {/* 1. Add / Activate Assets */}
              <button
                type="button"
                onClick={() => setActiveModal('add-asset')}
                className="w-full text-left p-4 rounded-xl border border-emerald-200/70 bg-[#ecf7ed] hover:bg-[#e2f3e3] transition-all flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-950 transition-colors">
                      Add / Activate Assets
                    </h4>
                    <p className="text-[11px] text-slate-600">Register new assets and activate for monitoring</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* 2. Deactivate Assets */}
              <button
                type="button"
                onClick={() => setActiveModal('deactivate-asset')}
                className="w-full text-left p-4 rounded-xl border border-rose-200/70 bg-[#faecea] hover:bg-[#f6dfdd] transition-all flex items-center justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Minus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-950 transition-colors">
                      Deactivate Assets
                    </h4>
                    <p className="text-[11px] text-slate-600">Deactivate or retire assets</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: About Us */}
      <div className="rounded-2xl border border-amber-200/70 bg-[#fcf8ec] shadow-sm p-6">
        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-8 h-8 rounded-full bg-[#784d14] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">About Us</h2>
            <p className="text-xs text-slate-600">Learn about Carbonlantis and our platform</p>
          </div>
        </div>

        {/* 4 Informational Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-1">
          {/* Column 1: Assets */}
          <div
            onClick={() => setActiveModal('about-assets')}
            className="p-3.5 rounded-xl bg-white/60 hover:bg-white border border-amber-100 hover:border-amber-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Box className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Assets
                </h3>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Sensors</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Nodes (AquaNode, AquaDrone, RiverNode)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Applications</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Carbonlantis Approach */}
          <div
            onClick={() => setActiveModal('about-approach')}
            className="p-3.5 rounded-xl bg-white/60 hover:bg-white border border-amber-100 hover:border-amber-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Carbonlantis Approach
                </h3>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Inland Water Alkalinity Enhancement (IWAE)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Our Technology</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Dashboard & Applications</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Monitoring & Control */}
          <div
            onClick={() => setActiveModal('about-monitoring')}
            className="p-3.5 rounded-xl bg-white/60 hover:bg-white border border-amber-100 hover:border-amber-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-700" />
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Monitoring & Control
                </h3>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Real-time Monitoring</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Dosing Operations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Control Systems</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Field Chemistry & Carbonate Chemistry */}
          <div
            onClick={() => setActiveModal('about-chemistry')}
            className="p-3.5 rounded-xl bg-white/60 hover:bg-white border border-amber-100 hover:border-amber-300 transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Field Chemistry & Carbonate Chemistry
                </h3>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all" />
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Measured Parameters</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Carbonate Chemistry Calculations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0"></span>
                <span>Carbon Removal MRV</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ========================================================
          INTERACTIVE MODALS
         ======================================================== */}

      {/* Modal 1: Backup History */}
      {activeModal === 'backup' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Backup History & Snapshots</h3>
                  <p className="text-xs text-slate-500">View, download and restore database snapshots</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-4 text-xs">
              <div>
                <span className="font-semibold text-slate-800">Automated Hourly Ledger Sync</span>
                <p className="text-slate-500 text-[11px]">Cold storage replication in AES-256 AWS S3 bucket</p>
              </div>
              <button
                type="button"
                disabled={isBackingUp}
                onClick={handleCreateBackup}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
                <span>{isBackingUp ? 'Creating Snapshot...' : 'Create Snapshot Now'}</span>
              </button>
            </div>

            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1">
              {backups.map((bak) => (
                <div
                  key={bak.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900">{bak.type}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">
                        {bak.status}
                      </span>
                    </div>
                    <div className="text-slate-500 text-[11px] font-mono">
                      {bak.timestamp} • {bak.sizeMb} MB • {bak.checksum}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerToast(`Downloading backup archive ${bak.id}...`)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerToast(`Restore point initialized for ${bak.id}`)}
                      className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Assets History */}
      {activeModal === 'assets-history' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Assets History & Audit Logs</h3>
                  <p className="text-xs text-slate-500">Immutable ledger of asset modifications, calibrations & operations</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search history by asset name, user or event..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {activityLogsData
                .filter(
                  (log) =>
                    log.action.toLowerCase().includes(activitySearch.toLowerCase()) ||
                    log.resource.toLowerCase().includes(activitySearch.toLowerCase()) ||
                    log.userName.toLowerCase().includes(activitySearch.toLowerCase())
                )
                .map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{log.action}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
                            log.status === 'Success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px] font-sans">
                        Resource: <span className="font-semibold text-slate-800">{log.resource}</span> • Operator:{' '}
                        <span className="font-medium text-slate-700">{log.userName}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400 font-mono block">{log.timestamp}</span>
                      <span className="text-[10px] text-slate-400 font-mono block">{log.ipAddress}</span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Reports History */}
      {activeModal === 'reports' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Reports History & MRV Packages</h3>
                  <p className="text-xs text-slate-500">Access previously generated and verified carbon removal reports</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {mrvReportPackagesData.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">{pkg.reportBatchCode}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">
                        {pkg.verificationStatus}
                      </span>
                    </div>
                    <div className="text-slate-600 font-sans text-[11px] mb-1">
                      Period: {pkg.period} • Catchment: {pkg.catchment}
                    </div>
                    <div className="text-[11px] font-mono text-slate-500">
                      Standard: <span className="font-semibold text-slate-700">{pkg.standardAlignment}</span> • Verifier:{' '}
                      <span className="text-slate-700">{pkg.verifier}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-sm">
                      Hash: {pkg.sha256Hash}
                    </div>
                  </div>
                  <div className="shrink-0 flex sm:flex-col items-end gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      {pkg.totalNetCo2Tonnes} tCO2
                    </span>
                    <button
                      type="button"
                      onClick={() => triggerToast(`Downloaded report package ${pkg.reportBatchCode}`)}
                      className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Add / Activate Assets */}
      {activeModal === 'add-asset' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add & Activate Asset</h3>
                  <p className="text-xs text-slate-500">Register new monitoring buoy, dosing vessel or river node</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Asset Name / Identifier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AquaDrone-004 (Delta Sentinel)"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Asset Category
                  </label>
                  <select
                    value={newAssetType}
                    onChange={(e) => setNewAssetType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-1 focus:ring-emerald-600 outline-none"
                  >
                    <option value="mobile-dosing">AquaDrone (Mobile Dosing Vessel)</option>
                    <option value="buoy-gateway">AquaNode (Estuarine Sensor Buoy)</option>
                    <option value="mrv-station">RiverNode (Stationary Hydro Station)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Telemetry Ingest Rate
                  </label>
                  <select
                    value={newAssetInterval}
                    onChange={(e) => setNewAssetInterval(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-1 focus:ring-emerald-600 outline-none"
                  >
                    <option value="1">1 second (High Frequency 1 Hz)</option>
                    <option value="5">5 seconds (Standard Continuous)</option>
                    <option value="15">15 seconds (Battery Eco-Mode)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assigned Catchment Reach
                </label>
                <input
                  type="text"
                  value={newAssetCatchment}
                  onChange={(e) => setNewAssetCatchment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-1 focus:ring-emerald-600 outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-emerald-900">
                <span className="font-bold block mb-1">Autonomous Sensor Initialization Payload:</span>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-emerald-800">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>pH Buffer Sonde</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>pCO2 Spectrometer</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>Acoustic Doppler ADCP</span>
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    <span>Dissolved Oxygen</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Register & Activate Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Deactivate Assets */}
      {activeModal === 'deactivate-asset' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center">
                  <Minus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Deactivate / Retire Assets</h3>
                  <p className="text-xs text-slate-500">Temporarily suspend or decommission deployed assets</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200/80 mb-3 flex items-center gap-2.5 text-xs text-rose-900">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Deactivating an asset stops automated telemetry streaming and halts active dosing operations safely.
              </span>
            </div>

            <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 text-xs">
              {assets.map((ast) => (
                <div
                  key={ast.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900 text-xs">{ast.name}</span>
                      <span className="font-mono text-[10px] text-slate-500 font-semibold">{ast.code}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ast.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {ast.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Catchment: {ast.catchment} • Battery: {ast.batteryPct}% • Health: {ast.healthScore}%
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleAssetStatus(ast.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      ast.status === 'Active'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    {ast.status === 'Active' ? (
                      <>
                        <Minus className="w-3.5 h-3.5" />
                        <span>Deactivate</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Reactivate</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 6: About Assets */}
      {activeModal === 'about-assets' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">About Us: Assets Architecture</h3>
                  <p className="text-xs text-slate-500">Autonomous hardware, sensor networks and deployment nodes</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Sensors
                </h4>
                <p className="text-slate-600">
                  Carbonlantis integrates multi-parameter laboratory-grade field sondes including optical Dissolved Oxygen,
                  non-dispersive infrared (NDIR) pCO2 flow cells, ISFET pH probes, and inductive conductivity sensors calibrated to NIST standards.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Nodes (AquaNode, AquaDrone, RiverNode)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 mt-1">
                  <li><strong>AquaNode:</strong> Solar-powered estuarine telemetry buoys capturing baseline ambient water parameters.</li>
                  <li><strong>AquaDrone:</strong> Autonomous mobile robotic vessels delivering high-precision alkaline slurry dosing.</li>
                  <li><strong>RiverNode:</strong> Stationary stream gauges providing river discharge volume and acoustic current velocity (ADCP).</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  Applications
                </h4>
                <p className="text-slate-600">
                  Comprehensive inland waterway carbon dioxide removal, municipal drain remediation, agricultural runoff neutralization,
                  and verifiable carbon credits generation adhering to ISO 14064-2 protocols.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: About Carbonlantis Approach */}
      {activeModal === 'about-approach' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">About Us: Carbonlantis Approach</h3>
                  <p className="text-xs text-slate-500">Inland Water Alkalinity Enhancement scientific methodology</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Inland Water Alkalinity Enhancement (IWAE)
                </h4>
                <p className="text-slate-600">
                  IWAE leverages the natural carbonate-silicate cycle by adding finely milled alkaline minerals (such as magnesium hydroxide and calcium hydroxide)
                  into inland waters. This converts dissolved aqueous CO2 into stable bicarbonate ions (HCO3-), preventing atmospheric degassing.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Our Technology
                </h4>
                <p className="text-slate-600">
                  State-of-the-art slurry injection automation combined with real-time feedback loops. Dynamic dosing ensures dissolution occurs safely within
                  stringent ecological bounds (pH never exceeding 8.50).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                  Dashboard & Applications
                </h4>
                <p className="text-slate-600">
                  Full-stack digital MRV suite supplying cryptographically verifiable records for third-party auditing bodies and carbon registries worldwide.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 8: About Monitoring & Control */}
      {activeModal === 'about-monitoring' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">About Us: Monitoring & Control</h3>
                  <p className="text-xs text-slate-500">Autonomous watchdog algorithms, telemetry ingestion & safety ceilings</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Real-time Monitoring
                </h4>
                <p className="text-slate-600">
                  Continuous 1-second telemetry ingest across upstream, mixing, and downstream stations provides real-time verification of water chemistry,
                  temperature gradients, and flow dynamics.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  Dosing Operations
                </h4>
                <p className="text-slate-600">
                  Closed-loop peristaltic pump speed modulation based on continuous upstream pH, buffering capacity, and real-time river discharge rate (m³/s).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  Control Systems
                </h4>
                <p className="text-slate-600">
                  Hardware-level watchdog triggers that automatically shut down dosing in less than 200 ms if water levels or pH exceed the preset regulatory ceiling of 8.50 pH.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 9: About Field Chemistry */}
      {activeModal === 'about-chemistry' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">About Us: Field & Carbonate Chemistry</h3>
                  <p className="text-xs text-slate-500">Thermodynamic equilibrium modeling and carbon removal quantification</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 flex-1 pr-1 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  Measured Parameters
                </h4>
                <p className="text-slate-600">
                  Core in-situ telemetry captures pH (NBS scale), partial pressure of carbon dioxide (pCO2), water temperature (°C),
                  dissolved oxygen (mg/L), salinity (PSU), and turbidity (NTU).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Carbonate Chemistry Calculations
                </h4>
                <p className="text-slate-600">
                  Using CO2SYS thermodynamic formulation with Millero freshwater constants to calculate Total Dissolved Inorganic Carbon (DIC),
                  Total Alkalinity (TA), and Revelle buffer factor in real-time.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <h4 className="font-bold text-slate-900 mb-1 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Carbon Removal MRV
                </h4>
                <p className="text-slate-600">
                  Net atmospheric CO2 draw-down is calculated by mass balance: ΔCO2 = Q × ([HCO3-]downstream - [HCO3-]upstream) - Parasitic Emissions,
                  validated by accredited third-party verification agencies.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
