import React from 'react';
import { BarChart3, Layers, Radio, Sparkles } from 'lucide-react';
import { StatItem } from '../../types';

interface StatCardProps {
  stat: StatItem;
  isDemo?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ stat, isDemo = true }) => {
  const renderIcon = () => {
    switch (stat.iconName) {
      case 'chart':
        return <BarChart3 className="w-4 h-4 text-carbon-aqua" aria-hidden="true" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-emerald-400" aria-hidden="true" />;
      case 'sensor':
        return <Radio className="w-4 h-4 text-cyan-300" aria-hidden="true" />;
      default:
        return <Sparkles className="w-4 h-4 text-carbon-aqua" aria-hidden="true" />;
    }
  };

  const getIconContainerStyle = () => {
    switch (stat.accentColor) {
      case 'blue':
        return 'bg-carbon-navy/60 text-carbon-aqua border-slate-700/80';
      case 'green':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40';
      case 'violet':
        return 'bg-cyan-950/40 text-cyan-300 border-cyan-800/40';
      default:
        return 'bg-carbon-navy/60 text-carbon-aqua border-slate-700/80';
    }
  };

  return (
    <div className="flex flex-col justify-between p-4 sm:p-5 rounded-lg bg-[#071322]/90 border border-slate-800/90 text-slate-200 interactive-card hover:border-slate-700 hover:bg-[#08172b]">
      <div>
        {/* Top Header: Metric and Subtle Accent Icon */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-sans">
              {stat.metric}
            </span>
            {isDemo && (
              <span
                className="text-[10px] font-mono text-slate-400 border border-slate-700/80 px-1.5 py-0.2 rounded"
                title="Illustrative reference parameter"
              >
                Ref
              </span>
            )}
          </div>

          <div
            className={`w-8 h-8 rounded-md flex items-center justify-center border shrink-0 transition-transform ${getIconContainerStyle()}`}
          >
            {renderIcon()}
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-100 mb-1">
          {stat.label}
        </h3>

        <p className="text-xs text-slate-300/80 leading-relaxed">
          {stat.supportingText}
        </p>
      </div>

      {stat.note && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-soft-pulse" />
          <span className="truncate">{stat.note}</span>
        </div>
      )}
    </div>
  );
};
