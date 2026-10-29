import React from 'react';
import { Droplets, PlusCircle, Gauge, Activity, RefreshCw } from 'lucide-react';
import { SlurryMixerTank } from '../../types';

interface SlurryPreparationSectionProps {
  mixerTanks: SlurryMixerTank[];
  onOpenPrepareSlurryModal: () => void;
}

export const SlurryPreparationSection: React.FC<SlurryPreparationSectionProps> = ({
  mixerTanks,
  onOpenPrepareSlurryModal,
}) => {
  const totalVolumeLiters = mixerTanks.reduce((acc, t) => acc + t.volumeLiters, 0);
  const avgDensity = (
    mixerTanks.reduce((acc, t) => acc + t.densityGPerL, 0) / (mixerTanks.length || 1) / 1000
  ).toFixed(3);

  return (
    <section className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
              Slurry Preparation
            </h2>
            <p className="text-xs text-slate-500">
              Continuous wet mixing, particle dispersion, suspension density stabilization, and batch mixing
            </p>
          </div>
        </div>

        {/* Action Button: Prepare Slurry */}
        <button
          type="button"
          onClick={onOpenPrepareSlurryModal}
          className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Prepare Slurry</span>
        </button>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            Prepared Slurry Batches
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 font-sans">2</span>
            <span className="text-xs font-mono text-slate-500">Batches</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">#SLR-441 & #SLR-442</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            Slurry Concentration
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 font-sans">{avgDensity}</span>
            <span className="text-xs font-mono text-slate-500">g/cm³</span>
          </div>
          <span className="text-[10px] text-teal-700 font-medium">4.0 : 1.0 water:solid ratio</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            Available Slurry Volume
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 font-sans">
              {totalVolumeLiters.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-500">Liters</span>
          </div>
          <span className="text-[10px] text-slate-500">Across 2 tanks (12,000L cap)</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            Batch Preparation Status
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-900 font-sans">1 Mixing</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">1 Ready in reserve</span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            Preparation Timestamp
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-slate-900 font-mono">09:45 UTC</span>
          </div>
          <span className="text-[10px] text-slate-500">Today • Continuous batch</span>
        </div>
      </div>

      {/* Active Mixer Tanks Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mixerTanks.map((tank) => {
          const capPct = Math.round((tank.volumeLiters / tank.capacityLiters) * 100);
          const isMixing = tank.status === 'Mixing';

          return (
            <div
              key={tank.id}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{tank.tankName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase ${
                        isMixing
                          ? 'bg-teal-100 text-teal-800 animate-pulse border border-teal-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {tank.status}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {tank.volumeLiters} / {tank.capacityLiters} L ({capPct}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full rounded-full ${
                      isMixing ? 'bg-teal-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${capPct}%` }}
                  />
                </div>

                {/* Grid metrics */}
                <div className="grid grid-cols-4 gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs font-mono text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Density</span>
                    <strong className="text-blue-700">
                      {(tank.densityGPerL / 1000).toFixed(3)}
                    </strong>
                    <span className="text-[9px] text-slate-400 block">g/cm³</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Viscosity</span>
                    <strong>{tank.viscosityCP}</strong>
                    <span className="text-[9px] text-slate-400 block">cP</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Agitation</span>
                    <strong>{tank.motorRpm}</strong>
                    <span className="text-[9px] text-slate-400 block">RPM</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Temp</span>
                    <strong>{tank.temperatureC}°C</strong>
                    <span className="text-[9px] text-slate-400 block">Cooling ok</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Motor Load: {isMixing ? '68%' : '14% idle'}</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-600" />
                  <span>Suspension Stable</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

