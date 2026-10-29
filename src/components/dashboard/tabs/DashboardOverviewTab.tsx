import React, { useState } from 'react';
import {
  Database,
  MapPin,
  Sparkles,
  Layers,
  Activity,
  Droplets,
  Boxes,
  Gauge,
  Sliders,
  History,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

import { DashboardPlatformKpis } from '../DashboardPlatformKpis';
import { MineralInventorySection } from '../MineralInventorySection';
import { SlurryPreparationSection } from '../SlurryPreparationSection';
import { DosingOperationsSection } from '../DosingOperationsSection';
import { OperationalAlertsSection } from '../OperationalAlertsSection';
import { RecentActivitySection } from '../RecentActivitySection';
import { AssetDeploymentsTable } from '../AssetDeploymentsTable';
import { SystemStatusPanel } from '../SystemStatusPanel';
import { DeploymentMap } from '../../home/DeploymentMap';
import { MapLegend } from '../../home/MapLegend';

import { SlurryPreparationModal } from '../modals/SlurryPreparationModal';
import { MineralInventoryModal } from '../modals/MineralInventoryModal';
import { DosingDetailsModal } from '../modals/DosingDetailsModal';

import {
  dashboardOverviewKpis,
  operationalAssetsData,
  mineralFeedstocksData,
  slurryMixerTanksData,
  pumpControllersData,
  dosingCyclesData,
  subsystemHealthData
} from '../../../data/dashboardData';
import { publicHomeData } from '../../../data/publicHome';
import { MineralFeedstock, SlurryMixerTank, DosingCycle, PumpController } from '../../../types';

export const DashboardOverviewTab: React.FC = () => {
  // Operational State
  const [feedstocks, setFeedstocks] = useState<MineralFeedstock[]>(mineralFeedstocksData);
  const [mixerTanks, setMixerTanks] = useState<SlurryMixerTank[]>(slurryMixerTanksData);
  const [cycles, setCycles] = useState<DosingCycle[]>(dosingCyclesData);
  const [pumps, setPumps] = useState<PumpController[]>(pumpControllersData);

  // Modals / Drawers State
  const [isSlurryModalOpen, setIsSlurryModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [isDosingDetailsModalOpen, setIsDosingDetailsModalOpen] = useState(false);
  const [selectedCycleForModal, setSelectedCycleForModal] = useState<DosingCycle | null>(cycles[0] || null);
  const [dosingModalMode, setDosingModalMode] = useState<'details' | 'configure' | 'history'>('details');

  // Interactive Slurry Preparation Handler
  const handleBatchPrepared = (newBatch: {
    tankId: string;
    batchNumber: string;
    mineralMassKg: number;
    waterLiters: number;
    densityGPerL: number;
    concentrationGPerL: number;
  }) => {
    setMixerTanks((prev) =>
      prev.map((tank) => {
        if (tank.id === newBatch.tankId) {
          return {
            ...tank,
            status: 'Mixing',
            volumeLiters: Math.min(tank.capacityLiters, tank.volumeLiters + Math.round(newBatch.waterLiters + newBatch.mineralMassKg / 2.8)),
            densityGPerL: newBatch.densityGPerL,
            motorRpm: 450
          };
        }
        return tank;
      })
    );
  };

  // Interactive Feedstock Delivery Handler
  const handleAddBatch = (newBatch: MineralFeedstock) => {
    setFeedstocks((prev) => [newBatch, ...prev]);
  };

  // Open Dosing Modal with specific mode
  const openDosingModal = (cycle: DosingCycle, mode: 'details' | 'configure' | 'history') => {
    setSelectedCycleForModal(cycle);
    setDosingModalMode(mode);
    setIsDosingDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Operational Status Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight font-sans">
              Operational Catchment: Godavari Delta Reach
            </span>
            <span className="text-[11px] text-slate-500">
              Integrated Mineral Feedstock, Slurry Continuous Mixing & Peristaltic Dosing Telemetry
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md font-semibold">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Ingest Stream: Active (1 Hz)</span>
          </span>
        </div>
      </div>

      {/* SECTION A: Platform Overview (Compact KPI Row) */}
      <DashboardPlatformKpis kpis={dashboardOverviewKpis} />

      {/* SECTION B: Mineral Inventory Overview */}
      <MineralInventorySection
        feedstocks={feedstocks}
        onOpenInventoryModal={() => setIsInventoryModalOpen(true)}
        onOpenAddBatchModal={() => setIsInventoryModalOpen(true)}
      />

      {/* SECTION C: Slurry Preparation Overview */}
      <SlurryPreparationSection
        mixerTanks={mixerTanks}
        onOpenPrepareSlurryModal={() => setIsSlurryModalOpen(true)}
      />

      {/* SECTION D: Dosing Operations Overview */}
      <DosingOperationsSection
        cycles={cycles}
        pumps={pumps}
        onOpenCycleDetails={(cycle) => openDosingModal(cycle, 'details')}
        onOpenConfigureDosing={() => openDosingModal(cycles[0], 'configure')}
        onOpenDosingHistory={() => openDosingModal(cycles[0], 'history')}
      />

      {/* SECTION E: Operational Alerts */}
      <OperationalAlertsSection />

      {/* SECTION F: Recent Activity */}
      <RecentActivitySection />

      {/* SECTION G: Fleet Spatial Reach & Hardware Subsystem Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Basin Spatial Map Preview */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-sans">
                    Basin Spatial Fleet & Station Reach
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time positions of mobile dosing platforms and fixed sonde stations
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded font-semibold">
                Godavari Delta
              </span>
            </div>

            <DeploymentMap
              deployments={publicHomeData.deployments}
              height="h-[290px]"
            />
          </div>

          <div className="mt-3">
            <MapLegend />
          </div>
        </div>

        {/* Right: Subsystem Telemetry & Power Health */}
        <div className="lg:col-span-5 h-full">
          <SystemStatusPanel subsystems={subsystemHealthData} />
        </div>
      </div>

      {/* SECTION H: Active Asset Deployments Table */}
      <div>
        <AssetDeploymentsTable assets={operationalAssetsData} />
      </div>

      {/* Interactive Drawers & Modals */}
      <SlurryPreparationModal
        isOpen={isSlurryModalOpen}
        onClose={() => setIsSlurryModalOpen(false)}
        feedstocks={feedstocks}
        mixerTanks={mixerTanks}
        onBatchPrepared={handleBatchPrepared}
      />

      <MineralInventoryModal
        isOpen={isInventoryModalOpen}
        onClose={() => setIsInventoryModalOpen(false)}
        feedstocks={feedstocks}
        onAddBatch={handleAddBatch}
      />

      <DosingDetailsModal
        isOpen={isDosingDetailsModalOpen}
        onClose={() => setIsDosingDetailsModalOpen(false)}
        cycle={selectedCycleForModal}
        pumps={pumps}
        mode={dosingModalMode}
      />
    </div>
  );
};
