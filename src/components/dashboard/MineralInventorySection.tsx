import React from 'react';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  PlusCircle,
  FileCheck2
} from 'lucide-react';
import { MineralFeedstock } from '../../types';

interface MineralInventorySectionProps {
  feedstocks: MineralFeedstock[];
  onOpenInventoryModal: () => void;
  onOpenAddBatchModal: () => void;
}

export const MineralInventorySection: React.FC<MineralInventorySectionProps> = ({
  feedstocks,
  onOpenInventoryModal,
  onOpenAddBatchModal,
}) => {
  // Aggregate KPI Calculations
  const totalQuantityTons = feedstocks.reduce((acc, f) => acc + f.stockpileTons, 0);
  const totalBatchesCount = feedstocks.length;
  const awaitingApprovalBatches = feedstocks.filter(
    (f) => f.qualityStatus === 'Awaiting Approval' || f.qualityStatus === 'Under Inspection'
  );
  const awaitingApprovalTons = awaitingApprovalBatches.reduce((acc, f) => acc + f.stockpileTons, 0);
  const lowStockFeedstocks = feedstocks.filter(
    (f) => f.stockpileTons <= f.reorderLevelTons * 2.5
  );

  return (
    <section className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Boxes className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
              Mineral Inventory
            </h2>
            <p className="text-xs text-slate-500">
              Alkaline feedstock silos, batch assay certificates, and stockpile levels
            </p>
          </div>
        </div>

        {/* Contextual Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenInventoryModal}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>View Inventory</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddBatchModal}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manage Feedstock</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            Total Available Mineral
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 font-sans">
              {totalQuantityTons.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-500">Tons</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">98.4% mean assay</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            Available Mineral Batches
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 font-sans">
              {totalBatchesCount}
            </span>
            <span className="text-xs font-mono text-slate-500">Batches</span>
          </div>
          <span className="text-[10px] text-slate-500">2 Silos • 2 Warehouses</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            Awaiting Quality Approval
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-amber-600 font-sans">
              {awaitingApprovalBatches.length}
            </span>
            <span className="text-xs font-mono text-slate-500">
              ({awaitingApprovalTons.toFixed(1)} t)
            </span>
          </div>
          <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Heavy-metal assay in lab</span>
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            Low-Stock Warnings
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 font-sans">
              {lowStockFeedstocks.length}
            </span>
            <span className="text-xs font-mono text-slate-500">Alert</span>
          </div>
          <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            <span>Mg(OH)₂ near reorder point</span>
          </span>
        </div>
      </div>

      {/* Feedstock Batches Table */}
      <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-600 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/80">
            <tr>
              <th className="py-2.5 px-3">Batch ID</th>
              <th className="py-2.5 px-3">Mineral Type</th>
              <th className="py-2.5 px-3">Quantity & Stockpile</th>
              <th className="py-2.5 px-3">Purity / Grain Size</th>
              <th className="py-2.5 px-3">Quality Status</th>
              <th className="py-2.5 px-3">Date Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
            {feedstocks.map((batch) => {
              const capacityPct = Math.min(
                100,
                Math.round((batch.stockpileTons / batch.capacityTons) * 100)
              );

              return (
                <tr key={batch.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                    {batch.batchNumber}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-900 block">{batch.name}</span>
                    <span className="font-mono text-[11px] text-blue-700">
                      Formula: {batch.chemicalFormula}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 min-w-[130px]">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold font-mono text-slate-900">
                        {batch.stockpileTons} t
                      </span>
                      <span className="text-slate-400 text-[10px] font-mono">
                        / {batch.capacityTons} t
                      </span>
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
                  <td className="py-2.5 px-3 font-mono">
                    <span className="text-slate-900 font-semibold block">{batch.purityPct}%</span>
                    <span className="text-slate-500 text-[10.5px]">
                      {batch.grainSizeMicrons} µm d50
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                        batch.qualityStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : batch.qualityStatus === 'Awaiting Approval'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {batch.qualityStatus === 'Approved' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Clock className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{batch.qualityStatus || 'Approved'}</span>
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                    {batch.dateReceived || '18 Oct 2026'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

