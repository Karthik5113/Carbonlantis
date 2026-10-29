import React, { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Filter,
  ExternalLink
} from 'lucide-react';
import { AlertSeverity } from '../../types';

export interface DashboardAlertRecord {
  id: string;
  category: 'inventory' | 'slurry' | 'dosing' | 'pump' | 'sensor';
  title: string;
  message: string;
  severity: AlertSeverity;
  timestamp: string;
  affectedTarget: string;
  detailLink?: string;
}

export const initialOperationalAlerts: DashboardAlertRecord[] = [
  {
    id: 'alt-01',
    category: 'inventory',
    title: 'Low Mineral Inventory Warning',
    message: 'Mg(OH)₂ slurry feedstock stockpile (62.0 t) approaching reorder threshold of 25.0 t. Estimated 18 days operational runway remaining.',
    severity: 'warning',
    timestamp: '25 mins ago',
    affectedTarget: 'Batch #MGH-2026-03'
  },
  {
    id: 'alt-02',
    category: 'dosing',
    title: 'Minor Dosing Flow Deviation',
    message: 'MDP-02 Delta Ranger actual injection rate (+1.4%) within acceptable variance window (±3.0%). Automated PID loop throttling active.',
    severity: 'info',
    timestamp: '42 mins ago',
    affectedTarget: 'MDP-02 (Delta Ranger)'
  },
  {
    id: 'alt-03',
    category: 'pump',
    title: 'Peristaltic Hose Duty Cycle Alert',
    message: 'MDP-02 peristaltic pump tube logged 38% cumulative duty cycle. Scheduled preventative inspection recommended at 75%.',
    severity: 'info',
    timestamp: '1 hour ago',
    affectedTarget: 'Peristaltic Pump Beta'
  },
  {
    id: 'alt-04',
    category: 'slurry',
    title: 'Slurry Density Nominal in Primary Tank',
    message: 'Mixer Tank 1 slurry density verified at 1.182 g/cm³ with continuous shear agitation (450 RPM). Suspension stable.',
    severity: 'healthy',
    timestamp: '2 hours ago',
    affectedTarget: 'Mixer Tank 1 (Primary Feed)'
  },
  {
    id: 'alt-05',
    category: 'sensor',
    title: 'Station Gamma Telemetry Ingest Verified',
    message: 'Downstream Verification Sonde GDV-MRV-03 reporting 100% packet integrity at 1 Hz with zero checksum errors.',
    severity: 'healthy',
    timestamp: '3 hours ago',
    affectedTarget: 'GDV-MRV-03 (Confluence)'
  }
];

export const OperationalAlertsSection: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [alerts, setAlerts] = useState<DashboardAlertRecord[]>(initialOperationalAlerts);

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  const getSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-3.5 h-3.5" />
          </span>
        );
      case 'warning':
        return (
          <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
          </span>
        );
      case 'healthy':
        return (
          <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </span>
        );
      case 'info':
      default:
        return (
          <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Info className="w-3.5 h-3.5" />
          </span>
        );
    }
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5 space-y-4">
      {/* Header with Title & Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-sans tracking-tight">
            Operational Alerts
          </h2>
          <p className="text-xs text-slate-500">
            Real-time feedstocks, mixer tanks, dosing deviations, pump health, and sensor links
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterSeverity('all')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterSeverity === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('warning')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterSeverity === 'warning' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warnings (1)
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('info')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterSeverity === 'info' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Info (2)
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('healthy')}
            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              filterSeverity === 'healthy' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Healthy (2)
          </button>
        </div>
      </div>

      {/* Alerts Rows */}
      <div className="space-y-2.5">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-2.5">
              {getSeverityBadge(alert.severity)}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{alert.title}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 font-semibold">
                    {alert.affectedTarget}
                  </span>
                </div>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="text-[11px] font-mono text-slate-400">
                {alert.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

