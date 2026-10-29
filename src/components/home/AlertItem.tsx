import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Activity, Clock } from 'lucide-react';
import { AlertItemData } from '../../types';

interface AlertItemProps {
  alert: AlertItemData;
}

export const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const getSeverityBadge = () => {
    switch (alert.severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>Critical</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Warning</span>
          </span>
        );
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Nominal</span>
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
            <Activity className="w-3 h-3 text-blue-600" />
            <span>Telemetry</span>
          </span>
        );
    }
  };

  return (
    <article
      className="p-3 rounded-md border border-carbon-border bg-white hover:border-slate-300 hover:shadow-xs transition-all group"
      aria-label={`${alert.severity} alert: ${alert.title}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          {getSeverityBadge()}
          <h4 className="text-xs font-semibold text-carbon-text group-hover:text-carbon-navy transition-colors">
            {alert.title}
          </h4>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono shrink-0">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>{alert.timestamp}</span>
        </div>
      </div>

      <p className="text-xs text-carbon-muted leading-relaxed mb-1.5">
        {alert.description}
      </p>

      {alert.stationName && (
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span>Asset: <strong className="text-slate-600 font-medium">{alert.stationName}</strong></span>
          <span>•</span>
          <span>{alert.category}</span>
        </div>
      )}
    </article>
  );
};
