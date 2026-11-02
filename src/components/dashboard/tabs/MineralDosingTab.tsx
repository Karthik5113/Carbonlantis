import React, { useState } from 'react';
import {
  Boxes,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  FileText,
  ShieldCheck,
  Factory,
  Truck,
  Check,
  Sparkles,
  FlaskConical,
  Trash2,
  Upload,
  X,
  History,
  Clock,
  ArrowDownRight,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { useSlurryDosing } from '../../../context/SlurryDosingContext';


// --- TYPES ---
export interface TankBatchConstituent {
  batchId: string;
  mineralType: string;
  mineralMassKg: number;
  waterQuantityLiters: number;
  slurryVolumeLiters: number;
  supplier: string;
  origin: string;
  dateAdded: string;
  status: string;
}

export interface TankStorageData {
  id: 'T001' | 'T002';
  name: string;
  capacityLiters: number; // strictly 1,000 Litres
  currentVolumeLiters: number;
  densityKgPerL: number;
  ph: number;
  motorRpm: number;
  status: 'Ready' | 'Mixing' | 'Standby' | 'Low';
  batches: TankBatchConstituent[];
}

export interface MineralBatchFormState {
  // Phase 1: Mineral Sourcing
  batchNumber: string;
  mineralType: string;
  supplier: string;
  quantityKg: number | '';
  origin: string;
  sourcingDate: string;
  sourcingEvidence: string;

  // Phase 2: Mineral Screening
  purityPct: number | '';
  grainSizeMicrons: number | '';
  safetyStatus: string;
  heavyMetalsAssay: string;
  testingLab: string;
  screeningEvidence: string;

  // Phase 3: Transportation
  sourceLocation: string;
  destination: string;
  distanceKm: number | '';
  vehicleNumber: string;
  driverName: string;
  transportEvidence: string;

  // Phase 4: Slurry Preparation
  mineralMassKg: number | '';
  waterQuantityLiters: number | '';
  selectedTankId: 'T001' | 'T002' | '';
}

// Initial Tank Data with default batches
const INITIAL_TANKS: TankStorageData[] = [
  {
    id: 'T001',
    name: 'Mixer Tank T001',
    capacityLiters: 1000,
    currentVolumeLiters: 650,
    densityKgPerL: 1.36,
    ph: 9.6,
    motorRpm: 120,
    status: 'Ready',
    batches: [
      {
        batchId: 'MB-2026-001',
        mineralType: 'Olivine (Mg₂SiO₄)',
        mineralMassKg: 240,
        waterQuantityLiters: 290,
        slurryVolumeLiters: 380,
        supplier: 'Deccan Minerals Corp',
        origin: 'Salem Ultramafic Reach, TN',
        dateAdded: '28 Oct 2026, 09:15',
        status: 'MRV Certified'
      },
      {
        batchId: 'MB-2026-002',
        mineralType: 'Calcium Silicate (CaSiO₃)',
        mineralMassKg: 170,
        waterQuantityLiters: 205,
        slurryVolumeLiters: 270,
        supplier: 'AP Silicates Pvt Ltd',
        origin: 'Kadapa Sourcing Mine, AP',
        dateAdded: '30 Oct 2026, 14:40',
        status: 'MRV Certified'
      }
    ]
  },
  {
    id: 'T002',
    name: 'Mixer Tank T002',
    capacityLiters: 1000,
    currentVolumeLiters: 300,
    densityKgPerL: 1.32,
    ph: 9.4,
    motorRpm: 120,
    status: 'Ready',
    batches: [
      {
        batchId: 'MB-2026-003',
        mineralType: 'Basalt Mineral Dust (< 35µm)',
        mineralMassKg: 190,
        waterQuantityLiters: 230,
        slurryVolumeLiters: 300,
        supplier: 'Eastern Ghats Mining Hub',
        origin: 'Visakhapatnam Quarry Reach, AP',
        dateAdded: '31 Oct 2026, 11:20',
        status: 'MRV Certified'
      }
    ]
  }
];

export const MineralDosingTab: React.FC = () => {
  // Wizard Phase: 1 -> 2 -> 3 -> 4
  const [currentPhase, setCurrentPhase] = useState<1 | 2 | 3 | 4>(1);

  // Storage Tanks and unified history from shared SlurryDosingContext
  const { tanks, slurryEventsHistory, createSlurryBatch, flushTank } = useSlurryDosing();
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'BATCH_CREATED' | 'TRIP_DISPATCH' | 'TANK_FLUSH'>('ALL');

  // Success Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State across all 4 Phases (EMPTY BY DEFAULT)
  const [form, setForm] = useState<MineralBatchFormState>({
    // Phase 1: Mineral Sourcing (empty by default)
    batchNumber: '',
    mineralType: '',
    supplier: '',
    quantityKg: '',
    origin: '',
    sourcingDate: '',
    sourcingEvidence: '',

    // Phase 2: Mineral Screening (empty by default)
    purityPct: '',
    grainSizeMicrons: '',
    safetyStatus: '',
    heavyMetalsAssay: '',
    testingLab: '',
    screeningEvidence: '',

    // Phase 3: Transportation (empty by default)
    sourceLocation: '',
    destination: '',
    distanceKm: '',
    vehicleNumber: '',
    driverName: '',
    transportEvidence: '',

    // Phase 4: Slurry Preparation (empty by default)
    mineralMassKg: '',
    waterQuantityLiters: '',
    selectedTankId: ''
  });

  // Calculate live slurry properties based on Phase 4 values
  const mineralMass = Number(form.mineralMassKg) || 0;
  const waterLiters = Number(form.waterQuantityLiters) || 0;
  // Estimated slurry volume based on mineral displacement (density ~2.65 kg/L)
  const calculatedSlurryVolume = mineralMass > 0 || waterLiters > 0 ? Math.round(waterLiters + mineralMass / 2.65) : 0;
  const calculatedConcentration = calculatedSlurryVolume > 0 ? Math.round((mineralMass * 1000) / calculatedSlurryVolume) : 0;
  const calculatedDensity = calculatedSlurryVolume > 0 ? ((mineralMass + waterLiters) / calculatedSlurryVolume).toFixed(2) : '0.00';

  const selectedTank = form.selectedTankId ? tanks.find((t) => t.id === form.selectedTankId) : null;
  const tankAvailableCapacity = selectedTank ? selectedTank.capacityLiters - selectedTank.currentVolumeLiters : 0;
  const willOverflow = selectedTank ? calculatedSlurryVolume > tankAvailableCapacity : false;

  // Validation Checkers for each Phase
  const isPhase1Valid =
    form.batchNumber.trim() !== '' &&
    form.mineralType.trim() !== '' &&
    form.supplier.trim() !== '' &&
    Number(form.quantityKg) > 0 &&
    form.origin.trim() !== '' &&
    form.sourcingDate.trim() !== '' &&
    form.sourcingEvidence.trim() !== '';

  const isPhase2Valid =
    Number(form.purityPct) > 0 &&
    Number(form.grainSizeMicrons) > 0 &&
    form.safetyStatus.trim() !== '' &&
    form.heavyMetalsAssay.trim() !== '' &&
    form.testingLab.trim() !== '' &&
    form.screeningEvidence.trim() !== '';

  const isPhase3Valid =
    form.sourceLocation.trim() !== '' &&
    form.destination.trim() !== '' &&
    Number(form.distanceKm) > 0 &&
    form.vehicleNumber.trim() !== '' &&
    form.driverName.trim() !== '' &&
    form.transportEvidence.trim() !== '';

  const isPhase4Valid =
    mineralMass > 0 &&
    waterLiters > 0 &&
    (form.selectedTankId === 'T001' || form.selectedTankId === 'T002') &&
    !willOverflow;

  // Next / Back Navigation Handlers
  const handleNextPhase = () => {
    if (currentPhase === 1 && isPhase1Valid) {
      // Sync mineral mass into Phase 4 and source location into Phase 3 if not already set
      setForm((prev) => ({
        ...prev,
        mineralMassKg: prev.mineralMassKg !== '' ? prev.mineralMassKg : prev.quantityKg,
        sourceLocation: prev.sourceLocation !== '' ? prev.sourceLocation : prev.origin
      }));
      setCurrentPhase(2);
    } else if (currentPhase === 2 && isPhase2Valid) {
      setCurrentPhase(3);
    } else if (currentPhase === 3 && isPhase3Valid) {
      setCurrentPhase(4);
    }
  };

  const handleBackPhase = () => {
    if (currentPhase > 1) {
      setCurrentPhase((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  // Final Phase 4: Create Batch Handler
  const handleCreateBatch = () => {
    if (!isPhase4Valid || !selectedTank) return;

    const newBatchConstituent: TankBatchConstituent = {
      batchId: form.batchNumber,
      mineralType: form.mineralType,
      mineralMassKg: mineralMass,
      waterQuantityLiters: waterLiters,
      slurryVolumeLiters: calculatedSlurryVolume,
      supplier: form.supplier,
      origin: form.origin,
      dateAdded: 'Today, Just now',
      status: 'MRV Certified'
    };

    // Update selected tank via SlurryDosingContext
    createSlurryBatch(newBatchConstituent, form.selectedTankId as 'T001' | 'T002');

    // Toast message
    setToastMessage(
      `Batch ${form.batchNumber} created successfully! ${calculatedSlurryVolume}L slurry added to ${selectedTank.name}.`
    );
    setTimeout(() => setToastMessage(null), 4000);

    // Reset all fields back to blank
    setForm({
      batchNumber: '',
      mineralType: '',
      supplier: '',
      quantityKg: '',
      origin: '',
      sourcingDate: '',
      sourcingEvidence: '',
      purityPct: '',
      grainSizeMicrons: '',
      safetyStatus: '',
      heavyMetalsAssay: '',
      testingLab: '',
      screeningEvidence: '',
      sourceLocation: '',
      destination: '',
      distanceKm: '',
      vehicleNumber: '',
      driverName: '',
      transportEvidence: '',
      mineralMassKg: '',
      waterQuantityLiters: '',
      selectedTankId: ''
    });
    setCurrentPhase(1);
  };

  // Drain / Flush Tank Handler
  const handleFlushTank = (tankId: 'T001' | 'T002') => {
    flushTank(tankId);
    setToastMessage(`${tankId === 'T001' ? 'Mixer Tank T001' : 'Mixer Tank T002'} flushed and ready for new batches.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper for Phone Charge Percentage Battery styling
  const getBatteryFillColor = (pct: number) => {
    if (pct >= 85) return 'from-emerald-500 to-teal-500';
    if (pct >= 35) return 'from-blue-500 to-cyan-500';
    if (pct > 0) return 'from-amber-500 to-yellow-500';
    return 'from-slate-400 to-slate-500';
  };

  const totalSlurryLiters = tanks.reduce((acc, t) => acc + t.currentVolumeLiters, 0);
  const totalCapacityLiters = tanks.reduce((acc, t) => acc + t.capacityLiters, 0); // 2000L
  const overallPercentage = Math.round((totalSlurryLiters / totalCapacityLiters) * 100);

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header & Summary KPIs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-blue-600" />
              Slurry Preparation
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            4-Phase chain-of-custody: Mineral Sourcing → Mineral Screening → Transportation → Slurry Preparation, and 1,000L Storage Tanks.
          </p>
        </div>

        {/* Global Stock KPI Pill */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-slate-200/90 shadow-xs self-start md:self-auto">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Slurry Stored</div>
            <div className="text-sm font-black text-slate-800 font-sans">
              {totalSlurryLiters} L <span className="text-xs text-slate-400 font-normal">/ {totalCapacityLiters} L ({overallPercentage}%)</span>
            </div>
          </div>
        </div>
      </div>


      {/* 2. Section A: Mineral Batch Lifecycle (4-Phase Interactive Wizard Card) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Wizard Stepper Header */}
        <div className="bg-slate-50/80 border-b border-slate-200 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Guided Lifecycle Workflow
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Phase {currentPhase} of 4: {
                  currentPhase === 1 ? 'Mineral Sourcing' :
                  currentPhase === 2 ? 'Mineral Screening' :
                  currentPhase === 3 ? 'Transportation' :
                  'Slurry Preparation'
                }
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              {form.batchNumber ? `Batch #${form.batchNumber}` : 'New Batch'}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: '1. Sourcing', icon: Factory },
              { num: 2, label: '2. Screening', icon: ShieldCheck },
              { num: 3, label: '3. Transport', icon: Truck },
              { num: 4, label: '4. Slurry Prep', icon: Droplets }
            ].map((step) => {
              const Icon = step.icon;
              const isDone = currentPhase > step.num;
              const isCurrent = currentPhase === step.num;

              return (
                <div
                  key={step.num}
                  className={`flex items-center gap-2 p-2 rounded-xl border transition-all text-xs font-semibold ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isCurrent
                        ? 'bg-white text-blue-600'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                  </div>
                  <span className="truncate hidden sm:inline">{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-5 sm:p-7">
          {/* ============================================================ */}
          {/* PHASE 1: MINERAL SOURCING                                   */}
          {/* ============================================================ */}
          {currentPhase === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Phase 1: Mineral Sourcing Registration
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Register incoming raw mineral feedstock, verified supplier, quantity, quarry origin, and weight evidence.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Step 1 / 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Batch ID */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mineral Batch ID <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.batchNumber}
                    onChange={(e) => setForm({ ...form, batchNumber: e.target.value })}
                    className="w-full text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. MB-2026-001"
                  />
                </div>

                {/* 2. Mineral Type */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mineral Feedstock Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.mineralType}
                    onChange={(e) => setForm({ ...form, mineralType: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select mineral feedstock...</option>
                    <option value="Olivine (Mg₂SiO₄ - High Purity)">Olivine (Mg₂SiO₄ - High Purity Ultramafic)</option>
                    <option value="Calcium Silicate (CaSiO₃ - Wollastonite)">Calcium Silicate (CaSiO₃ - Wollastonite)</option>
                    <option value="Basalt Mineral Dust (< 35µm)">Basalt Mineral Dust (&lt; 35µm)</option>
                    <option value="Magnesium Hydroxide (Mg(OH)₂)">Magnesium Hydroxide (Mg(OH)₂)</option>
                    <option value="Limestone / Quicklime (CaCO₃ / CaO)">Limestone / Quicklime (CaCO₃ / CaO)</option>
                  </select>
                </div>

                {/* 3. Supplier */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Approved Supplier <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.supplier}
                    onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Deccan Minerals Corp"
                  />
                </div>

                {/* 4. Quantity (kg) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batch Quantity (kg) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={form.quantityKg}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Number(e.target.value);
                        setForm({ ...form, quantityKg: val, mineralMassKg: val });
                      }}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 pr-12 focus:bg-white focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. 280"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 pointer-events-none">
                      kg
                    </span>
                  </div>
                </div>

                {/* 5. Origin / Quarry Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quarry / Sourcing Origin <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value, sourceLocation: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Salem Ultramafic Reach, TN"
                  />
                </div>

                {/* 6. Sourcing Date */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery / Receipt Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.sourcingDate}
                    onChange={(e) => setForm({ ...form, sourcingDate: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Sourcing Evidence Document Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Supporting Sourcing Evidence (Weighbridge Slip / Bill of Lading) <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      {form.sourcingEvidence ? (
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {form.sourcingEvidence}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">
                          No document attached yet
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400">
                        Upload official weighbridge slip or bill of lading (PDF / PNG)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 cursor-pointer transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{form.sourcingEvidence ? 'Change File' : 'Upload File'}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setForm((prev) => ({ ...prev, sourcingEvidence: file.name }));
                        }}
                      />
                    </label>
                    {!form.sourcingEvidence && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, sourcingEvidence: 'Weighbridge_Receipt_MB001.pdf' }))}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        Sample Slip
                      </button>
                    )}
                    {form.sourcingEvidence && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, sourcingEvidence: '' }))}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PHASE 2: MINERAL SCREENING                                   */}
          {/* ============================================================ */}
          {currentPhase === 2 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Phase 2: Mineral Quality & Safety Screening
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Record laboratory purity, particle grain size (D50), non-toxic safety status, and XRD test certificates.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Step 2 / 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Mineral Purity (%) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mineral Purity (%) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      min="50"
                      max="100"
                      value={form.purityPct}
                      onChange={(e) => setForm({ ...form, purityPct: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 pr-10 focus:bg-white focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. 96.5"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 pointer-events-none">
                      %
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Target: ≥ 95% for enhanced riverine dissolution
                  </span>
                </div>

                {/* 2. Grain Size (D50 / Microns) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grain Size D50 (µm) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="200"
                      value={form.grainSizeMicrons}
                      onChange={(e) => setForm({ ...form, grainSizeMicrons: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 pr-10 focus:bg-white focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. 38"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 pointer-events-none">
                      µm
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Optimal micro-milled &lt; 45µm
                  </span>
                </div>

                {/* 3. Safety Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Safety & Toxicological Status <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.safetyStatus}
                    onChange={(e) => setForm({ ...form, safetyStatus: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select safety status...</option>
                    <option value="Passed - Non-toxic & MRV Certified">Passed - Non-toxic & MRV Certified</option>
                    <option value="Passed - Standard Alkaline Grade">Passed - Standard Alkaline Grade</option>
                    <option value="Pending Secondary ICP-OES Review">Pending Secondary ICP-OES Review</option>
                  </select>
                </div>

                {/* 4. Heavy Metal Assay */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Heavy Metals Concentration (Cr / Ni / Pb) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.heavyMetalsAssay}
                    onChange={(e) => setForm({ ...form, heavyMetalsAssay: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Cr < 0.02 ppm, Ni < 0.01 ppm (Well below limits)"
                  />
                </div>

                {/* 5. Testing Lab */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Independent Testing Laboratory <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.testingLab}
                    onChange={(e) => setForm({ ...form, testingLab: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Apex Geochemical Testing Labs Ltd"
                  />
                </div>
              </div>

              {/* Screening Evidence Document */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Laboratory Test Evidence (XRD Mineralogical Assay & Sieve Analysis) <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div>
                      {form.screeningEvidence ? (
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {form.screeningEvidence}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">
                          No test certificate attached yet
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400">
                        Attach accredited laboratory XRD assay report (PDF)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 cursor-pointer transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{form.screeningEvidence ? 'Change File' : 'Upload Certificate'}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setForm((prev) => ({ ...prev, screeningEvidence: file.name }));
                        }}
                      />
                    </label>
                    {!form.screeningEvidence && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, screeningEvidence: 'XRD_Assay_Analysis_Report.pdf' }))}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        Sample XRD
                      </button>
                    )}
                    {form.screeningEvidence && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, screeningEvidence: '' }))}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PHASE 3: TRANSPORTATION                                      */}
          {/* ============================================================ */}
          {currentPhase === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Phase 3: Logistics & Transport Recording
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track the chain-of-custody journey from quarry source to the riverine slurry preparation depot.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Step 3 / 4
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Source Location */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dispatch Source Location <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.sourceLocation}
                    onChange={(e) => setForm({ ...form, sourceLocation: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. Salem Sourcing Hub, TN"
                  />
                </div>

                {/* 2. Destination */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Depot Destination <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option value="">Select depot destination...</option>
                    <option value="Kesinapalli Slurry Dosing Depot (Godavari Delta Reach)">Kesinapalli Slurry Dosing Depot (Godavari Delta Reach)</option>
                    <option value="Rajahmundry Barrage Staging Yard">Rajahmundry Barrage Staging Yard</option>
                    <option value="Nidamanuru River Wharf Hub">Nidamanuru River Wharf Hub</option>
                    <option value="Dowleswaram Maintenance Station">Dowleswaram Maintenance Station</option>
                  </select>
                </div>

                {/* 3. Distance (km) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Transit Distance (km) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={form.distanceKm}
                      onChange={(e) => setForm({ ...form, distanceKm: e.target.value === '' ? '' : Number(e.target.value) })}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 pr-12 focus:bg-white focus:border-blue-500 outline-none transition-all"
                      placeholder="e.g. 340"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 pointer-events-none">
                      km
                    </span>
                  </div>
                  {Number(form.distanceKm) > 0 && (
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Est. transport CO₂ footprint: ~{(Number(form.distanceKm) * 0.11).toFixed(1)} kg CO₂
                    </span>
                  )}
                </div>

                {/* 4. Vehicle / Carrier */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Carrier / Vehicle Reg. No. <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.vehicleNumber}
                    onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. AP-16-TX-8821"
                  />
                </div>

                {/* 5. Driver / Logistics Lead */}
                <div className="lg:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dispatcher / Logistics Driver <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.driverName}
                    onChange={(e) => setForm({ ...form, driverName: e.target.value })}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:bg-white focus:border-blue-500 outline-none transition-all"
                    placeholder="e.g. R. Narayana (Logistics Lead)"
                  />
                </div>
              </div>

              {/* Transport Evidence Document */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transportation Evidence (e-Way Bill / GPS Telematics Route Log) <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      {form.transportEvidence ? (
                        <div className="text-xs font-semibold text-slate-800 truncate">
                          {form.transportEvidence}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500">
                          No transport manifest attached yet
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400">
                        Attach government e-Way bill or signed gate pass (PDF / PNG)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 cursor-pointer transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{form.transportEvidence ? 'Change File' : 'Upload Manifest'}</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setForm((prev) => ({ ...prev, transportEvidence: file.name }));
                        }}
                      />
                    </label>
                    {!form.transportEvidence && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, transportEvidence: 'eWay_Bill_Signed_Log.pdf' }))}
                        className="text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        Sample eWay Bill
                      </button>
                    )}
                    {form.transportEvidence && (
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, transportEvidence: '' }))}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove file"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PHASE 4: SLURRY PREPARATION & TANK SELECTION                 */}
          {/* ============================================================ */}
          {currentPhase === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Phase 4: Slurry Preparation & Tank Assignment
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mix mineral mass with river water, select destination Mixer Tank (T001 or T002), and update tank volume inventory.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Step 4 / 4 (Final)
                </span>
              </div>

              {/* Input Parameters & Tank Selector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left 6 cols: Mixing Input Parameters */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Mineral Mass (kg) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mineral Mass (kg) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={form.mineralMassKg}
                          onChange={(e) => setForm({ ...form, mineralMassKg: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 pr-12 focus:bg-white focus:border-blue-500 outline-none transition-all"
                          placeholder="e.g. 280"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 pointer-events-none">
                          kg
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Carried over from Sourcing phase
                      </span>
                    </div>

                    {/* Water Quantity (Liters) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Water Quantity (Liters) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="1"
                          max="1000"
                          value={form.waterQuantityLiters}
                          onChange={(e) => setForm({ ...form, waterQuantityLiters: e.target.value === '' ? '' : Number(e.target.value) })}
                          className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 pr-12 focus:bg-white focus:border-blue-500 outline-none transition-all"
                          placeholder="e.g. 340"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-400 pointer-events-none">
                          L
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Filtered local Godavari river water
                      </span>
                    </div>
                  </div>

                  {/* Calculated Slurry Properties Readout Card */}
                  <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-900 border-b border-blue-200/60 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        Live Calculated Slurry Properties
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-blue-700">
                        {calculatedSlurryVolume > 0 ? `Total: ${calculatedSlurryVolume} Liters` : 'Enter quantities'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                      <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                        <div className="text-[10px] text-slate-500 font-medium">Slurry Volume</div>
                        <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                          {calculatedSlurryVolume > 0 ? `${calculatedSlurryVolume} L` : '-- L'}
                        </div>
                      </div>
                      <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                        <div className="text-[10px] text-slate-500 font-medium">Concentration</div>
                        <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                          {calculatedConcentration > 0 ? `${calculatedConcentration} g/L` : '-- g/L'}
                        </div>
                      </div>
                      <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                        <div className="text-[10px] text-slate-500 font-medium">Density</div>
                        <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                          {calculatedSlurryVolume > 0 ? `${calculatedDensity} kg/L` : '-- kg/L'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 6 cols: Select Target Tank (T001 or T002) */}
                <div className="lg:col-span-6 space-y-3">
                  <label className="block text-xs font-bold text-slate-800">
                    Select Destination Mixer Tank <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tanks.map((tank) => {
                      const isSelected = form.selectedTankId === tank.id;
                      const freeSpace = tank.capacityLiters - tank.currentVolumeLiters;
                      const hasRoom = calculatedSlurryVolume <= freeSpace;
                      const fillPct = Math.round((tank.currentVolumeLiters / tank.capacityLiters) * 100);

                      return (
                        <div
                          key={tank.id}
                          onClick={() => setForm({ ...form, selectedTankId: tank.id })}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                              : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full inline-block ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                              {tank.name}
                            </span>
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                                fillPct >= 85
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {fillPct}% Full
                            </span>
                          </div>

                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between text-slate-600">
                              <span>Current:</span>
                              <strong className="text-slate-800">{tank.currentVolumeLiters} / 1000 L</strong>
                            </div>
                            <div className="flex justify-between text-slate-600">
                              <span>Available Space:</span>
                              <strong className={hasRoom ? 'text-emerald-700' : 'text-rose-600'}>
                                {freeSpace} L
                              </strong>
                            </div>
                          </div>

                          {/* Mini visual fill bar */}
                          <div className="mt-2.5 w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-blue-600 h-full transition-all duration-300"
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>

                          {calculatedSlurryVolume > 0 && !hasRoom && (
                            <div className="mt-2 text-[10px] font-bold text-rose-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              Exceeds capacity by {calculatedSlurryVolume - freeSpace}L!
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {!form.selectedTankId && (
                    <div className="p-2 bg-slate-100 rounded-lg text-[11px] text-slate-500 text-center font-medium">
                      Please click on Tank T001 or Tank T002 above to assign destination
                    </div>
                  )}

                  {willOverflow && selectedTank && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        The calculated slurry volume ({calculatedSlurryVolume}L) exceeds remaining space in {selectedTank.name}. Please select the other tank or decrease water/mineral mass.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Wizard Action Footer Bar */}
          <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            {/* Left: Back button (shown from phase 2 onwards) */}
            <div>
              {currentPhase > 1 ? (
                <button
                  type="button"
                  onClick={handleBackPhase}
                  className="btn-press px-4 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Phase {currentPhase - 1}</span>
                </button>
              ) : (
                <span className="text-xs text-slate-400">
                  Fill all required fields to proceed to Phase 2
                </span>
              )}
            </div>

            {/* Right: Next or Create Batch button */}
            <div>
              {currentPhase < 4 ? (
                <button
                  type="button"
                  disabled={
                    (currentPhase === 1 && !isPhase1Valid) ||
                    (currentPhase === 2 && !isPhase2Valid) ||
                    (currentPhase === 3 && !isPhase3Valid)
                  }
                  onClick={handleNextPhase}
                  className={`btn-press px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                    (currentPhase === 1 && isPhase1Valid) ||
                    (currentPhase === 2 && isPhase2Valid) ||
                    (currentPhase === 3 && isPhase3Valid)
                      ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-blue-500/30 ring-2 ring-blue-400/40'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>Proceed to Phase {currentPhase + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!isPhase4Valid}
                  onClick={handleCreateBatch}
                  className={`btn-press px-6 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md ${
                    isPhase4Valid
                      ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-emerald-600/30 ring-2 ring-emerald-400/50'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Create Batch & Load into {form.selectedTankId || 'Tank'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Section B: Two Big Containers Visualization (T001 & T002) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Factory className="w-5 h-5 text-blue-600" />
              Mixer Storage Tanks (T001 & T002)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live volumetric container visualization (1,000L capacity each) with phone-charge style percentage indicators and internal batch constituents.
            </p>
          </div>
          <div className="text-xs text-slate-500">
            Total Inventory: <strong className="text-slate-800">{totalSlurryLiters} L</strong> / {totalCapacityLiters} L
          </div>
        </div>

        {/* 2 Big Container Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {tanks.map((tank) => {
            const fillPct = Math.round((tank.currentVolumeLiters / tank.capacityLiters) * 100);
            const freeLiters = tank.capacityLiters - tank.currentVolumeLiters;

            return (
              <div
                key={tank.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Tank Header */}
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-mono font-black flex items-center justify-center text-sm border border-blue-200">
                        {tank.id}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {tank.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Capacity: 1,000 Liters • {tank.batches.length} Batches Loaded
                        </p>
                      </div>
                    </div>

                    {/* Phone Charge / Battery Style Percentage Badge */}
                    <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-md border border-slate-700">
                      {/* Battery Graphic */}
                      <div className="w-6 h-3.5 border-2 border-white rounded-xs p-0.5 flex items-center relative">
                        <div
                          className={`h-full rounded-2xs bg-gradient-to-r ${getBatteryFillColor(fillPct)} transition-all duration-500`}
                          style={{ width: `${Math.max(8, fillPct)}%` }}
                        />
                        {/* Battery tip */}
                        <div className="w-0.5 h-1.5 bg-white absolute -right-1 top-1/2 -translate-y-1/2 rounded-r-xs" />
                      </div>
                      {/* Percentage Text */}
                      <span className="font-mono font-black text-sm tracking-tight text-emerald-400">
                        {fillPct}%
                      </span>
                    </div>
                  </div>

                  {/* Main Container Graphical Column (Big Tank Visualization) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-3">
                    {/* Visual Cylindrical Tank Graphic (5 cols) */}
                    <div className="sm:col-span-5 flex flex-col items-center">
                      {/* Top Agitator Motor Housing */}
                      <div className="w-16 h-4 bg-slate-700 rounded-t-md flex items-center justify-center shadow-xs">
                        <span className={`w-2 h-2 rounded-full ${tank.motorRpm > 0 ? 'bg-cyan-400 animate-ping' : 'bg-slate-400'}`} />
                      </div>

                      {/* Main Tank Barrel */}
                      <div className="w-28 sm:w-32 h-64 bg-slate-100 rounded-b-2xl border-4 border-slate-300 relative overflow-hidden flex flex-col justify-end shadow-inner">
                        {/* Height Scale Measurement Ticks */}
                        <div className="absolute inset-y-0 right-1.5 flex flex-col justify-between py-2 text-[8px] font-mono text-slate-400 select-none z-10">
                          <span>1000L</span>
                          <span>750L</span>
                          <span>500L</span>
                          <span>250L</span>
                          <span>0L</span>
                        </div>

                        {/* Liquid Slurry Column with Dynamic Height */}
                        <div
                          className={`w-full bg-gradient-to-t ${getBatteryFillColor(fillPct)} transition-all duration-700 relative`}
                          style={{ height: `${fillPct}%` }}
                        >
                          {/* Top surface wave line */}
                          {fillPct > 0 && (
                            <div className="absolute -top-1.5 inset-x-0 h-3 bg-white/40 rounded-full blur-[1px] animate-pulse" />
                          )}
                        </div>

                        {/* Centered Volume HUD Pill */}
                        <div className="absolute inset-x-2 bottom-3 bg-black/60 backdrop-blur-xs text-white text-center py-1.5 px-1 rounded-lg border border-white/20 z-10">
                          <div className="text-xs font-mono font-bold leading-none">
                            {tank.currentVolumeLiters} L
                          </div>
                          <div className="text-[9px] text-cyan-200 mt-0.5 leading-none">
                            {fillPct}% Filled
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Tank Properties & Status (7 cols) */}
                    <div className="sm:col-span-7 space-y-2.5">
                      {/* Status & Available Headroom */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Available Space:</span>
                          <span className="font-mono font-bold text-emerald-600">
                            {freeLiters} Liters
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Agitator Speed:</span>
                          <span className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${tank.motorRpm > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                            {tank.motorRpm} RPM
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Slurry Density:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {tank.densityKgPerL} kg/L
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Slurry pH:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {tank.ph}
                          </span>
                        </div>
                      </div>

                      {/* Phone charge style progress bar */}
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>Volumetric Capacity Fill</span>
                          <span className="font-mono">{fillPct}% (1000 L max)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getBatteryFillColor(fillPct)} transition-all duration-500`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleFlushTank(tank.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 active:bg-rose-200 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
                          title="Flush/drain tank to 0L for test mixing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Drain / Flush</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {tank.batches.length} batches stored
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Batches inside this Tank */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Boxes className="w-3.5 h-3.5 text-blue-600" />
                        Batches Loaded in this Tank ({tank.batches.length})
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        Constituent Audit Log
                      </span>
                    </div>

                    {tank.batches.length > 0 ? (
                      <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                        {tank.batches.map((batch, idx) => (
                          <div
                            key={`${batch.batchId}-${idx}`}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition-colors flex items-start justify-between gap-2"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded border border-blue-200">
                                  {batch.batchId}
                                </span>
                                <span className="text-xs font-bold text-slate-800 truncate">
                                  {batch.mineralType}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                Sourced from {batch.supplier} • {batch.origin}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                Added {batch.dateAdded}
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-xs font-mono font-bold text-slate-900">
                                +{batch.slurryVolumeLiters} L
                              </div>
                              <div className="text-[10px] font-mono text-slate-500">
                                {batch.mineralMassKg} kg mineral
                              </div>
                              <span className="inline-block mt-0.5 text-[9px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                {batch.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                        Tank is currently empty (0 L). Prepare a batch in Phase 4 to load slurry.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Tank & Batch History Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Tank & Batch History
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/60 text-xs">
            <button
              type="button"
              onClick={() => setHistoryFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                historyFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('BATCH_CREATED')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                historyFilter === 'BATCH_CREATED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Additions
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('TRIP_DISPATCH')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                historyFilter === 'TRIP_DISPATCH'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dispatches
            </button>
            <button
              type="button"
              onClick={() => setHistoryFilter('TANK_FLUSH')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                historyFilter === 'TANK_FLUSH'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Flushes
            </button>
          </div>
        </div>

        {/* Crisp History Events List */}
        <div className="divide-y divide-slate-100">
          {slurryEventsHistory
            .filter((evt) => (historyFilter === 'ALL' ? true : evt.type === historyFilter))
            .map((evt) => {
              const isAddition = evt.type === 'BATCH_CREATED';
              const isDispatch = evt.type === 'TRIP_DISPATCH';

              return (
                <div
                  key={evt.id}
                  className="px-5 py-3 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isAddition
                          ? 'bg-emerald-50 text-emerald-600'
                          : isDispatch
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {isAddition ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : isDispatch ? (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="font-bold text-slate-800">
                        {isAddition
                          ? `Batch ${evt.batchId} Loaded`
                          : isDispatch
                          ? `Dispatched to ${evt.assetName || 'AquaDrone'}`
                          : 'Tank Flush'}
                      </span>
                      <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {evt.tankId}
                      </span>
                      {isDispatch && evt.batchId && (
                        <span className="font-mono text-[11px] text-slate-500">
                          ({evt.batchId})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Volume Delta & Timestamp */}
                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <span
                      className={`font-mono font-bold text-xs ${
                        isAddition
                          ? 'text-emerald-600'
                          : isDispatch
                          ? 'text-blue-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {evt.volumeDeltaLiters > 0
                        ? `+${evt.volumeDeltaLiters} L`
                        : evt.volumeDeltaLiters < 0
                        ? `${evt.volumeDeltaLiters} L`
                        : '0 L'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                      {evt.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

          {slurryEventsHistory.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-400 text-xs">
              No history events recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const SlurryPreparationTab = MineralDosingTab;

