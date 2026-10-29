import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Boxes,
  Droplets,
  Sliders,
  Gauge,
  History,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  Square,
  RefreshCw,
  ExternalLink,
  Download,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';

import {
  mineralFeedstocksData,
  slurryMixerTanksData,
  pumpControllersData,
  dosingCyclesData,
  slurryBatchesData,
  dosingPlansData,
  dosingReconciliationData,
  operationalAssetsData
} from '../../../data/dashboardData';

import {
  MineralFeedstock,
  SlurryMixerTank,
  PumpController,
  DosingCycle,
  SlurryBatchRecord,
  DosingPlan,
  DosingReconciliationRecord,
  DosingSubmoduleTab
} from '../../../types';

import { SlurryPreparationModal } from '../modals/SlurryPreparationModal';
import { MineralInventoryModal } from '../modals/MineralInventoryModal';
import { CreateDosingPlanModal } from '../modals/CreateDosingPlanModal';
import { ReconciliationDetailsModal } from '../modals/ReconciliationDetailsModal';

export const MineralDosingTab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const subParam = searchParams.get('subtab') as DosingSubmoduleTab;
  const initialSubTab: DosingSubmoduleTab =
    subParam === 'inventory' ||
    subParam === 'preparation' ||
    subParam === 'setup' ||
    subParam === 'operations' ||
    subParam === 'history'
      ? subParam
      : 'inventory';

  // Current Active Submodule Tab (Workflow Order: Inventory → Preparation → Setup → Operations → History)
  const [activeSubTab, setActiveSubTab] = useState<DosingSubmoduleTab>(initialSubTab);

  useEffect(() => {
    if (subParam && subParam !== activeSubTab) {
      setActiveSubTab(subParam);
    }
  }, [subParam]);

  const handleSubTabChange = (tab: DosingSubmoduleTab) => {
    setActiveSubTab(tab);
    setSearchParams({ tab: 'mineral-dosing', subtab: tab });
  };

  // Shared Domain Data State
  const [feedstocks, setFeedstocks] = useState<MineralFeedstock[]>(mineralFeedstocksData);
  const [mixerTanks, setMixerTanks] = useState<SlurryMixerTank[]>(slurryMixerTanksData);
  const [slurryBatches, setSlurryBatches] = useState<SlurryBatchRecord[]>(slurryBatchesData);
  const [dosingPlans, setDosingPlans] = useState<DosingPlan[]>(dosingPlansData);
  const [pumps, setPumps] = useState<PumpController[]>(pumpControllersData);
  const [cycles, setCycles] = useState<DosingCycle[]>(dosingCyclesData);
  const [reconciliationRecords, setReconciliationRecords] = useState<DosingReconciliationRecord[]>(dosingReconciliationData);

  // Modals State
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isSlurryModalOpen, setIsSlurryModalOpen] = useState(false);
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);
  const [selectedReconciliationRecord, setSelectedReconciliationRecord] = useState<DosingReconciliationRecord | null>(null);

  // Operational feedback notice
  const [notice, setNotice] = useState<string | null>(null);

  // Search & Filter State for Inventory
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryFilterStatus, setInventoryFilterStatus] = useState('all');

  // Handlers
  const handleBatchPrepared = (newBatch: {
    tankId: string;
    batchNumber: string;
    mineralMassKg: number;
    waterLiters: number;
    densityGPerL: number;
    concentrationGPerL: number;
  }) => {
    const newSlurryRecord: SlurryBatchRecord = {
      id: `slr-${Date.now()}`,
      batchNumber: `SLR-2026-${Math.floor(445 + Math.random() * 50)}`,
      mineralBatchId: newBatch.batchNumber,
      mineralType: 'Calcium Silicate (CaSiO3)',
      mineralMassKg: newBatch.mineralMassKg,
      waterQuantityLiters: newBatch.waterLiters,
      totalVolumeLiters: Math.round(newBatch.waterLiters + newBatch.mineralMassKg / 2.8),
      concentrationGPerL: newBatch.concentrationGPerL,
      densityGPerL: newBatch.densityGPerL,
      tankId: newBatch.tankId,
      tankName: mixerTanks.find((t) => t.id === newBatch.tankId)?.tankName || 'Mixer Tank 1',
      status: 'Ready',
      preparedBy: 'Dr. Elena Vance',
      preparationDate: 'Today, Just now'
    };

    setSlurryBatches((prev) => [newSlurryRecord, ...prev]);

    setMixerTanks((prev) =>
      prev.map((tank) => {
        if (tank.id === newBatch.tankId) {
          return {
            ...tank,
            status: 'Ready',
            volumeLiters: Math.min(
              tank.capacityLiters,
              tank.volumeLiters + newSlurryRecord.totalVolumeLiters
            ),
            densityGPerL: newBatch.densityGPerL,
            motorRpm: 120
          };
        }
        return tank;
      })
    );

    setNotice(`Slurry batch ${newSlurryRecord.batchNumber} created and marked Ready for dosing setup.`);
  };

  const handleAddFeedstockBatch = (newBatch: MineralFeedstock) => {
    setFeedstocks((prev) => [newBatch, ...prev]);
    setNotice(`Mineral batch #${newBatch.batchNumber} registered into inventory stockpiles.`);
  };

  const handlePlanCreated = (newPlan: DosingPlan) => {
    setDosingPlans((prev) => [newPlan, ...prev]);
    setNotice(`Dosing plan ${newPlan.planCode} configured, validated, and approved.`);
  };

  const handleTogglePump = (pumpId: string) => {
    setPumps((prev) =>
      prev.map((p) => {
        if (p.id === pumpId) {
          const nextStatus = p.status === 'Running' ? 'Standby' : 'Running';
          setNotice(`${p.pumpName} switched to ${nextStatus}.`);
          return {
            ...p,
            status: nextStatus,
            flowRateLPerMin: nextStatus === 'Running' ? 26.0 : 0
          };
        }
        return p;
      })
    );
  };

  const handlePurgeLine = (pumpName: string) => {
    setNotice(`Automated 30-second freshwater line purge executed on ${pumpName}.`);
  };

  // Submodule navigation tabs definition
  const submodules: {
    id: DosingSubmoduleTab;
    label: string;
    stepNumber: string;
    stage: string;
    icon: React.ElementType;
    badgeCount?: number;
  }[] = [
    {
      id: 'inventory',
      label: 'Mineral Inventory',
      stepNumber: '1',
      stage: 'Feedstock',
      icon: Boxes,
      badgeCount: feedstocks.length
    },
    {
      id: 'preparation',
      label: 'Slurry Preparation',
      stepNumber: '2',
      stage: 'Preparation',
      icon: Droplets,
      badgeCount: slurryBatches.filter((b) => b.status === 'Ready').length
    },
    {
      id: 'setup',
      label: 'Dosing Setup',
      stepNumber: '3',
      stage: 'Configuration',
      icon: Sliders,
      badgeCount: dosingPlans.filter((p) => p.status === 'Approved').length
    },
    {
      id: 'operations',
      label: 'Dosing Operations',
      stepNumber: '4',
      stage: 'Operations',
      icon: Gauge,
      badgeCount: 1 // 1 Active cycle
    },
    {
      id: 'history',
      label: 'History & Reconciliation',
      stepNumber: '5',
      stage: 'Reconciliation',
      icon: History,
      badgeCount: reconciliationRecords.length
    }
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Module Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
          Mineral & Dosing
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage mineral supply, slurry preparation, dosing configuration, operations, and reconciliation.
        </p>
      </div>

      {/* 2. Secondary Workflow Horizontal Navbar */}
      <nav
        aria-label="Mineral & Dosing Operational Workflow"
        className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-1.5 flex flex-wrap items-center justify-between gap-1 select-none"
      >
        <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
          {submodules.map((sub, idx) => {
            const Icon = sub.icon;
            const isActive = activeSubTab === sub.id;

            return (
              <React.Fragment key={sub.id}>
                <button
                  type="button"
                  onClick={() => handleSubTabChange(sub.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {sub.stepNumber}
                    </span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{sub.label}</span>
                  {sub.badgeCount !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        isActive
                          ? 'bg-blue-800/80 text-blue-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {sub.badgeCount}
                    </span>
                  )}
                </button>

                {/* Arrow connector between workflow steps */}
                {idx < submodules.length - 1 && (
                  <span className="hidden lg:block text-slate-300 text-xs px-0.5 font-bold">
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Workflow Stage Label indicator */}
        <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-slate-400 font-mono px-3">
          <span>Workflow:</span>
          <span className="text-blue-700 font-bold uppercase tracking-wider">
            {submodules.find((s) => s.id === activeSubTab)?.stage}
          </span>
        </div>
      </nav>

      {/* Global Action Notification Banner */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ========================================================
          SUBMODULE 1: MINERAL INVENTORY (Feedstock)
          ======================================================== */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Total Batches Registered
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 font-sans">
                  {feedstocks.length}
                </span>
                <span className="text-xs font-mono text-slate-500">Batches</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Across 2 Silos & Warehouses</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Available Stock
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 font-sans">
                  {feedstocks.reduce((acc, f) => acc + f.stockpileTons, 0).toFixed(1)}
                </span>
                <span className="text-xs font-mono text-slate-500">Tons</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">98.4% mean assay purity</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Reserved for Active Cycles
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-700 font-sans">
                  24.5
                </span>
                <span className="text-xs font-mono text-slate-500">Tons</span>
              </div>
              <span className="text-[10px] text-blue-700 font-medium">Allocated to MDP-01 & 02</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Consumed Stock (Cumulative)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 font-sans">
                  1,124.5
                </span>
                <span className="text-xs font-mono text-slate-500">Tons</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Empirical MRV accounted</span>
            </div>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by batch ID, mineral formula, or supplier..."
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <select
                value={inventoryFilterStatus}
                onChange={(e) => setInventoryFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Awaiting Approval">Awaiting Approval</option>
                <option value="Under Inspection">Under Inspection</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsInventoryModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Mineral Batch</span>
            </button>
          </div>

          {/* Mineral Batches Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  Mineral Feedstock Batches
                </h3>
                <p className="text-xs text-slate-500">
                  Register, track stockpiles, grain size verification, and test assays
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Traceability: End-to-End Cryptographic Ledger
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-2.5 px-3.5">Batch ID</th>
                    <th className="py-2.5 px-3.5">Mineral Reagent</th>
                    <th className="py-2.5 px-3.5">Stockpile & Capacity</th>
                    <th className="py-2.5 px-3.5">Purity & Grain Size</th>
                    <th className="py-2.5 px-3.5">Quality Assay</th>
                    <th className="py-2.5 px-3.5">Supplier & Date</th>
                    <th className="py-2.5 px-3.5 text-right">Contextual Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {feedstocks
                    .filter((f) => {
                      if (inventoryFilterStatus !== 'all' && f.qualityStatus !== inventoryFilterStatus) return false;
                      if (!inventorySearch) return true;
                      const q = inventorySearch.toLowerCase();
                      return (
                        f.batchNumber.toLowerCase().includes(q) ||
                        f.name.toLowerCase().includes(q) ||
                        f.chemicalFormula.toLowerCase().includes(q) ||
                        f.supplier.toLowerCase().includes(q)
                      );
                    })
                    .map((item) => {
                      const capacityPct = Math.min(
                        100,
                        Math.round((item.stockpileTons / item.capacityTons) * 100)
                      );

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                            {item.batchNumber}
                          </td>
                          <td className="py-3 px-3.5">
                            <span className="font-semibold text-slate-900 block">{item.name}</span>
                            <span className="font-mono text-[11px] text-blue-700 font-medium">
                              Formula: {item.chemicalFormula}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 min-w-[140px]">
                            <div className="flex items-center justify-between text-xs mb-1 font-mono">
                              <span className="font-bold text-slate-900">{item.stockpileTons} t</span>
                              <span className="text-slate-400 text-[10px]">/ {item.capacityTons} t</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  capacityPct > 30 ? 'bg-blue-600' : 'bg-amber-500'
                                }`}
                                style={{ width: `${capacityPct}%` }}
                              />
                            </div>
                          </td>
                          <td className="py-3 px-3.5 font-mono">
                            <span className="font-semibold text-slate-900 block">{item.purityPct}%</span>
                            <span className="text-slate-400 text-[10.5px]">
                              {item.grainSizeMicrons} µm d50
                            </span>
                          </td>
                          <td className="py-3 px-3.5">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                                item.qualityStatus === 'Approved'
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {item.qualityStatus === 'Approved' ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Clock className="w-3 h-3 text-amber-600" />
                              )}
                              <span>{item.qualityStatus || 'Approved'}</span>
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-[11px]">
                            <span className="text-slate-800 block truncate max-w-[160px]">
                              {item.supplier}
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">
                              {item.dateReceived || '18 Oct 2026'}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setIsSlurryModalOpen(true);
                              }}
                              className="px-3 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors ml-auto cursor-pointer"
                              title="Transition to Slurry Preparation with this batch"
                            >
                              <span>Prepare Slurry</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUBMODULE 2: SLURRY PREPARATION (Preparation)
          ======================================================== */}
      {activeSubTab === 'preparation' && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Prepared Slurry Batches
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 font-sans">
                  {slurryBatches.length}
                </span>
                <span className="text-xs font-mono text-slate-500">Batches</span>
              </div>
              <span className="text-[10px] text-teal-700 font-medium">
                {slurryBatches.filter((b) => b.status === 'Ready').length} Ready for Dosing
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Available Slurry Volume
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 font-sans">
                  {mixerTanks.reduce((acc, t) => acc + t.volumeLiters, 0).toLocaleString()}
                </span>
                <span className="text-xs font-mono text-slate-500">Liters</span>
              </div>
              <span className="text-[10px] text-slate-500">Across 2 continuous mixing tanks</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Slurry Mean Density
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-700 font-sans">
                  1.180
                </span>
                <span className="text-xs font-mono text-slate-500">g/cm³</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">4.0 : 1.0 water:solid ratio</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Mixer Agitation Status
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-slate-900 font-sans">
                  Tank 1: 450 RPM
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Suspension Stable & Shear Mixed</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-800 font-bold block">Wet Mixing & Dispersion Setup</span>
              <span className="text-slate-500 text-[11px]">
                Mix approved mineral mass with metered water to establish stabilized injection suspensions
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsSlurryModalOpen(true)}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Slurry Batch</span>
            </button>
          </div>

          {/* Slurry Batches Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  Prepared Slurry Batches
                </h3>
                <p className="text-xs text-slate-500">
                  Track concentration, water:solid ratios, tank assignment, and readiness
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Quality Criteria: Viscosity &lt; 50 cP
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-2.5 px-3.5">Slurry Batch</th>
                    <th className="py-2.5 px-3.5">Source Mineral</th>
                    <th className="py-2.5 px-3.5">Mass & Water</th>
                    <th className="py-2.5 px-3.5">Volume & Density</th>
                    <th className="py-2.5 px-3.5">Mixing Tank</th>
                    <th className="py-2.5 px-3.5">Status</th>
                    <th className="py-2.5 px-3.5 text-right">Contextual Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {slurryBatches.map((batch) => {
                    const isReady = batch.status === 'Ready';

                    return (
                      <tr key={batch.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                          {batch.batchNumber}
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="font-semibold text-slate-900 block">{batch.mineralType}</span>
                          <span className="text-[10.5px] text-slate-400 font-mono">
                            Ref #{batch.mineralBatchId}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-mono">
                          <span className="text-slate-900 font-semibold block">
                            {batch.mineralMassKg} kg mineral
                          </span>
                          <span className="text-slate-500 text-[10.5px]">
                            {batch.waterQuantityLiters} L water
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-mono">
                          <span className="font-bold text-blue-700 block">
                            {batch.totalVolumeLiters.toLocaleString()} L
                          </span>
                          <span className="text-slate-500 text-[10.5px]">
                            {(batch.densityGPerL / 1000).toFixed(3)} g/cm³ ({batch.concentrationGPerL} g/L)
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-slate-700">
                          <span className="font-medium block">{batch.tankName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{batch.preparedBy}</span>
                        </td>
                        <td className="py-3 px-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                              batch.status === 'Ready'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : batch.status === 'Preparing'
                                ? 'bg-teal-50 text-teal-800 border border-teal-200 animate-pulse'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span>{batch.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          {isReady ? (
                            <button
                              type="button"
                              onClick={() => {
                                setIsCreatePlanModalOpen(true);
                              }}
                              className="px-3 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1 transition-colors ml-auto cursor-pointer"
                              title="Transition to Dosing Setup with this batch"
                            >
                              <span>Create Dosing Plan</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs font-mono">Mixing In Progress</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mixing Tanks Live Telemetry Visualizer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mixerTanks.map((tank) => {
              const capPct = Math.round((tank.volumeLiters / tank.capacityLiters) * 100);

              return (
                <div key={tank.id} className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{tank.tankName}</h4>
                      <span className="text-xs text-slate-500 font-mono">Capacity: {tank.capacityLiters} L</span>
                    </div>
                    <span
                      className={`text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                        tank.status === 'Mixing'
                          ? 'bg-teal-100 text-teal-800 animate-pulse'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {tank.status}
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        tank.status === 'Mixing' ? 'bg-teal-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${capPct}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs font-mono text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Volume</span>
                      <strong>{tank.volumeLiters} L</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Density</span>
                      <strong className="text-blue-700">{(tank.densityGPerL / 1000).toFixed(3)}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Agitation</span>
                      <strong>{tank.motorRpm} RPM</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Temp</span>
                      <strong>{tank.temperatureC}°C</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          SUBMODULE 3: DOSING SETUP (Configuration)
          ======================================================== */}
      {activeSubTab === 'setup' && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Configured Plans
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 font-sans">
                  {dosingPlans.length}
                </span>
                <span className="text-xs font-mono text-slate-500">Plans</span>
              </div>
              <span className="text-[10px] text-slate-500">Scheduled for Godavari Reach</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Validated & Approved
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-emerald-700 font-sans">
                  {dosingPlans.filter((p) => p.status === 'Approved').length}
                </span>
                <span className="text-xs font-mono text-slate-500">Approved</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Interlocks cleared</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Queued for Execution
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-700 font-sans">
                  {dosingPlans.filter((p) => p.status === 'Queued').length}
                </span>
                <span className="text-xs font-mono text-slate-500">Queued</span>
              </div>
              <span className="text-[10px] text-blue-700 font-medium">Ready for vessel departure</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Target Injection Volume
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 font-sans">
                  {dosingPlans.reduce((acc, p) => acc + p.targetQuantityKg, 0).toLocaleString()}
                </span>
                <span className="text-xs font-mono text-slate-500">kg</span>
              </div>
              <span className="text-[10px] text-slate-500">Planned dry reagent equivalent</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-800 font-bold block">Pre-Flight Dosing Plan Configuration</span>
              <span className="text-slate-500 text-[11px]">
                Define target delivery setpoints, operating envelope limits, and equipment interlocks prior to active operations
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCreatePlanModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Dosing Plan</span>
            </button>
          </div>

          {/* Dosing Plans Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  Active & Scheduled Dosing Plans
                </h3>
                <p className="text-xs text-slate-500">
                  Target rates, slurry batch assignments, permissible operating envelopes, and validation readiness
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Rule: Strict pH Ceiling Envelope &lt; 8.5
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-2.5 px-3.5">Plan Code</th>
                    <th className="py-2.5 px-3.5">Site & Asset</th>
                    <th className="py-2.5 px-3.5">Slurry Batch</th>
                    <th className="py-2.5 px-3.5">Target Rate & Quantity</th>
                    <th className="py-2.5 px-3.5">Operating Envelope</th>
                    <th className="py-2.5 px-3.5">Plan Status</th>
                    <th className="py-2.5 px-3.5 text-right">Contextual Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {dosingPlans.map((plan) => {
                    const isApproved = plan.status === 'Approved' || plan.status === 'Queued';

                    return (
                      <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                          {plan.planCode}
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="font-semibold text-slate-900 block">{plan.assetName}</span>
                          <span className="text-[11px] text-slate-500">{plan.siteName}</span>
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="font-mono text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                            {plan.slurryBatchCode}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-mono">
                          <span className="font-bold text-slate-900 block">
                            {plan.targetRateKgHr} kg/hr
                          </span>
                          <span className="text-slate-500 text-[10.5px]">
                            {plan.targetQuantityKg} kg total ({plan.durationMinutes} mins)
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-[11px]">
                          <span className="text-emerald-700 font-mono font-semibold block">
                            Max pH: {plan.maxPlumePh}
                          </span>
                          <span className="text-slate-400 font-mono text-[10px]">
                            Max Pressure: {plan.maxPressureBar} bar
                          </span>
                        </td>
                        <td className="py-3 px-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold ${
                              plan.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : plan.status === 'Queued'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span>{plan.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          {isApproved ? (
                            <button
                              type="button"
                              onClick={() => {
                                handleSubTabChange('operations');
                                setNotice(`Switched to Dosing Operations with Plan ${plan.planCode} ready for execution.`);
                              }}
                              className="px-3 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition-colors ml-auto cursor-pointer"
                              title="Transition to active Dosing Operations"
                            >
                              <span>Start Approved Cycle</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setNotice(`Plan ${plan.planCode} validated and moved to Approved state.`);
                                setDosingPlans((prev) =>
                                  prev.map((p) => (p.id === plan.id ? { ...p, status: 'Approved' } : p))
                                );
                              }}
                              className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                            >
                              Validate Plan
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUBMODULE 4: DOSING OPERATIONS (Operations)
          ======================================================== */}
      {activeSubTab === 'operations' && (
        <div className="space-y-4">
          {/* Active Live Operational Banner */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Gauge className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">
                    Active Dosing Operations & Ingestion
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live telemetry, peristaltic pump controllers, discharge throttling, and interlocks
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-lg font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  <span>Cycle #149 In Progress</span>
                </span>
              </div>
            </div>

            {/* Active Cycle Live Telemetry Card */}
            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 text-sm font-sans">
                      MDP-02 (Delta Ranger) — Godavari Mid Reach
                    </span>
                    <span className="font-mono text-xs text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded font-bold">
                      Plan: PLAN-2026-149
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Allocated Slurry: #SLR-2026-441 (1.182 g/cm³ CaSiO₃) • Operator: Marcus Chen
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNotice('Cycle #149 paused by operator. Flow halted.')}
                    className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold cursor-pointer"
                  >
                    Pause Cycle
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNotice('Cycle #149 successfully completed and finalized for reconciliation.');
                      handleSubTabChange('history');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
                  >
                    Complete & Reconcile →
                  </button>
                </div>
              </div>

              {/* Progress & Target vs Actual Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">Target Rate</span>
                  <strong className="text-base text-slate-900">140.0 kg/hr</strong>
                  <span className="text-[9.5px] text-slate-400 block">Set by Plan</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">Actual Rate</span>
                  <strong className="text-base text-blue-700">142.0 kg/hr</strong>
                  <span className="text-[9.5px] text-emerald-600 font-sans block font-semibold">+1.4% variance (Nominal)</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">Delivered Quantity</span>
                  <strong className="text-base text-slate-900">490 kg</strong>
                  <span className="text-[9.5px] text-slate-400 block">of 700 kg (70%)</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="text-[10px] text-slate-400 block font-sans">Plume pH</span>
                  <strong className="text-base text-emerald-700">8.22</strong>
                  <span className="text-[9.5px] text-emerald-600 font-sans block font-semibold">Safe envelope &lt; 8.45</span>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono mb-1">
                  <span>Injection Progress: 490 / 700 kg</span>
                  <span>Elapsed: 3h 30m / 5h 00m</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>

            {/* Peristaltic Pump Hardware Actuators */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                Hardware Controller Status & Actuation
              </h4>

              {pumps.map((pump) => (
                <div
                  key={pump.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-slate-900 font-bold">{pump.pumpName}</strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                          pump.status === 'Running'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {pump.status}
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">
                      Mode: {pump.mode} • Vessel: {pump.vesselCode}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 font-mono text-center bg-white p-2 rounded-lg border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Speed</span>
                      <strong>{pump.speedRpm} RPM</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Flow Rate</span>
                      <strong className="text-blue-700">{pump.flowRateLPerMin} L/min</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Pressure</span>
                      <strong>{pump.pressureBar} bar</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Hose Wear</span>
                      <strong className={pump.hoseWearPct > 50 ? 'text-amber-600' : 'text-slate-700'}>
                        {pump.hoseWearPct}%
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTogglePump(pump.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        pump.status === 'Running'
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      }`}
                    >
                      {pump.status === 'Running' ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Standby</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Start Injection</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePurgeLine(pump.pumpName)}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer"
                      title="Flush line with freshwater"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Safety Interlock Disclaimer */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Safety Interlock:</strong> Real-time hardware telemetry streams in supervisory mode. Automated pump shutdown triggers if discharge pressure &gt; 3.0 bar or plume pH &gt; 8.45.
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-600 shrink-0">
                Interlocks: ARMED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUBMODULE 5: DOSING HISTORY & RECONCILIATION (Reconciliation)
          ======================================================== */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Completed Dosing Cycles
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 font-sans">
                  {reconciliationRecords.length + 145}
                </span>
                <span className="text-xs font-mono text-slate-500">Cycles</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">100% Empirically Reconciled</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Total Mass Delivered
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900 font-sans">
                  3,237
                </span>
                <span className="text-xs font-mono text-slate-500">kg (Last 3)</span>
              </div>
              <span className="text-[10px] text-slate-500">3,230 kg planned (+0.21% var)</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Slurry Volume Reconciled
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-blue-700 font-sans">
                  10,780
                </span>
                <span className="text-xs font-mono text-slate-500">Liters</span>
              </div>
              <span className="text-[10px] text-blue-700 font-medium">Matched with tank drawdowns</span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                Audit & Verification
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-emerald-700 font-sans">
                  DNV Verified
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 font-medium">Zero non-compliance flags</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-800 font-bold block">Empirical Mass Reconciliation Ledger</span>
              <span className="text-slate-500 text-[11px]">
                Compare planned setpoints against actual flow meter delivery, reconcile silo stocks, and export for Carbon Removal
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  alert('Exporting certified MRV reconciliation ledger to CSV...');
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export for Carbon Removal (CSV)</span>
              </button>
            </div>
          </div>

          {/* Dosing History & Reconciliation Table */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-sans">
                  Cycle Reconciliation Records
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed comparison between planned setpoints and empirical delivered quantities
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Variance Tolerance: ± 3.0%
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/80">
                  <tr>
                    <th className="py-2.5 px-3.5">Cycle ID</th>
                    <th className="py-2.5 px-3.5">Asset & Reach</th>
                    <th className="py-2.5 px-3.5">Slurry Batch</th>
                    <th className="py-2.5 px-3.5">Planned vs Actual Quantity</th>
                    <th className="py-2.5 px-3.5">Variance %</th>
                    <th className="py-2.5 px-3.5">Volume Reconciled</th>
                    <th className="py-2.5 px-3.5">Plume pH Mean</th>
                    <th className="py-2.5 px-3.5">Audit Status</th>
                    <th className="py-2.5 px-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {reconciliationRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900">
                        Cycle #{rec.cycleNumber}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="font-semibold text-slate-900 block">{rec.vesselName}</span>
                        <span className="text-[11px] text-slate-500">{rec.siteName}</span>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-blue-700 font-bold">
                        {rec.slurryBatchCode}
                      </td>
                      <td className="py-3 px-3.5 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{rec.actualQuantityKg} kg</span>
                          <span className="text-slate-400 text-[10px]">/ {rec.plannedQuantityKg} kg</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 font-mono">
                        <span
                          className={`font-bold ${
                            Math.abs(rec.variancePct) < 1.0 ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {rec.variancePct > 0 ? `+${rec.variancePct}%` : `${rec.variancePct}%`}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-800">
                        {rec.slurryVolumeReconciledL.toLocaleString()} L
                      </td>
                      <td className="py-3 px-3.5 font-mono text-emerald-700 font-semibold">
                        {rec.meanPlumePh}
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{rec.auditStatus}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReconciliationRecord(rec);
                            setIsReconciliationModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          INTERACTIVE MODALS & DRAWERS
          ======================================================== */}
      <MineralInventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        feedstocks={feedstocks}
        onAddBatch={handleAddFeedstockBatch}
      />

      <SlurryPreparationModal
        isOpen={isSlurryModalOpen}
        onClose={() => setIsSlurryModalOpen(false)}
        feedstocks={feedstocks}
        mixerTanks={mixerTanks}
        onBatchPrepared={handleBatchPrepared}
      />

      <CreateDosingPlanModal
        isOpen={isCreatePlanModalOpen}
        onClose={() => setIsCreatePlanModalOpen(false)}
        availableSlurryBatches={slurryBatches}
        assets={operationalAssetsData}
        onPlanCreated={handlePlanCreated}
      />

      <ReconciliationDetailsModal
        isOpen={isReconciliationModalOpen}
        onClose={() => setIsReconciliationModalOpen(false)}
        record={selectedReconciliationRecord}
      />
    </div>
  );
};
