import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { DeploymentSite } from '../../types';
import { DeploymentMap } from './DeploymentMap';
import { MapLegend } from './MapLegend';

interface DeploymentMapCardProps {
  deployments: DeploymentSite[];
  isDemo?: boolean;
}

export const DeploymentMapCard: React.FC<DeploymentMapCardProps> = ({
  deployments,
  isDemo = true,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  return (
    <div className="bg-white rounded-lg border border-carbon-border shadow-card interactive-card p-5 sm:p-6 flex flex-col justify-between h-full">
      <div>
        {/* Card Header: 15-18px semibold */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-carbon-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-carbon-navy/10 text-carbon-navy flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-carbon-text">
                Deployment Basin Map
              </h2>
              <p className="text-xs text-carbon-muted">
                Spatial telemetry for mobile dosing platforms & baseline sondes
              </p>
            </div>
          </div>

          <Link
            to="/deployments"
            className="group inline-flex items-center gap-1 text-xs font-medium text-carbon-navy hover:text-[#1A4E78] transition-colors self-start sm:self-auto"
          >
            <span>Full Register</span>
            <ArrowRight className="w-3.5 h-3.5 text-carbon-navy group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Map Container */}
        <div className="mb-3">
          <DeploymentMap
            deployments={deployments}
            selectedFilter={selectedFilter}
            height="h-[340px] sm:h-[370px]"
          />
        </div>

        {/* Legend and Filter Controls */}
        <div className="mt-2">
          <MapLegend
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />
        </div>
      </div>

      {/* Footer Info Notice with Live Heartbeat */}
      <div className="mt-4 pt-3 border-t border-carbon-border flex items-center justify-between text-xs text-carbon-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-soft-pulse" />
          <span>Active Basin: <strong className="text-carbon-text font-medium">Kesinapalli Reach</strong></span>
        </span>
        <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>{isDemo ? 'Reference Catchment' : 'Live Feeds'}</span>
        </span>
      </div>
    </div>
  );
};
