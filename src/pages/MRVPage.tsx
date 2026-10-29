import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Lock, ArrowRight, Gauge, Database, Cpu, CheckCircle } from 'lucide-react';

export const MRVPage: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'High-Density Continuous Sensing',
      description: 'Multiparameter sonde deployment across upstream reference reaches and downstream dosing plumes. Captures dissolved oxygen (optical DO), glass/ISFET pH, electrical conductivity (EC), and temperature.',
      metric: 'Sampling frequency: 1 Hz to 5-minute telemetry intervals',
      icon: Gauge,
    },
    {
      num: '02',
      title: 'Precision Mass Balance Accounting',
      description: 'Continuous digital telemetry from mobile slurry mixers and metering pump controllers tracking mineral mass, particle size distribution, and feedstock purity to ensure exact stoichiometric dosing.',
      metric: 'Calibrated loadcells & electromagnetic flowmeters',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Freshwater Geochemical Modeling',
      description: 'Application of freshwater CO2SYS thermodynamic carbonate equilibria. Calculates calcite and aragonite saturation states (Ω) to prevent secondary carbonate precipitation and verify net DIC increase.',
      metric: 'Thermodynamic carbonate equilibrium validation',
      icon: Database,
    },
    {
      num: '04',
      title: 'Audit-Ready Verification Ledger',
      description: 'All raw sensor ingest, recalibration drift calculations, and net CO₂ drawdown estimates are securely hashed for accredited third-party validation and ISO 14064-2 standard compliance.',
      metric: 'ISO 14064-2 & Gold Standard CDR alignment',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="flex-1 bg-carbon-bg py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-4 flex items-center gap-2 text-xs font-medium text-carbon-muted" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-carbon-navy transition-colors">Home</Link>
          <span>/</span>
          <span className="text-carbon-text">MRV Framework</span>
        </nav>

        {/* Page Header: 28-32px semibold */}
        <div className="bg-white rounded-lg border border-carbon-border p-6 sm:p-8 shadow-card mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-carbon-navy mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>MONITORING, REPORTING & VERIFICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-carbon-text mb-3">
              Precision MRV for Inland Water Alkalinity Enhancement
            </h1>
            <p className="text-sm sm:text-base text-carbon-muted leading-relaxed mb-5">
              Empirical accounting combining real-time multi-sonde telemetry, hydraulic transport simulation, and carbonate equilibrium chemistry to quantify and verify carbon dioxide removal with durable permanence.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium text-white bg-carbon-navy hover:bg-[#1A4E78] transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-carbon-aqua" />
              <span>Operator Portal Access</span>
            </Link>
          </div>
        </div>

        {/* Section Heading: 20-24px semibold */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-carbon-text">
            Four Core Measurement Pillars
          </h2>
          <p className="text-xs sm:text-sm text-carbon-muted">
            The methodological architecture ensuring scientific rigor and credit integrity
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="bg-white rounded-lg p-5 sm:p-6 border border-carbon-border shadow-card interactive-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-xs font-mono font-semibold text-carbon-navy bg-slate-100 px-2 py-0.5 rounded">
                      {pillar.num}
                    </span>
                    <Icon className="w-4 h-4 text-carbon-muted" />
                  </div>
                  <h3 className="text-base font-semibold text-carbon-text mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-carbon-muted leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-carbon-border text-xs font-mono text-slate-600 bg-slate-50/50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-3 rounded-b-lg">
                  {pillar.metric}
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout: Authenticated Access Gate */}
        <div className="bg-white rounded-lg p-5 sm:p-6 border border-carbon-border shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-semibold text-carbon-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Authorized Access & Raw Data Ingest</span>
            </h3>
            <p className="text-xs sm:text-sm text-carbon-muted leading-relaxed">
              Live pump throttling, asset GPS routes, sensor calibration drift ledgers, and raw 1 Hz telemetry streams are restricted to authenticated operators and accredited verifiers.
            </p>
          </div>
          <Link
            to="/login"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-medium text-white bg-carbon-navy hover:bg-[#1A4E78] transition-colors"
          >
            <span>Operator Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
