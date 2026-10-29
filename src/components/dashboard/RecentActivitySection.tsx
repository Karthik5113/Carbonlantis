import React from 'react';
import {
  History,
  Boxes,
  Droplets,
  Play,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sparkles,
  Info
} from 'lucide-react';

export interface OperationalEvent {
  id: string;
  type: 'mineral_received' | 'slurry_prepared' | 'cycle_started' | 'cycle_completed' | 'deviation_detected' | 'station_event' | 'mrv_completed';
  timestamp: string;
  title: string;
  detail: string;
  reference: string;
  operator: string;
}

export const recentOperationalEvents: OperationalEvent[] = [
  {
    id: 'evt-01',
    type: 'mrv_completed',
    timestamp: '12 mins ago',
    title: 'MRV Carbon Removal Accounting Calculation Completed',
    detail: 'Net alkalinity injection calculation verified +842.8 tCO₂ gross drawdown with confidence interval 94.2%.',
    reference: 'Report #MRV-GDV-2026-Q3',
    operator: 'Sarah Jenkins, PE (Auditor)'
  },
  {
    id: 'evt-02',
    type: 'cycle_completed',
    timestamp: '35 mins ago',
    title: 'Dosing Cycle #148 Completed on MDP-01',
    detail: 'Delivered 1,083 kg Calcium Silicate slurry at average rate 180.5 kg/hr. Mean plume pH 8.28.',
    reference: 'Cycle #148 (MDP-01)',
    operator: 'Dr. Elena Vance'
  },
  {
    id: 'evt-03',
    type: 'cycle_started',
    timestamp: '1 hour ago',
    title: 'Dosing Cycle #149 Started on MDP-02 Delta Ranger',
    detail: 'Automated velocity-proportional injection initialized with target rate 140 kg/hr.',
    reference: 'Cycle #149 (MDP-02)',
    operator: 'Marcus Chen'
  },
  {
    id: 'evt-04',
    type: 'slurry_prepared',
    timestamp: '2 hours ago',
    title: 'Slurry Batch #SLR-442 Prepared in Mixer Tank 1',
    detail: '4,800 Liters wet-mixed to 1.182 g/cm³ density using Wollastonite Batch WOL-2026-08.',
    reference: 'Batch #SLR-442',
    operator: 'Marcus Chen'
  },
  {
    id: 'evt-05',
    type: 'mineral_received',
    timestamp: '4 hours ago',
    title: 'Mineral Batch WOL-2026-08 Received & Silo Deposited',
    detail: '148.5 Tons Calcium Silicate (CaSiO₃) received from Deccan GeoMinerals with 98.4% assay purity certificate.',
    reference: 'Batch #WOL-2026-08',
    operator: 'Logistics Desk'
  },
  {
    id: 'evt-06',
    type: 'station_event',
    timestamp: '6 hours ago',
    title: 'Monitoring Station Alpha Telemetry Watchdog Re-sync',
    detail: 'Automated daily sonde sensor calibration check completed. Optical DO and pH drift < 0.02.',
    reference: 'KSP-MRV-01',
    operator: 'Telemetry Watchdog'
  }
];

export const RecentActivitySection: React.FC = () => {
  const getEventIcon = (type: OperationalEvent['type']) => {
    switch (type) {
      case 'mineral_received':
        return (
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Boxes className="w-3.5 h-3.5" />
          </div>
        );
      case 'slurry_prepared':
        return (
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <Droplets className="w-3.5 h-3.5" />
          </div>
        );
      case 'cycle_started':
        return (
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Play className="w-3.5 h-3.5 fill-current" />
          </div>
        );
      case 'cycle_completed':
        return (
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        );
      case 'deviation_detected':
        return (
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        );
      case 'station_event':
        return (
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Radio className="w-3.5 h-3.5" />
          </div>
        );
      case 'mrv_completed':
      default:
        return (
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
              Recent Operational Activity
            </h2>
            <p className="text-xs text-slate-500">
              Audit log of feedstock deliveries, slurry batches, dosing operations, and telemetry verifications
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded font-semibold self-start sm:self-auto">
          Audit Trail: Cryptographically Logged
        </span>
      </div>

      {/* Timeline List */}
      <div className="divide-y divide-slate-100">
        {recentOperationalEvents.map((evt) => (
          <div
            key={evt.id}
            className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-lg transition-colors text-xs"
          >
            <div className="flex items-start gap-3">
              {getEventIcon(evt.type)}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900">{evt.title}</span>
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200 font-semibold">
                    {evt.reference}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {evt.detail}
                </p>
                <span className="text-[10.5px] text-slate-400 font-mono mt-1 block">
                  Logged by: {evt.operator}
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-slate-400 shrink-0 self-end sm:self-center">
              {evt.timestamp}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom disclaimer */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
        <Info className="w-3.5 h-3.5 shrink-0" />
        <span>
          Sample event log data shown for demonstration. Integration with backend Django audit trails will stream live immutable event logs.
        </span>
      </div>
    </section>
  );
};

