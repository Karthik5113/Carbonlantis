import React, { useState } from 'react';
import {
  Bell,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Check,
  Clock,
  Filter
} from 'lucide-react';
import { AlertItemData } from '../../types';

interface OperationalAlertsPanelProps {
  initialAlerts: AlertItemData[];
}

export const OperationalAlertsPanel: React.FC<OperationalAlertsPanelProps> = ({ initialAlerts }) => {
  const [alerts, setAlerts] = useState<AlertItemData[]>(initialAlerts);
  const [filter, setFilter] = useState<string>('all');
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(
    new Set(initialAlerts.filter((a) => a.acknowledged).map((a) => a.id))
  );

  const toggleAcknowledge = (id: string) => {
    setAcknowledgedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    if (filter === 'unacked') return !acknowledgedIds.has(alert.id);
    if (filter === 'warning') return alert.severity === 'warning';
    if (filter === 'healthy') return alert.severity === 'healthy';
    return true;
  });

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'critical':
        return {
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
          borderClass: 'border-l-4 border-l-rose-500'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          borderClass: 'border-l-4 border-l-amber-500'
        };
      case 'healthy':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          borderClass: 'border-l-4 border-l-emerald-500'
        };
      case 'info':
      default:
        return {
          icon: <Activity className="w-4 h-4 text-blue-600" />,
          badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
          borderClass: 'border-l-4 border-l-blue-500'
        };
    }
  };

  return (
    <div className="bg-white rounded-lg border border-carbon-border shadow-card p-4 sm:p-5 flex flex-col justify-between">
      <div>
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-carbon-border pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-carbon-navy shrink-0" />
            <div>
              <h2 className="text-base font-semibold text-carbon-text">
                Operational Telemetry Alerts
              </h2>
              <p className="text-xs text-carbon-muted">
                Automated threshold violations, drift notices & verification checkpoints
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                filter === 'all'
                  ? 'bg-carbon-navy text-white border-carbon-navy'
                  : 'bg-white text-carbon-muted border-carbon-border hover:bg-slate-50'
              }`}
            >
              All ({alerts.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('unacked')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                filter === 'unacked'
                  ? 'bg-carbon-navy text-white border-carbon-navy'
                  : 'bg-white text-carbon-muted border-carbon-border hover:bg-slate-50'
              }`}
            >
              Pending ({alerts.filter((a) => !acknowledgedIds.has(a.id)).length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('warning')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                filter === 'warning'
                  ? 'bg-carbon-navy text-white border-carbon-navy'
                  : 'bg-white text-carbon-muted border-carbon-border hover:bg-slate-50'
              }`}
            >
              Warnings
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
          {filteredAlerts.map((alert) => {
            const isAcked = acknowledgedIds.has(alert.id);
            const style = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border bg-white transition-all flex items-start gap-3 shadow-2xs ${
                  style.borderClass
                } ${isAcked ? 'opacity-65 bg-slate-50/50' : 'hover:bg-slate-50/70'}`}
              >
                {/* Severity Icon */}
                <div className="mt-0.5 shrink-0">{style.icon}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 tracking-tight">
                        {alert.title}
                      </h4>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase font-mono ${style.badgeClass}`}>
                        {alert.severity}
                      </span>
                      {isAcked && (
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-1 rounded font-mono">
                          ACKED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{alert.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      Asset: <strong className="text-slate-600">{alert.stationName}</strong>
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleAcknowledge(alert.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 ${
                        isAcked
                          ? 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{isAcked ? 'Acknowledged' : 'Acknowledge'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Operator Incident Dispatch: <strong>Active</strong></span>
        </span>
        <span className="font-mono text-slate-400">
          Escalation window: 15m
        </span>
      </div>
    </div>
  );
};

