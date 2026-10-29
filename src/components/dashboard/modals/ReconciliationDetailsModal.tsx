import React from 'react';
import { X, History, CheckCircle2, Download, ShieldCheck, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { DosingReconciliationRecord } from '../../../types';

interface ReconciliationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DosingReconciliationRecord | null;
}

export const ReconciliationDetailsModal: React.FC<ReconciliationDetailsModalProps> = ({
  isOpen,
  onClose,
  record,
}) => {
  if (!isOpen || !record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Cycle #{record.cycleNumber} Reconciliation & Audit
              </h3>
              <p className="text-xs text-slate-500">
                {record.vesselName} • {record.siteName}
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

        {/* Content */}
        <div className="p-5 space-y-4 text-xs font-sans">
          {/* Planned vs Actual Comparison Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Material Mass Balance</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{record.auditStatus}</span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 font-mono text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-sans">Planned Target</span>
                <strong className="text-sm text-slate-900">{record.plannedQuantityKg} kg</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-sans">Actual Delivered</span>
                <strong className="text-sm text-blue-700">{record.actualQuantityKg} kg</strong>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 block font-sans">Variance</span>
                <strong className="text-sm text-emerald-700">
                  {record.variancePct > 0 ? `+${record.variancePct}%` : `${record.variancePct}%`}
                </strong>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[11px]">Slurry Batch Allocated:</span>
              <strong className="text-slate-900 font-mono">{record.slurryBatchCode}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Slurry Volume Reconciled:</span>
              <strong className="text-slate-900 font-mono">{record.slurryVolumeReconciledL} Liters</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Operational Window:</span>
              <span className="text-slate-700 font-mono">{record.startTime} → {record.endTime}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mean Plume pH:</span>
              <strong className="text-emerald-700 font-mono">{record.meanPlumePh} (Baseline safe)</strong>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">Audited & Signed by:</span>
              <span className="font-semibold text-slate-800">{record.auditor}</span>
            </div>
          </div>

          {/* DNV / Verifier Assurance */}
          <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Empirical mass reconciliation verified against inline peristaltic encoder telemetry and downstream DIC sensors.
            </span>
          </div>

          {/* Export Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                alert(`Exporting CSV reconciliation package for Cycle #${record.cycleNumber}...`);
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Record for MRV (CSV)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

