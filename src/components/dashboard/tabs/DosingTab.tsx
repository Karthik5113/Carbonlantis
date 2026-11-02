import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Navigation,
  Send,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Clock,
  Compass,
  User,
  Activity,
  Layers,
  BatteryCharging,
  Sliders,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  X,
  Play,
  Pause,
  RotateCcw,
  Waves,
  ArrowDown
} from 'lucide-react';
import { useSlurryDosing, DosingTripRecord } from '../../../context/SlurryDosingContext';

// Drone asset specifications for dosing missions
interface DosingAssetOption {
  id: string;
  name: string;
  code: string;
  type: string;
  maxPayloadLiters: number;
  batteryPct: number;
  defaultCatchment: string;
  status: 'Ready' | 'Active Dosing' | 'In Transit';
}

const DOSING_ASSETS: DosingAssetOption[] = [
  {
    id: 'AquaDrone_MVP_001',
    name: 'AquaDrone_MVP_001',
    code: 'AD-01',
    type: 'Autonomous Surface Vessel (Delta Corridors)',
    maxPayloadLiters: 350,
    batteryPct: 94,
    defaultCatchment: 'Kesinapalli Canal Reach 1 (Godavari Delta)',
    status: 'Ready'
  },
  {
    id: 'AquaDrone_DOS_002',
    name: 'AquaDrone_DOS_002',
    code: 'AD-02',
    type: 'Mid-River High-Capacity Dosing Drone',
    maxPayloadLiters: 400,
    batteryPct: 88,
    defaultCatchment: 'Nidamanuru Reach 2 (Mid-river transect)',
    status: 'Ready'
  },
  {
    id: 'AquaDrone_DWN_003',
    name: 'AquaDrone_DWN_003',
    code: 'AD-03',
    type: 'Estuary & Tidal Dosing Vessel',
    maxPayloadLiters: 300,
    batteryPct: 76,
    defaultCatchment: 'Dowleswaram Barrage Outfall Reach',
    status: 'Ready'
  }
];

const CATCHMENT_REACH_PRESETS = [
  'Kesinapalli Canal Reach 1 (Godavari Delta)',
  'Nidamanuru Reach 2 (Mid-river transect)',
  'Dowleswaram Barrage Outfall Reach',
  'Coringa Mangrove Tidal Transect',
  'Yanam Estuary Dispersion Transect'
];

export const DosingTab: React.FC = () => {
  const navigate = useNavigate();
  const { tanks, dosingTrips, createDosingTrip } = useSlurryDosing();

  // Selected state for Trip Creation
  const [selectedAssetId, setSelectedAssetId] = useState<string>('AquaDrone_MVP_001');
  // Selected batch identifier stored as "tankId:batchId"
  const [selectedBatchKey, setSelectedBatchKey] = useState<string>('');
  const [quantityToLoad, setQuantityToLoad] = useState<number | ''>('');
  const [catchmentReach, setCatchmentReach] = useState<string>('Kesinapalli Canal Reach 1 (Godavari Delta)');
  const [dosingRateLPerHr, setDosingRateLPerHr] = useState<number>(8.5);
  const [scheduledDate, setScheduledDate] = useState<string>('2026-11-01');
  const [scheduledTime, setScheduledTime] = useState<string>('08:00 AM');
  const [operator, setOperator] = useState<string>('Dr. Elena Vance (Lead Operator)');
  const [missionNotes, setMissionNotes] = useState<string>('Low-shear alkaline dispersion along tidal ebb flow corridor, RTK guidance active');

  // History search and filter state
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active Dosing' | 'In Transit' | 'Scheduled' | 'Completed'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Selected trip for live dosing & tanker inspection
  const [selectedTrip, setSelectedTrip] = useState<DosingTripRecord | null>(null);
  const [liveRemaining, setLiveRemaining] = useState<number>(0);
  const [liveDosed, setLiveDosed] = useState<number>(0);
  const [isDosingActive, setIsDosingActive] = useState<boolean>(true);

  // Open trip and initialize live values
  const handleSelectTrip = (trip: DosingTripRecord) => {
    setSelectedTrip(trip);
    if (trip.status === 'Completed') {
      setLiveRemaining(0);
      setLiveDosed(trip.quantityLiters);
      setIsDosingActive(false);
    } else if (trip.status === 'Active Dosing') {
      // Simulate that around ~45% is remaining in the tanker
      const initialRemaining = Math.max(12, Math.round(trip.quantityLiters * 0.45 * 10) / 10);
      setLiveRemaining(initialRemaining);
      setLiveDosed(Math.round((trip.quantityLiters - initialRemaining) * 10) / 10);
      setIsDosingActive(true);
    } else {
      // In Transit or Scheduled: full load ready for dispatch
      setLiveRemaining(trip.quantityLiters);
      setLiveDosed(0);
      setIsDosingActive(false);
    }
  };

  // Real-time decreasing interval effect for active dosing
  useEffect(() => {
    if (!selectedTrip || !isDosingActive) return;

    const timer = setInterval(() => {
      setLiveRemaining((prevRemaining) => {
        if (prevRemaining <= 0.15) {
          setIsDosingActive(false);
          return 0;
        }
        // Decreasing in real-time by 0.15 Liters per tick
        const step = 0.15;
        const nextRemaining = Math.max(0, +(prevRemaining - step).toFixed(2));
        setLiveDosed((prevDosed) => +(prevDosed + step).toFixed(2));
        return nextRemaining;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTrip, isDosingActive]);

  // Flatten all available batches from Tanks T001 and T002
  const allAvailableBatches = tanks.flatMap((tank) =>
    tank.batches
      .filter((batch) => batch.slurryVolumeLiters > 0)
      .map((batch) => ({
        ...batch,
        tankId: tank.id,
        tankName: tank.name,
        key: `${tank.id}:${batch.batchId}`
      }))
  );

  // Find currently selected batch object
  const activeSelectedBatch = allAvailableBatches.find((b) => b.key === selectedBatchKey) || null;
  const activeSelectedAsset = DOSING_ASSETS.find((a) => a.id === selectedAssetId) || DOSING_ASSETS[0];

  // Selected tank containing this batch
  const selectedTank = activeSelectedBatch ? tanks.find((t) => t.id === activeSelectedBatch.tankId) : null;

  // Validation
  const numericQuantity = Number(quantityToLoad) || 0;
  const isQuantityValid =
    numericQuantity > 0 &&
    activeSelectedBatch !== null &&
    numericQuantity <= activeSelectedBatch.slurryVolumeLiters &&
    numericQuantity <= activeSelectedAsset.maxPayloadLiters;

  const isFormValid =
    selectedAssetId.trim() !== '' &&
    activeSelectedBatch !== null &&
    isQuantityValid &&
    catchmentReach.trim() !== '' &&
    operator.trim() !== '';



  // Submit Handler: Creates trip, deducts slurry from tank and batch, updates context
  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !activeSelectedBatch) return;

    const createdTrip = createDosingTrip({
      assetName: activeSelectedAsset.name,
      tankId: activeSelectedBatch.tankId,
      batchId: activeSelectedBatch.batchId,
      mineralType: activeSelectedBatch.mineralType,
      quantityLiters: numericQuantity,
      catchmentReach: catchmentReach.trim(),
      dosingRateLPerHr: Number(dosingRateLPerHr) || 8.5,
      scheduledDate,
      scheduledTime,
      status: 'In Transit',
      operator: operator.trim(),
      notes: missionNotes.trim()
    });

    setToastMessage(
      `Trip ${createdTrip.tripCode} created! Loaded ${numericQuantity} L of ${activeSelectedBatch.mineralType} onto ${activeSelectedAsset.name}. Removed ${numericQuantity} L from Tank ${activeSelectedBatch.tankId}.`
    );
    setTimeout(() => setToastMessage(null), 5000);

    // Reset inputs
    setQuantityToLoad('');
    setSelectedBatchKey('');
  };



  const totalSlurryStored = tanks.reduce((acc, t) => acc + t.currentVolumeLiters, 0);
  const activeMissionsCount = dosingTrips.filter((t) => t.status === 'Active Dosing' || t.status === 'In Transit').length;

  // Filtered trips for history
  const filteredTrips = dosingTrips.filter((trip) => {
    const matchesStatus = statusFilter === 'ALL' || trip.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      trip.tripCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.batchId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.catchmentReach.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.mineralType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Summary KPIs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Navigation className="w-6 h-6 text-emerald-600" />
              Dosing
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trip creation, asset loading, and dispersion operations.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Active Missions</div>
              <div className="text-sm font-black text-slate-800">{activeMissionsCount} Vessels</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200/90 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Slurry in Tanks</div>
              <div className="text-sm font-black text-slate-800">{totalSlurryStored} L Available</div>
            </div>
          </div>
        </div>
      </div>


      {/* 3. Dosing / Trip Creation Form (Card) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 via-teal-50/30 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Dosing / Trip Creation
              </h2>
            </div>
          </div>
        </div>

        <form onSubmit={handleCreateTrip} className="p-6 space-y-6">
          {/* Step 1 & Step 2: Asset Selection and Mineral Batch Selection (as Dropdowns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Asset Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                1. Select Asset (Autonomous Dosing Drone / Vessel) <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => {
                  setSelectedAssetId(e.target.value);
                  const found = DOSING_ASSETS.find((a) => a.id === e.target.value);
                  if (found) setCatchmentReach(found.defaultCatchment);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
              >
                {DOSING_ASSETS.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} — {asset.type} (Max: {asset.maxPayloadLiters} L, Battery: {asset.batteryPct}%)
                  </option>
                ))}
              </select>

              {/* Compact Active Asset Metadata Bar */}
              {activeSelectedAsset && (
                <div className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-[11px] text-emerald-900 flex items-center justify-between">
                  <span className="font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {activeSelectedAsset.name} ({activeSelectedAsset.status})
                  </span>
                  <span className="font-mono text-emerald-800">
                    Battery: {activeSelectedAsset.batteryPct}% • Max Payload: {activeSelectedAsset.maxPayloadLiters} L
                  </span>
                </div>
              )}
            </div>

            {/* 2. Mineral Batch Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  2. Select Mineral Batch (from Tanks) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  Source: Tanks T001 & T002
                </span>
              </div>

              {allAvailableBatches.length > 0 ? (
                <>
                  <select
                    value={selectedBatchKey}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedBatchKey(val);
                      const batch = allAvailableBatches.find((b) => b.key === val);
                      if (batch) {
                        const suggested = Math.min(batch.slurryVolumeLiters, activeSelectedAsset.maxPayloadLiters, 200);
                        setQuantityToLoad(suggested);
                      } else {
                        setQuantityToLoad('');
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none shadow-xs"
                  >
                    <option value="">-- Choose a mineral batch from storage tanks --</option>
                    {allAvailableBatches.map((batch) => (
                      <option key={batch.key} value={batch.key}>
                        [{batch.tankId}] {batch.batchId} — {batch.mineralType} ({batch.slurryVolumeLiters} L available) — {batch.supplier}
                      </option>
                    ))}
                  </select>

                  {/* Compact Active Batch Metadata Bar */}
                  {activeSelectedBatch ? (
                    <div className="mt-2 px-3 py-1.5 rounded-lg bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 flex items-center justify-between">
                      <span className="font-semibold flex items-center gap-1.5 truncate mr-2">
                        <span className="font-mono font-bold text-blue-700 bg-blue-100 px-1 rounded text-[10px]">{activeSelectedBatch.tankId}</span>
                        <span>{activeSelectedBatch.batchId} • {activeSelectedBatch.mineralType}</span>
                      </span>
                      <span className="font-mono font-bold text-emerald-700 shrink-0">
                        {activeSelectedBatch.slurryVolumeLiters} L Available
                      </span>
                    </div>
                  ) : (
                    <div className="mt-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-400 italic">
                      Select a mineral batch to load slurry from Tank T001 or Tank T002.
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>No batches available. Prepare a batch in Slurry Preparation first.</span>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Quantity to Load & Real-Time Impact Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                3. Quantity to Load into Asset (Liters) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={activeSelectedBatch ? activeSelectedBatch.slurryVolumeLiters : 500}
                  value={quantityToLoad}
                  onChange={(e) => setQuantityToLoad(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 220"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-mono font-bold focus:outline-none transition-all ${
                    !activeSelectedBatch
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : !isQuantityValid && numericQuantity > 0
                      ? 'border-rose-400 bg-rose-50/50 text-rose-900 focus:ring-2 focus:ring-rose-400'
                      : 'border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  }`}
                  disabled={!activeSelectedBatch}
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400 font-mono">
                  Liters
                </span>
              </div>

              {/* Quick Preset Buttons */}
              {activeSelectedBatch && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Presets:</span>
                  {[50, 100, 150, 200].map((liters) => {
                    const isDisabled =
                      liters > activeSelectedBatch.slurryVolumeLiters ||
                      liters > activeSelectedAsset.maxPayloadLiters;
                    return (
                      <button
                        key={liters}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => setQuantityToLoad(liters)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-colors cursor-pointer ${
                          isDisabled
                            ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                            : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
                        }`}
                      >
                        {liters}L
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() =>
                      setQuantityToLoad(
                        Math.min(activeSelectedBatch.slurryVolumeLiters, activeSelectedAsset.maxPayloadLiters)
                      )
                    }
                    className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors cursor-pointer"
                  >
                    Max ({Math.min(activeSelectedBatch.slurryVolumeLiters, activeSelectedAsset.maxPayloadLiters)}L)
                  </button>
                </div>
              )}

              {/* Error messages */}
              {activeSelectedBatch && numericQuantity > activeSelectedBatch.slurryVolumeLiters && (
                <div className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Cannot exceed available batch volume ({activeSelectedBatch.slurryVolumeLiters} L)
                </div>
              )}
              {numericQuantity > activeSelectedAsset.maxPayloadLiters && (
                <div className="mt-1.5 text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  Exceeds asset maximum payload capacity ({activeSelectedAsset.maxPayloadLiters} L)
                </div>
              )}
            </div>

            {/* Live Tank Deduction Preview Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Live Tank Volume Deduction Preview
                </span>
                {activeSelectedBatch && selectedTank ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Source Storage Tank:</span>
                      <span className="font-bold text-slate-800">{selectedTank.name} ({selectedTank.id})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Current Tank Volume:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedTank.currentVolumeLiters} L</span>
                    </div>
                    <div className="flex items-center justify-between text-rose-600 font-bold">
                      <span>Deduction (This Trip):</span>
                      <span className="font-mono">-{numericQuantity || 0} L</span>
                    </div>
                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 text-sm font-black text-emerald-700">
                      <span>Tank Remaining Volume:</span>
                      <span className="font-mono">
                        {Math.max(0, selectedTank.currentVolumeLiters - numericQuantity)} L
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic py-3 text-center">
                    Select a mineral batch above to preview live tank volume deductions.
                  </div>
                )}
              </div>

              <div className="text-[11px] text-slate-500 font-medium mt-2 bg-white/80 p-2 rounded-lg border border-slate-200/60">
                💡 <strong>Dosing Rule:</strong> Creating this trip immediately removes {numericQuantity || 0} L from {activeSelectedBatch ? activeSelectedBatch.tankId : 'the selected tank'} in Slurry Preparation and logs a verified dispatch event.
              </div>
            </div>
          </div>

          {/* Step 4: Mission Corridor, Rate & Operational Schedule */}
          <div className="pt-2 border-t border-slate-100 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              4. Catchment Destination & Dispersion Parameters
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Catchment / Reach */}
              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Target Catchment Reach Corridor <span className="text-rose-500">*</span>
                </label>
                <select
                  value={catchmentReach}
                  onChange={(e) => setCatchmentReach(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {CATCHMENT_REACH_PRESETS.map((reach) => (
                    <option key={reach} value={reach}>
                      {reach}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dosing Rate */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Target Dosing Rate (L/hr)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={dosingRateLPerHr}
                  onChange={(e) => setDosingRateLPerHr(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Lead Operator */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Lead Operator <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Scheduled Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Scheduled Time */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Scheduled Time
                </label>
                <input
                  type="text"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  placeholder="e.g. 08:30 AM"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Mission Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Dispersion Mission Notes
                </label>
                <input
                  type="text"
                  value={missionNotes}
                  onChange={(e) => setMissionNotes(e.target.value)}
                  placeholder="e.g. Low-shear RTK corridor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Submission Button */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              {isFormValid ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ready: {numericQuantity} L will be loaded onto {activeSelectedAsset.name} and deducted from Tank {activeSelectedBatch?.tankId}.
                </span>
              ) : (
                <span className="text-slate-400">
                  Please select an asset, choose an available mineral batch, and enter a valid quantity to load.
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                isFormValid
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white shadow-emerald-500/20 hover:scale-[1.01]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Create Dosing Trip & Dispatch Slurry</span>
            </button>
          </div>
        </form>
      </div>

      {/* 4. Dosing Trips History Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">
                Dosing Trips History
              </h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {dosingTrips.length} Trips Logged
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical record of all individual dosing trips created, asset loads, and river corridor dispatches.
            </p>
          </div>

          {/* Search & Status Filter Controls */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search trip, asset, batch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-44 sm:w-56"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Active Dosing')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'Active Dosing'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('In Transit')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'In Transit'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Transit
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('Completed')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === 'Completed'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Trips Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Trip Code</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Source Tank & Batch</th>
                <th className="py-3 px-4">Quantity Loaded</th>
                <th className="py-3 px-4">Catchment Reach & Dosing Rate</th>
                <th className="py-3 px-4">Schedule & Operator</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrips.map((trip) => {
                const isActive = trip.status === 'Active Dosing';
                const isTransit = trip.status === 'In Transit';
                const isCompleted = trip.status === 'Completed';

                return (
                  <tr
                    key={trip.id}
                    onClick={() => handleSelectTrip(trip)}
                    className="hover:bg-blue-50/70 transition-colors cursor-pointer group"
                    title={`Click to inspect live boat tanker dosing for ${trip.tripCode}`}
                  >
                    {/* Trip Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="group-hover:text-blue-600 transition-colors">{trip.tripCode}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{trip.createdAt}</div>
                    </td>

                    {/* Asset */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {trip.assetName}
                        </span>
                      </div>
                    </td>

                    {/* Source Tank & Batch */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {trip.tankId}
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {trip.batchId}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-44 mt-0.5">
                        {trip.mineralType}
                      </div>
                    </td>

                    {/* Quantity Loaded */}
                    <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                      <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {trip.quantityLiters} L
                      </span>
                    </td>

                    {/* Reach & Rate */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-slate-800 truncate">{trip.catchmentReach}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Dosing Rate: <span className="font-bold text-slate-700">{trip.dosingRateLPerHr} L/hr</span>
                      </div>
                    </td>

                    {/* Schedule & Operator */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-800 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{trip.scheduledDate} {trip.scheduledTime}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-36">{trip.operator}</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isActive
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isTransit
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : isCompleted
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {isTransit && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredTrips.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No dosing trips found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Live Boat Tanker Dosing Modal Card */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-5 sm:p-6 max-h-[92vh] flex flex-col overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Live Boat Dosing Telemetry
                    </h3>
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {selectedTrip.tripCode}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Real-time onboard tanker discharge into river water
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTrip(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tanker & Boat Visualization Area */}
            <div className="bg-[#0B1528] rounded-2xl p-5 border border-slate-800 text-white relative overflow-hidden mb-4 shadow-inner">
              {/* Top HUD Line */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    Vessel Asset
                  </span>
                  <strong className="text-sm text-cyan-300 font-mono">
                    {selectedTrip.assetName}
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isDosingActive && liveRemaining > 0
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/60'
                        : selectedTrip.status === 'Completed' || liveRemaining === 0
                        ? 'bg-slate-800 text-slate-400 border border-slate-700'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}
                  >
                    {isDosingActive && liveRemaining > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                    <span>
                      {isDosingActive && liveRemaining > 0
                        ? 'Live Dosing'
                        : liveRemaining === 0
                        ? 'Dosing Complete'
                        : selectedTrip.status}
                    </span>
                  </span>
                </div>
              </div>

              {/* Graphical Center: Vessel + Small Tanker + Discharge into River */}
              <div className="relative py-2 flex flex-col items-center select-none">
                {/* Onboard Tanker Label */}
                <div className="text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-2">
                  <span>Boat Slurry Tanker</span>
                  <span className="text-emerald-400 font-bold">
                    {liveRemaining.toFixed(1)} L / {selectedTrip.quantityLiters} L
                  </span>
                </div>

                {/* Vertical Cylindrical Tanker */}
                <div className="w-32 h-44 rounded-2xl border-2 border-slate-600 bg-slate-900/90 relative overflow-hidden shadow-2xl flex flex-col justify-end p-0.5 z-10">
                  {/* Gauge Tick Marks */}
                  <div className="absolute right-1.5 top-2 bottom-2 flex flex-col justify-between text-[9px] font-mono text-slate-500 pointer-events-none z-20">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                  </div>

                  {/* Mineral Slurry Liquid Level (Decreasing in Real Time!) */}
                  <div
                    style={{
                      height: `${Math.min(100, Math.max(0, (liveRemaining / (selectedTrip.quantityLiters || 1)) * 100))}%`,
                      transition: 'height 0.8s ease-out'
                    }}
                    className="w-full bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400 rounded-b-xl relative flex items-center justify-center shadow-lg"
                  >
                    {/* Liquid surface wave ripple */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-cyan-200/50 animate-pulse rounded-t-sm" />

                    {/* Text inside the tanker */}
                    <div className="text-center font-mono text-white text-xs font-bold drop-shadow-md px-1">
                      <div>{liveRemaining.toFixed(1)} L</div>
                      <div className="text-[10px] text-cyan-100 font-normal">
                        {(
                          (liveRemaining / (selectedTrip.quantityLiters || 1)) *
                          100
                        ).toFixed(0)}
                        %
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-surface Discharge Pipe from Tanker */}
                <div className="w-3.5 h-6 bg-slate-700 border-x border-slate-500 relative flex justify-center z-10">
                  {isDosingActive && liveRemaining > 0 && (
                    <div className="w-1.5 h-full bg-cyan-300 animate-pulse" />
                  )}
                </div>

                {/* Boat Deck Platform (Clearly Visible & High Contrast) */}
                <div className="w-full max-w-sm py-1.5 px-4 bg-slate-800/95 border border-slate-600 rounded-xl flex items-center justify-between text-xs font-mono shadow-md z-10 my-1">
                  <span className="flex items-center gap-1 text-cyan-300 font-bold">
                    <span>◄</span>
                    <span>Bow</span>
                  </span>
                  <span className="text-[11px] text-slate-100 font-bold px-2.5 py-0.5 rounded bg-slate-700 border border-slate-500 tracking-wide">
                    {selectedTrip.assetName} Hull
                  </span>
                  <span className="flex items-center gap-1 text-cyan-300 font-bold">
                    <span>Stern</span>
                    <span>►</span>
                  </span>
                </div>

                {/* Underwater Injection Stream flowing downward into River */}
                <div className="h-8 flex flex-col items-center justify-around py-0.5 z-10">
                  {isDosingActive && liveRemaining > 0 ? (
                    <>
                      <div className="w-1.5 h-2 bg-emerald-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
                      <ArrowDown className="w-3.5 h-3.5 text-cyan-300 animate-bounce" />
                    </>
                  ) : (
                    <div className="text-[10px] text-slate-400 font-mono font-medium">Nozzle idle</div>
                  )}
                </div>

                {/* River Water Surface & Dispersion Flow */}
                <div className="w-full bg-gradient-to-b from-blue-900/60 via-blue-950 to-[#071322] border-t-2 border-cyan-400/60 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 z-0">
                  <div className="flex items-center gap-2">
                    <Waves className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold text-cyan-200">
                        River Flow (14.2 m³/s)
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Sub-surface Alkaline Dispersion Zone • Depth: 1.2 m
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 block uppercase">
                      Injected into River
                    </span>
                    <span className="text-sm font-bold text-emerald-400">
                      +{liveDosed.toFixed(1)} L Dosed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Clean Real-Time Metric Cards (Live Dosing Rate card removed as requested) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Dosed to River
                </span>
                <span className="text-base font-bold text-emerald-800 font-mono">
                  {liveDosed.toFixed(1)} L
                </span>
                <span className="text-[10px] text-emerald-700 block font-mono">
                  {(
                    (liveDosed / (selectedTrip.quantityLiters || 1)) *
                    100
                  ).toFixed(1)}
                  % Delivered
                </span>
              </div>

              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-cyan-700 block">
                  Tanker Remaining
                </span>
                <span className="text-base font-bold text-cyan-900 font-mono">
                  {liveRemaining.toFixed(1)} L
                </span>
                <span className="text-[10px] text-cyan-700 block font-mono">
                  {(
                    (liveRemaining / (selectedTrip.quantityLiters || 1)) *
                    100
                  ).toFixed(1)}
                  % in Tank
                </span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-amber-800 block">
                  Plume Est. ΔpH
                </span>
                <span className="text-base font-bold text-amber-900 font-mono">
                  +0.28 pH
                </span>
                <span className="text-[10px] text-amber-700 block font-mono">
                  Safe (Max 8.50)
                </span>
              </div>
            </div>

            {/* Trip Specifications Strip */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block font-medium uppercase text-[10px]">
                    Catchment Reach:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedTrip.catchmentReach}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase text-[10px]">
                    Mineral Slurry:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedTrip.mineralType} (Batch {selectedTrip.batchId})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase text-[10px]">
                    Field Operator:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedTrip.operator}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium uppercase text-[10px]">
                    Scheduled Time:
                  </span>
                  <span className="font-semibold text-slate-800 font-mono">
                    {selectedTrip.scheduledDate} {selectedTrip.scheduledTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {liveRemaining > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsDosingActive(!isDosingActive)}
                    className="px-3.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {isDosingActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Pause Simulation</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume Dosing</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setLiveRemaining(selectedTrip.quantityLiters);
                    setLiveDosed(0);
                    setIsDosingActive(true);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Tank</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTrip(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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
