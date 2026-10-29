import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';
import { AlertItemData } from '../../types';
import { AlertItem } from './AlertItem';

interface AlertsCardProps {
  alerts: AlertItemData[];
  isDemo?: boolean;
}

export const AlertsCard: React.FC<AlertsCardProps> = ({ alerts, isDemo = true }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    if (filter === 'warning') return alert.severity === 'warning' || alert.severity === 'critical';
    if (filter === 'healthy') return alert.severity === 'healthy';
    if (filter === 'info') return alert.severity === 'info';
    return true;
  });

  const filterTabs = [
    { id: 'all', label: `All (${alerts.length})` },
    { id: 'warning', label: 'Warnings' },
    { id: 'healthy', label: 'Nominal' },
    { id: 'info', label: 'Telemetry' },
  ];

  return (
    <div className="bg-white rounded-lg border border-carbon-border shadow-card interactive-card p-5 sm:p-6 flex flex-col justify-between h-full">
      <div>
        {/* Card Header: 15-18px semibold */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-carbon-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-carbon-navy/10 text-carbon-navy flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-carbon-text">
                Telemetry & System Alerts
              </h2>
              <p className="text-xs text-carbon-muted">
                Buffering threshold monitoring, sensor health & calibration logs
              </p>
            </div>
          </div>

          <Link
            to="/mrv#alerts"
            className="group inline-flex items-center gap-1 text-xs font-medium text-carbon-navy hover:text-[#1A4E78] transition-colors self-start sm:self-auto"
          >
            <span>Telemetry Specs</span>
            <ArrowRight className="w-3.5 h-3.5 text-carbon-navy group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Restrained Filter Pills */}
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1 text-xs" role="tablist" aria-label="Alert Severity Filter">
          {filterTabs.map((tab) => {
            const isSelected = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setFilter(tab.id)}
                className={`btn-press px-2.5 py-1 rounded-md text-xs font-medium transition-colors border cursor-pointer ${
                  isSelected
                    ? 'bg-carbon-navy text-white border-carbon-navy shadow-xs'
                    : 'bg-white text-carbon-muted border-carbon-border hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Compact, Scannable Alerts List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))
          ) : (
            <div className="text-center py-10 text-carbon-muted text-xs border border-dashed border-carbon-border rounded-md">
              No notifications matching the selected filter.
            </div>
          )}
        </div>
      </div>

      {/* Footer Demonstration Status */}
      <div className="mt-4 pt-3 border-t border-carbon-border flex items-center justify-between text-xs text-carbon-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-soft-pulse" />
          <span>Telemetry Stream: <strong className="text-carbon-text font-medium">Nominal (1 Hz Ingest)</strong></span>
        </span>
        {isDemo && (
          <span className="text-[11px] text-slate-400 font-mono">
            Active Feed
          </span>
        )}
      </div>
    </div>
  );
};
