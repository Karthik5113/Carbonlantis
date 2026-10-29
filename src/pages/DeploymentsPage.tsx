import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import { publicHomeData } from '../data/publicHome';
import { DeploymentMap } from '../components/home/DeploymentMap';
import { MapLegend } from '../components/home/MapLegend';

export const DeploymentsPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filtered = publicHomeData.deployments.filter((site) => {
    if (selectedFilter === 'all') return true;
    return site.type === selectedFilter;
  });

  return (
    <div className="flex-1 bg-carbon-bg py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-carbon-muted hover:text-carbon-navy transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Home</span>
          </Link>

          <span className="text-xs bg-white text-carbon-muted px-2.5 py-0.5 rounded border border-carbon-border font-mono">
            Catchment: Godavari Delta Reach
          </span>
        </div>

        {/* Page Header: 28-32px semibold */}
        <div className="bg-white rounded-lg border border-carbon-border p-6 sm:p-8 shadow-card mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-carbon-text mb-2">
            Deployment Sites & Monitoring Nodes Register
          </h1>
          <p className="text-xs sm:text-sm text-carbon-muted leading-relaxed max-w-2xl">
            Official public register of active inland water alkalinity enhancement pilot deployments, mobile dosing platforms, and continuous baseline MRV stations.
          </p>
        </div>

        {/* Top: Interactive Basin Map Card */}
        <div className="bg-white rounded-lg border border-carbon-border p-5 shadow-card mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-carbon-border">
            <div>
              <h2 className="text-base font-semibold text-carbon-text">
                Spatial Reach Telemetry Map
              </h2>
              <p className="text-xs text-carbon-muted">
                Select station markers to inspect real-time sensor parameters and node coordinates
              </p>
            </div>
            <MapLegend
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </div>

          <DeploymentMap
            deployments={publicHomeData.deployments}
            selectedFilter={selectedFilter}
            height="h-[400px] sm:h-[460px]"
          />
        </div>

        {/* Section Heading */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-carbon-text">
            Site Roster ({filtered.length})
          </h2>
          <p className="text-xs text-carbon-muted">
            Detailed equipment parameters and latest sonde readings
          </p>
        </div>

        {/* Bottom: Site Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((site) => (
            <div
              key={site.id}
              className="bg-white rounded-lg border border-carbon-border p-5 shadow-card interactive-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-carbon-muted uppercase">
                      {site.siteCode}
                    </span>
                    <h3 className="text-base font-semibold text-carbon-text mt-0.5">
                      {site.name}
                    </h3>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                      site.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {site.status}
                  </span>
                </div>

                <div className="text-xs text-carbon-muted mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{site.region} ({site.waterBody})</span>
                </div>

                <p className="text-xs text-carbon-muted leading-relaxed mb-4">
                  {site.description}
                </p>
              </div>

              {site.lastReading ? (
                <div className="bg-slate-50 border border-carbon-border rounded-md p-3 grid grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">pH</span>
                    <strong className="text-carbon-navy text-sm font-semibold">{site.lastReading.ph}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">DO (mg/L)</span>
                    <strong className="text-carbon-text text-sm font-semibold">{site.lastReading.do}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Temp (°C)</span>
                    <strong className="text-carbon-text text-sm font-semibold">{site.lastReading.temp}</strong>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-carbon-border rounded-md p-3 text-xs text-carbon-muted font-mono">
                  Site in planned engineering phase. Sensor telemetry will initialize upon vessel commissioning.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
