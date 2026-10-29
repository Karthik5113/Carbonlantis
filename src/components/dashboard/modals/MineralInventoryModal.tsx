import React, { useState } from 'react';
import { X, Boxes, ShieldCheck, CheckCircle2, FileText, AlertTriangle, Plus } from 'lucide-react';
import { MineralFeedstock } from '../../../types';

interface MineralInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedstocks: MineralFeedstock[];
  onAddBatch?: (newBatch: MineralFeedstock) => void;
}

export const MineralInventoryModal: React.FC<MineralInventoryModalProps> = ({
  isOpen,
  onClose,
  feedstocks,
  onAddBatch,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'add'>('inventory');
  const [batchNumber, setBatchNumber] = useState('');
  const [mineralName, setMineralName] = useState('Calcium Silicate (Wollastonite Micro-powder)');
  const [chemicalFormula, setChemicalFormula] = useState('CaSiO3');
  const [stockpileTons, setStockpileTons] = useState('50');
  const [supplier, setSupplier] = useState('Deccan GeoMinerals Ltd');
  const [purityPct, setPurityPct] = useState('98.5');
  const [grainSize, setGrainSize] = useState('45');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNumber.trim()) return;

    const newFeedstock: MineralFeedstock = {
      id: `min-${Date.now()}`,
      name: mineralName,
      chemicalFormula,
      stockpileTons: parseFloat(stockpileTons) || 50,
      capacityTons: 150,
      dailyConsumptionTons: 2.5,
      grainSizeMicrons: parseFloat(grainSize) || 45,
      purityPct: parseFloat(purityPct) || 98.5,
      reorderLevelTons: 25,
      supplier,
      batchNumber: batchNumber.trim().toUpperCase(),
      dateReceived: 'Today, Just now',
      qualityStatus: 'Approved'
    };

    if (onAddBatch) {
      onAddBatch(newFeedstock);
    }

    setSuccessNotice(`Feedstock Batch #${newFeedstock.batchNumber} logged and validated successfully.`);
    setTimeout(() => {
      setSuccessNotice(null);
      setActiveTab('inventory');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-sans">
                Mineral Inventory & Feedstock Management
              </h3>
              <p className="text-xs text-slate-500">
                Alkaline reagent stockpiles, quality certificates, grain size verification, and intake audit
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

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-slate-100 flex items-center gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'inventory'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Available Stockpiles & Silos ({feedstocks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`pb-2.5 border-b-2 transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'add'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Incoming Delivery</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {successNotice && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successNotice}</span>
            </div>
          )}

          {activeTab === 'inventory' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feedstocks.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                          <span className="text-xs font-mono text-blue-700 font-bold block">
                            Formula: {item.chemicalFormula} • Batch #{item.batchNumber}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-800 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                          {item.stockpileTons} / {item.capacityTons} t
                        </span>
                      </div>

                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{
                            width: `${Math.min(100, Math.round((item.stockpileTons / item.capacityTons) * 100))}%`
                          }}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">Grain Size</span>
                          <strong>{item.grainSizeMicrons} µm</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">Assay Purity</span>
                          <strong className="text-emerald-700">{item.purityPct}%</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-sans">Status</span>
                          <strong className="text-blue-700 font-sans">{item.qualityStatus || 'Approved'}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Supplier: {item.supplier}</span>
                      <span className="font-mono text-slate-400">Received: {item.dateReceived || '18 Oct 2026'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quality & Traceability Certification Box */}
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    All alkaline minerals comply with ISO 17025 certified heavy-metal ICP-MS assays (&lt;1 ppm As, Cd, Pb, Hg).
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-white border border-blue-200 px-2 py-0.5 rounded text-blue-800 font-semibold shrink-0">
                  Assay: DNV Validated
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAddBatchSubmit} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Batch Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g. WOL-2026-10"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Delivered Quantity (Tons) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={stockpileTons}
                    onChange={(e) => setStockpileTons(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Mineral Reagent Type
                  </label>
                  <select
                    value={mineralName}
                    onChange={(e) => setMineralName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-medium outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Calcium Silicate (Wollastonite Micro-powder)">
                      Calcium Silicate (CaSiO3)
                    </option>
                    <option value="Magnesium Hydroxide Slurry Feedstock">
                      Magnesium Hydroxide (Mg(OH)2)
                    </option>
                    <option value="Ultrafine Calcium Carbonate (Calcite)">
                      Calcium Carbonate (CaCO3)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Supplier & Origin
                  </label>
                  <input
                    type="text"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Certified Purity (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={purityPct}
                    onChange={(e) => setPurityPct(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Grain Size d50 (µm)
                  </label>
                  <input
                    type="number"
                    value={grainSize}
                    onChange={(e) => setGrainSize(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 font-mono outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('inventory')}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 font-semibold text-white transition-colors cursor-pointer shadow-xs"
                >
                  Save Batch & Deposit Silo
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

