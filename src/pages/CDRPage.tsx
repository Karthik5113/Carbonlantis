import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const CDRPage: React.FC = () => {
  return (
    <div className="flex-1 bg-carbon-bg py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-carbon-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-carbon-navy transition-colors">Home</Link>
          <span>/</span>
          <span className="text-carbon-text">CDR Science</span>
        </nav>

        {/* Page Header: 28-32px semibold */}
        <div className="bg-white rounded-lg border border-carbon-border p-6 sm:p-8 shadow-card mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-carbon-navy mb-2">
              <Scale className="w-3.5 h-3.5" />
              <span>CARBON DIOXIDE REMOVAL PATHWAY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-carbon-text mb-3">
              Inland Water Alkalinity Enhancement (IWAE)
            </h1>
            <p className="text-sm sm:text-base text-carbon-muted leading-relaxed mb-5">
              Accelerating Earth&apos;s natural mineral weathering cycle in high-energy freshwater river basins to convert atmospheric carbon dioxide into permanent, stable dissolved bicarbonate ions.
            </p>
            <Link
              to="/deployments"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-carbon-navy hover:text-[#1A4E78]"
            >
              <span>Inspect Active Basin Deployments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* The Geochemical Pathway */}
        <div className="bg-white rounded-lg p-6 sm:p-8 border border-carbon-border shadow-card mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-carbon-text mb-2">
            The Geochemical Pathway
          </h2>
          <p className="text-xs sm:text-sm text-carbon-muted leading-relaxed mb-4 max-w-3xl">
            When finely milled, safe alkaline minerals (such as calcium silicate or magnesium hydroxide) are precisely dosed into inland waterways, they neutralize dissolved carbonic acid (H₂CO₃), drawing down atmospheric CO₂ and converting it into stable dissolved bicarbonate (HCO₃⁻):
          </p>

          {/* Chemical Equation Box */}
          <div className="bg-[#0B192C] text-carbon-aqua p-4 sm:p-5 rounded-md font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto border border-slate-800 mb-6">
            <div className="text-white font-medium">CaSiO₃ + 2 CO₂ + 3 H₂O ⟶ Ca²⁺ + 2 HCO₃⁻ + H₄SiO₄</div>
            <div className="text-slate-400 text-xs mt-2 font-sans font-normal">
              Stoichiometric Yield: 2 moles of inorganic carbon captured per mole of mineral silicate dosed, stored permanently in freshwater discharge and ocean basins.
            </div>
          </div>

          {/* 3 Parameter Attributes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-md bg-slate-50 border border-carbon-border">
              <span className="text-[11px] font-mono uppercase tracking-wider text-carbon-muted block mb-1">
                Storage Permanence
              </span>
              <span className="text-base font-semibold text-carbon-text block mb-1">
                &gt; 10,000 Years
              </span>
              <p className="text-xs text-carbon-muted leading-relaxed">
                Stable dissolved bicarbonate ions stored in river discharge and marine reservoirs without re-degassing risks.
              </p>
            </div>

            <div className="p-4 rounded-md bg-slate-50 border border-carbon-border">
              <span className="text-[11px] font-mono uppercase tracking-wider text-carbon-muted block mb-1">
                Ecological Co-Benefit
              </span>
              <span className="text-base font-semibold text-carbon-text block mb-1">
                River De-Acidification
              </span>
              <p className="text-xs text-carbon-muted leading-relaxed">
                Neutralizes acidic runoff from agricultural drains, stabilizes pH, and buffers delicate benthic habitats.
              </p>
            </div>

            <div className="p-4 rounded-md bg-slate-50 border border-carbon-border">
              <span className="text-[11px] font-mono uppercase tracking-wider text-carbon-muted block mb-1">
                Operational Ceiling
              </span>
              <span className="text-base font-semibold text-carbon-text block mb-1">
                pH &lt; 8.50 Threshold
              </span>
              <p className="text-xs text-carbon-muted leading-relaxed">
                Strict multi-sonde automated pump throttling guarantees river pH remains within safe biological safety envelopes.
              </p>
            </div>
          </div>
        </div>

        {/* Why Inland Waters vs Open Ocean */}
        <div className="bg-white rounded-lg p-6 sm:p-8 border border-carbon-border shadow-card">
          <h2 className="text-lg sm:text-xl font-semibold text-carbon-text mb-3">
            Why Inland Waters (IWAE) vs Direct Open Ocean Addition?
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-carbon-muted leading-relaxed max-w-3xl">
            <p>
              Inland waterways, agricultural drainage systems, canals, and river delta channels exhibit superior hydraulic mixing energy, rapid mineral residence contact, and elevated partial pressure of dissolved CO₂ compared to open oceans.
            </p>
            <p>
              This maximizes dissolution kinetics while enabling localized, highly verifiable sensor telemetry across defined hydraulic reaches before water discharges into open marine basins.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-carbon-border flex items-center gap-2">
            <Link
              to="/deployments"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-carbon-navy hover:text-[#1A4E78]"
            >
              <span>Explore Godavari Delta pilot catchment deployments</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
