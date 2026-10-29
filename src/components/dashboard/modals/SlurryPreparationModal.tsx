import React, { useState } from 'react';
import { X, Droplets, CheckCircle2, AlertTriangle, Calculator, Sparkles } from 'lucide-react';
import { MineralFeedstock, SlurryMixerTank } from '../../../types';

interface SlurryPreparationModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedstocks: MineralFeedstock[];
  mixerTanks: SlurryMixerTank[];
  onBatchPrepared: (newBatch: {
    tankId: string;
    batchNumber: string;
    mineralMassKg: number;
    waterLiters: number;
    densityGPerL: number;
    concentrationGPerL: number;
  }) => void;
}

export const SlurryPreparationModal: React.FC<SlurryPreparationModalProps> = ({
  isOpen,
  onClose,
  feedstocks,
  mixerTanks,
  onBatchPrepared,
}) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string>(feedstocks[0]?.id || '');
  const [mineralMassKg, setMineralMassKg] = useState<string>('1200');
  const [waterQuantityLiters, setWaterQuantityLiters] = useState<string>('4000');
  const [selectedTankId, setSelectedTankId] = useState<string>(mixerTanks[0]?.id || '');
  const [operatorName, setOperatorName] = useState<string>('Dr. Elena Vance');
  const [prepNotes, setPrepNotes] = useState<string>('Standard 4:1 wet dispersion for Kesinapalli morning dosing');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Selected Mineral
  const activeMineral = feedstocks.find((f) => f.id === selectedBatchId) || feedstocks[0];
  const targetTank = mixerTanks.find((t) => t.id === selectedTankId) || mixerTanks[0];

  // Derived Calculations
  const massKg = parseFloat(mineralMassKg) || 0;
  const waterL = parseFloat(waterQuantityLiters) || 0;
  // Specific gravity of mineral assumed ~2.8 g/cm3
  const mineralVolumeL = massKg > 0 ? massKg / 2.8 : 0;
  const resultingTotalVolumeL = Math.round(waterL + mineralVolumeL);
  const concentrationGPerL = resultingTotalVolumeL > 0 ? Math.round(massKg / (resultingTotalVolumeL / 1000)) : 0;
  const densityGPerCm3 = resultingTotalVolumeL > 0 ? ((waterL + massKg) / resultingTotalVolumeL).toFixed(3) : '1.000';
  const waterToSolidRatio = massKg > 0 ? (waterL / massKg).toFixed(1) : '—';

  // Tank capacity check
  const tankCapacityExceeded = resultingTotalVolumeL > (targetTank?.capacityLiters || 6000);
  const massExceedsStockpile = massKg / 1000 > (activeMineral?.stockpileTons || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (massKg <= 0 || waterL <= 0) {
      setErrorMsg('Please specify positive values for mineral mass and water quantity.');
      return;
    }
    if (tankCapacityExceeded) {
      setErrorMsg(`Resulting volume (${resultingTotalVolumeL} L) exceeds tank capacity (${targetTank?.capacityLiters || 6000} L).`);
      return;
    }
    if (massExceedsStockpile) {
      setErrorMsg(`Requested mass (${massKg} kg) exceeds available stockpile (${activeMineral.stockpileTons * 1000} kg).`);
      return;
    }

    setErrorMsg(null);
    setSuccessNotice(`Slurry batch successfully prepared and queued in ${targetTank.tankName}.`);

    onBatchPrepared({
      tankId: targetTank.id,
      batchNumber: activeMineral.batchNumber,
      mineralMassKg: massKg,
      waterLiters: waterL,
      densityGPerL: Math.round(parseFloat(densityGPerCm3) * 1000),
      concentrationGPerL,
    });

    setTimeout(() => {
      setSuccessNotice(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Prepare Slurry Batch
              </h3>
              <p className="text-xs text-slate-500">
                Configure mineral batch, water mass, target mixer tank, and derived suspension metrics
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

        {/* Feedback notifications */}
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
          {/* Mineral Batch Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Select Mineral Batch <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
            >
              {feedstocks.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} (Batch #{f.batchNumber}) — {f.stockpileTons} t available ({f.purityPct}% purity)
                </option>
              ))}
            </select>
          </div>

          {/* Mass & Water inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Mineral Mass (kg) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={mineralMassKg}
                onChange={(e) => setMineralMassKg(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                placeholder="e.g. 1200"
              />
              <span className="text-[10.5px] text-slate-400 mt-1 block">
                Available in silo: {(activeMineral?.stockpileTons || 0) * 1000} kg
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Water Quantity (Liters) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="500"
                step="100"
                value={waterQuantityLiters}
                onChange={(e) => setWaterQuantityLiters(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                placeholder="e.g. 4000"
              />
              <span className="text-[10.5px] text-slate-400 mt-1 block">
                Freshwater feed inlet
              </span>
            </div>
          </div>

          {/* Derived Calculation Preview Card */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80">
            <div className="flex items-center gap-1.5 text-teal-900 font-bold mb-2">
              <Calculator className="w-3.5 h-3.5 text-teal-700" />
              <span>Calculated Slurry Properties (Empirical Derived)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
              <div className="bg-white p-2 rounded-lg border border-teal-200/60">
                <span className="text-[10px] text-slate-500 block font-sans">Total Volume</span>
                <strong className="text-slate-900">{resultingTotalVolumeL} L</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-teal-200/60">
                <span className="text-[10px] text-slate-500 block font-sans">Slurry Density</span>
                <strong className="text-teal-700">{densityGPerCm3} g/cm³</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-teal-200/60">
                <span className="text-[10px] text-slate-500 block font-sans">Concentration</span>
                <strong className="text-blue-700">{concentrationGPerL} g/L</strong>
              </div>
              <div className="bg-white p-2 rounded-lg border border-teal-200/60">
                <span className="text-[10px] text-slate-500 block font-sans">Water:Solid</span>
                <strong className="text-slate-900">{waterToSolidRatio} : 1.0</strong>
              </div>
            </div>
          </div>

          {/* Target Tank & Operator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Target Mixing Tank <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedTankId}
                onChange={(e) => setSelectedTankId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 cursor-pointer"
              >
                {mixerTanks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.tankName} ({t.volumeLiters}/{t.capacityLiters} L)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Operator in Charge <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          {/* Preparation Notes */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Preparation Notes & Run Purpose
            </label>
            <input
              type="text"
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={tankCapacityExceeded || massExceedsStockpile}
              className={`px-5 py-2 rounded-lg font-semibold text-white transition-colors cursor-pointer shadow-xs ${
                tankCapacityExceeded || massExceedsStockpile
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-teal-600 hover:bg-teal-700 active:bg-teal-800'
              }`}
            >
              Confirm Slurry Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

