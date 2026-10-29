import React, { useState } from 'react';
import { X, Sliders, CheckCircle2, AlertTriangle, ShieldCheck, Ship, Droplets } from 'lucide-react';
import { DosingPlan, SlurryBatchRecord, OperationalAsset } from '../../../types';

interface CreateDosingPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableSlurryBatches: SlurryBatchRecord[];
  assets: OperationalAsset[];
  onPlanCreated: (plan: DosingPlan) => void;
}

export const CreateDosingPlanModal: React.FC<CreateDosingPlanModalProps> = ({
  isOpen,
  onClose,
  availableSlurryBatches,
  assets,
  onPlanCreated,
}) => {
  const readyBatches = availableSlurryBatches.filter((b) => b.status === 'Ready');
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.id || '');
  const [selectedBatchCode, setSelectedBatchCode] = useState(
    readyBatches[0]?.batchNumber || availableSlurryBatches[0]?.batchNumber || 'SLR-2026-442'
  );
  const [targetRateKgHr, setTargetRateKgHr] = useState('160');
  const [targetQuantityKg, setTargetQuantityKg] = useState('640');
  const [durationMinutes, setDurationMinutes] = useState('240');
  const [maxPlumePh, setMaxPlumePh] = useState('8.45');
  const [maxPressureBar, setMaxPressureBar] = useState('2.8');
  const [operator, setOperator] = useState('Dr. Elena Vance');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = parseFloat(targetRateKgHr) || 0;
    const qty = parseFloat(targetQuantityKg) || 0;

    if (rate <= 0 || qty <= 0) {
      setErrorMsg('Target rate and quantity must be positive numbers.');
      return;
    }

    const newPlan: DosingPlan = {
      id: `plan-${Date.now()}`,
      planCode: `PLAN-2026-${Math.floor(150 + Math.random() * 50)}`,
      siteName: activeAsset ? activeAsset.catchment : 'Godavari Mid Reach',
      assetName: activeAsset ? `${activeAsset.name}` : 'MDP-01 (Vessel Albatross)',
      slurryBatchCode: selectedBatchCode,
      targetRateKgHr: rate,
      targetQuantityKg: qty,
      durationMinutes: parseInt(durationMinutes, 10) || 240,
      maxPlumePh: parseFloat(maxPlumePh) || 8.45,
      maxPressureBar: parseFloat(maxPressureBar) || 2.8,
      status: 'Approved',
      operator,
      createdDate: 'Today, Just now'
    };

    onPlanCreated(newPlan);
    setSuccessNotice(`Dosing Plan ${newPlan.planCode} configured, validated, and approved for execution.`);
    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Create & Validate Dosing Plan
              </h3>
              <p className="text-xs text-slate-500">
                Define target injection rate, slurry batch allocation, duration, and safety thresholds
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

        {/* Feedback banners */}
        {errorMsg && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="mx-5 mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-sans">
          {/* Asset & Catchment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Select Dosing Asset & Site <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.catchment})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Allocate Slurry Batch <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedBatchCode}
                onChange={(e) => setSelectedBatchCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
              >
                {availableSlurryBatches.map((b) => (
                  <option key={b.id} value={b.batchNumber}>
                    {b.batchNumber} — {b.mineralType} ({b.totalVolumeLiters} L, {b.status})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target Rate & Target Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Target Rate (kg/hr) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="20"
                max="400"
                step="5"
                value={targetRateKgHr}
                onChange={(e) => setTargetRateKgHr(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Velocity proportional</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Target Quantity (kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="100"
                step="20"
                value={targetQuantityKg}
                onChange={(e) => setTargetQuantityKg(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Total dry equivalent</span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Planned Duration (mins)
              </label>
              <input
                type="number"
                min="30"
                step="15"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">~{(parseInt(durationMinutes, 10) / 60 || 4).toFixed(1)} hours</span>
            </div>
          </div>

          {/* Permissible Operating Limits */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-1.5 text-slate-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Permissible Operating Limits & Interlocks</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="text-[10.5px] text-slate-500 block font-sans mb-1">
                  Max Plume pH Ceiling (Envelope &lt; 8.5)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={maxPlumePh}
                  onChange={(e) => setMaxPlumePh(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10.5px] text-slate-500 block font-sans mb-1">
                  Max Discharge Pressure (bar)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={maxPressureBar}
                  onChange={(e) => setMaxPressureBar(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-2 text-xs font-bold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Operator */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Authorized Planning Operator
            </label>
            <input
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Validate & Approve Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

