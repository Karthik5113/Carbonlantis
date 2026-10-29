import React, { useState } from 'react';
import {
  Ship,
  Radio,
  Search,
  Filter,
  BatteryCharging,
  Sun,
  Wifi,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { OperationalAsset } from '../../types';

interface AssetDeploymentsTableProps {
  assets: OperationalAsset[];
  onSelectAsset?: (asset: OperationalAsset) => void;
}

export const AssetDeploymentsTable: React.FC<AssetDeploymentsTableProps> = ({
  assets,
  onSelectAsset
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const filteredAssets = assets.filter((asset) => {
    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'mobile' && asset.type === 'mobile-dosing') ||
      (filterType === 'station' && asset.type === 'mrv-station');

    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.catchment.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active</span>
          </span>
        );
      case 'Calibrating':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
            <span>Calibrating</span>
          </span>
        );
      case 'Standby':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <span>Standby</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-carbon-border shadow-card overflow-hidden flex flex-col">
      {/* Header with Title and Search/Filters */}
      <div className="p-4 sm:p-5 border-b border-carbon-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-base font-semibold text-carbon-text">
              Asset Deployments & Fleet Status
            </h2>
            <span className="text-[10px] font-mono bg-slate-100 text-carbon-muted px-2 py-0.5 rounded border border-carbon-border">
              {filteredAssets.length} assets
            </span>
          </div>
          <p className="text-xs text-carbon-muted">
            Continuous tracking of mobile dosing vessels, fixed baseline stations & mixing sondes
          </p>
        </div>

        {/* Filter Buttons & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter Buttons */}
          <div className="flex items-center bg-slate-50 border border-carbon-border p-0.5 rounded-md text-xs">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-carbon-navy text-white shadow-xs'
                  : 'text-carbon-muted hover:text-carbon-text'
              }`}
            >
              All Assets
            </button>
            <button
              type="button"
              onClick={() => setFilterType('mobile')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                filterType === 'mobile'
                  ? 'bg-carbon-navy text-white shadow-xs'
                  : 'text-carbon-muted hover:text-carbon-text'
              }`}
            >
              <Ship className="w-3 h-3" />
              <span>Dosing Vessels</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterType('station')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
                filterType === 'station'
                  ? 'bg-carbon-navy text-white shadow-xs'
                  : 'text-carbon-muted hover:text-carbon-text'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>MRV Sondes</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search code or reach..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none w-48 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-4">Asset & Identifier</th>
              <th className="py-3 px-3">Type</th>
              <th className="py-3 px-3">Catchment Reach</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3">Power & Solar</th>
              <th className="py-3 px-3">Operations Metric</th>
              <th className="py-3 px-3">Health</th>
              <th className="py-3 px-4 text-right">Last Ping</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssets.map((asset) => {
              const isSelected = selectedAssetId === asset.id;
              return (
                <tr
                  key={asset.id}
                  onClick={() => {
                    setSelectedAssetId(asset.id);
                    if (onSelectAsset) onSelectAsset(asset);
                  }}
                  className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50/70' : ''
                  }`}
                >
                  {/* Asset & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          asset.type === 'mobile-dosing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {asset.type === 'mobile-dosing' ? (
                          <Ship className="w-3.5 h-3.5" />
                        ) : (
                          <Radio className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div>
                        <strong className="block text-slate-900 font-bold leading-tight">
                          {asset.name}
                        </strong>
                        <span className="font-mono text-[10px] text-slate-400">
                          {asset.code} • {asset.firmwareVersion}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3 px-3 font-medium text-slate-600">
                    {asset.type === 'mobile-dosing' ? 'Mobile Dosing' : 'Continuous Sonde'}
                  </td>

                  {/* Catchment */}
                  <td className="py-3 px-3 text-slate-700">
                    <span className="font-medium">{asset.catchment}</span>
                    <span className="block font-mono text-[10px] text-slate-400">
                      {asset.coordinates[0].toFixed(3)}°N, {asset.coordinates[1].toFixed(3)}°E
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    {getStatusBadge(asset.status)}
                  </td>

                  {/* Power & Solar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2 text-slate-600 font-mono text-[11px]">
                      <span className="flex items-center gap-1">
                        <BatteryCharging className="w-3 h-3 text-emerald-600" />
                        <span>{asset.batteryPct}%</span>
                      </span>
                      <span className="flex items-center gap-1 text-amber-600">
                        <Sun className="w-3 h-3" />
                        <span>{asset.solarWatts}W</span>
                      </span>
                    </div>
                  </td>

                  {/* Operations Metric */}
                  <td className="py-3 px-3 font-mono">
                    {asset.type === 'mobile-dosing' ? (
                      <div>
                        <span className="text-blue-700 font-bold">{asset.dosingRateKgHr} kg/hr</span>
                        <span className="block text-[10px] text-slate-400">
                          Slurry: {asset.slurryDensityGPerL} g/L
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-slate-800 font-semibold">{asset.waterDischargeM3s} m³/s</span>
                        <span className="block text-[10px] text-slate-400">Reach flow</span>
                      </div>
                    )}
                  </td>

                  {/* Health Score */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            asset.healthScore >= 95
                              ? 'bg-emerald-500'
                              : asset.healthScore >= 85
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${asset.healthScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-slate-600 font-bold">
                        {asset.healthScore}%
                      </span>
                    </div>
                  </td>

                  {/* Last Ping */}
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-500">
                    <div className="flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{asset.lastPing}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>All 12 active platforms transmitting continuous telemetry via MQTT/TLS 1.3</span>
        </span>
        <span className="font-mono text-slate-400">
          LoRaWAN Gateway Amalapuram Master
        </span>
      </div>
    </div>
  );
};

