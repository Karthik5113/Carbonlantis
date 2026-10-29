import React from 'react';
import {
  Sparkles,
  Scale,
  ShieldCheck,
  FileCheck2,
  Download,
  AlertCircle,
  HelpCircle,
  Activity,
  Award
} from 'lucide-react';
import {
  carbonateChemistryData,
  carbonRemovalAccountingData,
  mrvReportPackagesData
} from '../../../data/dashboardData';

export const CarbonRemovalTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 1. Carbon Removal Accounting Ledger (Gross vs Net) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-5 border border-carbon-border shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            <span>Gross CO₂ Captured</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-sans">
            {carbonRemovalAccountingData.grossRemovedTons} tCO₂
          </div>
          <div className="text-[11px] text-slate-500">Total stoichiometric dissolution</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-carbon-border shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            <span>Life Cycle Deductions</span>
            <Scale className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 font-sans">
            -{carbonRemovalAccountingData.scope1Scope2DeductionsTons} tCO₂
          </div>
          <div className="text-[11px] text-slate-500">Milling, transport & vessel auxiliary</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-carbon-border shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            <span>Net Creditable CDR</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700 font-sans">
            {carbonRemovalAccountingData.netCreditableTons} tCO₂
          </div>
          <div className="text-[11px] text-emerald-600 font-medium">95.8% Conservative Confidence</div>
        </div>

        <div className="bg-white rounded-lg p-5 border border-carbon-border shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
            <span>Storage Durability</span>
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-sans">
            &gt; 10,000 Yrs
          </div>
          <div className="text-[11px] text-slate-500">Stable dissolved bicarbonate ions</div>
        </div>
      </div>

      {/* 2. Carbonate Chemistry Calculations (CO2SYS Geochemical Equilibrium) */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
                Carbonate Chemistry & Equilibrium Calculations
              </h3>
              <p className="text-xs text-slate-500">
                Freshwater carbonate system equilibrium (CO2SYS) • Godavari Delta Reach
              </p>
            </div>
          </div>

          <span className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-xl font-bold">
            Model: IWAE-Geochem-v3.2
          </span>
        </div>

        {/* Calculation Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Dissolved Inorganic Carbon (DIC)
            </span>
            <div className="text-lg font-black text-slate-900 font-mono">
              {carbonateChemistryData.postDosingDicUmolKg} <span className="text-xs font-normal text-slate-500">µmol/kg</span>
            </div>
            <div className="text-xs font-mono text-emerald-700 mt-1 font-semibold">
              ΔDIC: +{carbonateChemistryData.deltaDicUmolKg} µmol/kg (Baseline: {carbonateChemistryData.baselineDicUmolKg})
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Total Alkalinity (TA)
            </span>
            <div className="text-lg font-black text-slate-900 font-mono">
              {carbonateChemistryData.postDosingTotalAlkalinityUeqKg} <span className="text-xs font-normal text-slate-500">µeq/kg</span>
            </div>
            <div className="text-xs font-mono text-blue-700 mt-1 font-semibold">
              ΔTA: +{carbonateChemistryData.deltaTotalAlkalinityUeqKg} µeq/kg (Baseline: {carbonateChemistryData.baselineTotalAlkalinityUeqKg})
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              pCO₂ Atmospheric Disequilibrium
            </span>
            <div className="text-lg font-black text-cyan-800 font-mono">
              {carbonateChemistryData.postDosingPco2Ppm} <span className="text-xs font-normal text-slate-500">ppm</span>
            </div>
            <div className="text-xs font-mono text-cyan-700 mt-1 font-semibold">
              ΔpCO₂: {carbonateChemistryData.deltaPco2Ppm} ppm (Drawdown actively drawing atmospheric CO₂)
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              Mineral Saturation Index (Ω)
            </span>
            <div className="text-lg font-black text-slate-900 font-mono">
              Ω_calcite: {carbonateChemistryData.calciteSaturationOmega}
            </div>
            <div className="text-xs font-mono text-emerald-700 mt-1 font-semibold">
              Safely &lt; 2.50 ceiling (Zero runaway carbonate precipitation)
            </div>
          </div>
        </div>

        {/* Reaction Stoichiometry Callout */}
        <div className="p-3.5 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800 flex items-center justify-between">
          <span>{"CaSiO₃ + 2 CO₂ + 3 H₂O  ⟶  Ca²⁺ + 2 HCO₃⁻ + H₄SiO₄"}</span>
          <span className="text-slate-400 text-[11px] font-sans hidden sm:inline">
            Theoretical yield: 0.92 tCO₂ net captured per ton of mineral feed
          </span>
        </div>
      </div>

      {/* 3. Uncertainty Assessment & Confidence Propagation */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
              Uncertainty Assessment & Discount Modeling
            </h3>
          </div>
          <span className="text-xs font-mono text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-lg border border-purple-200 font-bold">
            95% Confidence Interval (±4.2%)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="block text-slate-800 font-bold mb-1">1. River Discharge Variance (±2.4%)</strong>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Acoustic Doppler Current Profiler (ADCP) cross-sectional flow rating curve variance.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="block text-slate-800 font-bold mb-1">2. Sensor Drift Tolerance (±1.8%)</strong>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Maximum allowed drift between recalibration intervals (±0.03 pH / ±15 µS/cm EC).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <strong className="block text-slate-800 font-bold mb-1">3. Conservative Buffer Discount (-5.0%)</strong>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Mandatory conservative buffer withholding applied before registry certificate issuance.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Certified MRV Reports & Registry Packages */}
      <div className="bg-white rounded-lg border border-carbon-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-[#0A1628] uppercase tracking-wider font-sans">
              Audited MRV Verification Packages
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">ISO 14064-2 Cryptographic Ledger</span>
        </div>

        <div className="space-y-3">
          {mrvReportPackagesData.map((pkg) => (
            <div
              key={pkg.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-sm font-bold text-slate-900">{pkg.reportBatchCode}</strong>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                    pkg.verificationStatus.includes('Verified')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {pkg.verificationStatus}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  {pkg.period} • {pkg.catchment} • Auditor: {pkg.verifier}
                </div>
                <div className="font-mono text-[10px] text-slate-400 mt-1 truncate max-w-lg">
                  SHA-256: {pkg.sha256Hash}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block font-sans">Verified Net Carbon</span>
                  <strong className="text-sm text-blue-700 font-bold">{pkg.totalNetCo2Tonnes} tCO₂</strong>
                </div>

                <button
                  type="button"
                  onClick={() => alert(`Downloading audited dossier package for ${pkg.reportBatchCode}...`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Dossier (PDF)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
