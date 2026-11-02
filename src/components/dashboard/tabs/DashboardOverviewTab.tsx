import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Eye,
  MapPin,
  Bell,
  ArrowRight,
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  Radio
} from 'lucide-react';
import { DeploymentSite } from '../../../types';
import { DeploymentMap } from '../../home/DeploymentMap';

type AssetType = 'Mobile Dosing Platform' | 'MRV Station';
type AssetStatus = 'Active' | 'Inactive' | 'Maintenance';

interface Asset {
  id: string;
  name: string;
  assetId: string;
  type: AssetType;
  location: string;
  status: AssetStatus;
  liveData: { ph: number; ec: number; do: number; temp: number };
  lastUpdate: string;
}

const assets: Asset[] = [
  { id: '1', name: 'AquaDrone_MVP_001', assetId: 'ADR-MVP-001', type: 'Mobile Dosing Platform', location: 'Kesinapalli, AP', status: 'Active', liveData: { ph: 8.1, ec: 3120, do: 5.8, temp: 28.4 }, lastUpdate: '16 Oct 2026\n10:24 AM' },
  { id: '2', name: 'AquaNode_ATV_001',  assetId: 'AN-ATV-001',  type: 'MRV Station',           location: 'Andaveli, AP',    status: 'Active', liveData: { ph: 8.0, ec: 2980, do: 6.1, temp: 27.9 }, lastUpdate: '16 Oct 2026\n10:20 AM' },
  { id: '3', name: 'RiverNode_RJY_001', assetId: 'RN-RJY-001',  type: 'MRV Station',           location: 'Rajahmundry, AP', status: 'Active', liveData: { ph: 7.9, ec: 3015, do: 6.3, temp: 28.1 }, lastUpdate: '16 Oct 2026\n10:18 AM' },
  { id: '4', name: 'AquaDrone_DOS_002', assetId: 'ADR-DOS-002', type: 'Mobile Dosing Platform', location: 'Nidamanuru, AP',  status: 'Active', liveData: { ph: 8.3, ec: 3210, do: 5.5, temp: 29.1 }, lastUpdate: '16 Oct 2026\n10:15 AM' },
  { id: '5', name: 'AquaDrone_DWN_003', assetId: 'ADR-DWN-003', type: 'Mobile Dosing Platform', location: 'Dowleswaram, AP', status: 'Maintenance', liveData: { ph: 7.7, ec: 2850, do: 5.1, temp: 27.5 }, lastUpdate: '16 Oct 2026\n09:50 AM' },
];

const assetDeploymentSites: DeploymentSite[] = [
  {
    id: '1',
    name: 'AquaDrone_MVP_001',
    siteCode: 'ADR-MVP-001',
    region: 'Kesinapalli, Andhra Pradesh',
    type: 'mobile-dosing',
    status: 'Active',
    coordinates: [16.5412, 81.9125],
    waterBody: 'Kesinapalli Main Drain Reach',
    lastReading: { ph: 8.1, ec: 3120, do: 5.8, temp: 28.4, timestamp: '10 mins ago' },
    description: 'Autonomous mobile dosing platform operating on configured target alkalinity setpoint.'
  },
  {
    id: '2',
    name: 'AquaNode_ATV_001',
    siteCode: 'AN-ATV-001',
    region: 'Andaveli, Andhra Pradesh',
    type: 'mrv-station',
    status: 'Active',
    coordinates: [16.5621, 81.8942],
    waterBody: 'Andaveli Upstream Reach',
    lastReading: { ph: 8.0, ec: 2980, do: 6.1, temp: 27.9, timestamp: '15 mins ago' },
    description: 'Fixed MRV baseline monitoring station recording background pH and dissolved oxygen.'
  },
  {
    id: '3',
    name: 'RiverNode_RJY_001',
    siteCode: 'RN-RJY-001',
    region: 'Rajahmundry, Andhra Pradesh',
    type: 'mrv-station',
    status: 'Active',
    coordinates: [17.0005, 81.8040],
    waterBody: 'Godavari River Mainstem',
    lastReading: { ph: 7.9, ec: 3015, do: 6.3, temp: 28.1, timestamp: '18 mins ago' },
    description: 'Mainstem river telemetry sonde tracking chemical dissolution and dispersion kinetics.'
  },
  {
    id: '4',
    name: 'AquaDrone_DOS_002',
    siteCode: 'ADR-DOS-002',
    region: 'Nidamanuru, Andhra Pradesh',
    type: 'mobile-dosing',
    status: 'Active',
    coordinates: [16.5184, 81.9318],
    waterBody: 'Nidamanuru Irrigation Canal',
    lastReading: { ph: 8.3, ec: 3210, do: 5.5, temp: 29.1, timestamp: '20 mins ago' },
    description: 'Mobile dosing unit with integrated slurry dispersal and automated telemetry.'
  },
  {
    id: '5',
    name: 'AquaDrone_DWN_003',
    siteCode: 'ADR-DWN-003',
    region: 'Dowleswaram, Andhra Pradesh',
    type: 'mobile-dosing',
    status: 'Maintenance',
    coordinates: [16.9380, 81.7725],
    waterBody: 'Dowleswaram Barrage Reach',
    lastReading: { ph: 7.7, ec: 2850, do: 5.1, temp: 27.5, timestamp: '45 mins ago' },
    description: 'Downstream mobile platform undergoing scheduled maintenance and optical sonde recalibration.'
  }
];

export interface NotificationRecord {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: 'warning' | 'info' | 'healthy' | 'critical';
  category: 'pH' | 'Turbidity' | 'Data Sync' | 'System' | 'Pump' | 'Battery';
  stationName: string;
}

const allNotifications: NotificationRecord[] = [
  {
    id: 'alt-1',
    title: 'High pH Alert',
    description: 'Dosing station pH at 8.38 approaching configured threshold ceiling (8.50 pH). Automated slurry feed rate throttled.',
    timestamp: '12 mins ago',
    severity: 'warning',
    category: 'pH',
    stationName: 'ADR-MVP-001'
  },
  {
    id: 'alt-2',
    title: 'Turbidity Warning',
    description: 'Increased turbidity (14.2 NTU) detected following upstream precipitation event. Sonde optical wiper cycle initiated.',
    timestamp: '45 mins ago',
    severity: 'warning',
    category: 'Turbidity',
    stationName: 'AN-ATV-001'
  },
  {
    id: 'alt-3',
    title: 'Data Sync Completed',
    description: 'Telemetry batch verified: 3,420 multi-parameter records ingested from Godavari Delta nodes without packet loss.',
    timestamp: '1 hour ago',
    severity: 'info',
    category: 'Data Sync',
    stationName: 'Gateway-Delta-01'
  },
  {
    id: 'alt-4',
    title: 'System Healthy',
    description: 'All optical dissolved oxygen and glass pH sensors reporting within ±0.01 calibration limits across all reaches.',
    timestamp: '3 hours ago',
    severity: 'healthy',
    category: 'System',
    stationName: 'Fleet Wide'
  },
  {
    id: 'alt-5',
    title: 'Pump Status: Cycle Concluded',
    description: 'Dosing cycle #248 completed successfully: 180 kg mineral feed injected at target alkalinity dosing velocity.',
    timestamp: '5 hours ago',
    severity: 'info',
    category: 'Pump',
    stationName: 'ADR-DOS-002'
  },
  {
    id: 'alt-6',
    title: 'Maintenance Mode Active',
    description: 'ADR-DWN-003 entered routine maintenance mode for peristaltic pump tube inspection and probe washing.',
    timestamp: '16 Oct 2026, 09:50 AM',
    severity: 'warning',
    category: 'System',
    stationName: 'ADR-DWN-003'
  },
  {
    id: 'alt-7',
    title: 'Auto-Calibration Verification Pass',
    description: 'Two-point pH buffer calibration (pH 7.00 & 10.01) completed on Rajahmundry station with 99.4% slope integrity.',
    timestamp: '16 Oct 2026, 08:30 AM',
    severity: 'healthy',
    category: 'System',
    stationName: 'RN-RJY-001'
  },
  {
    id: 'alt-8',
    title: 'Alkalinity Dosing Target Achieved',
    description: 'Net total alkalinity enhancement reached +48 µmol/kg target threshold across Kesinapalli mixing transect.',
    timestamp: '16 Oct 2026, 07:15 AM',
    severity: 'healthy',
    category: 'Pump',
    stationName: 'ADR-MVP-001'
  },
  {
    id: 'alt-9',
    title: 'Battery Solar Float Charge Normal',
    description: 'Photovoltaic generation nominal (240W), battery bank reached 98% state of charge with active power conditioning.',
    timestamp: '16 Oct 2026, 06:40 AM',
    severity: 'info',
    category: 'Battery',
    stationName: 'ADR-DOS-002'
  },
  {
    id: 'alt-10',
    title: 'Firmware Telemetry Link Synchronized',
    description: 'Edge node firmware v2.4.1 heartbeat confirmed over 4G LTE fallback mesh network.',
    timestamp: '15 Oct 2026, 11:10 PM',
    severity: 'info',
    category: 'Data Sync',
    stationName: 'Gateway-Delta-01'
  }
];

const TYPE_OPTIONS     = ['All Types', 'Mobile Dosing Platform', 'MRV Station'];
const STATUS_OPTIONS   = ['All Status', 'Active', 'Inactive', 'Maintenance'];
const LOCATION_OPTIONS = ['All Locations', 'Kesinapalli, AP', 'Andaveli, AP', 'Rajahmundry, AP', 'Nidamanuru, AP', 'Dowleswaram, AP'];

export const DashboardOverviewTab: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch]                 = useState('');
  const [typeFilter, setTypeFilter]         = useState('All Types');
  const [statusFilter, setStatusFilter]     = useState('All Status');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  // Modal state for full notification history card
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [modalFilter, setModalFilter]                     = useState<'all' | 'warning' | 'healthy' | 'info'>('all');

  const filtered = assets.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch   = !q || a.name.toLowerCase().includes(q) || a.assetId.toLowerCase().includes(q) || a.location.toLowerCase().includes(q);
    const matchType     = typeFilter     === 'All Types'     || a.type     === typeFilter;
    const matchStatus   = statusFilter   === 'All Status'    || a.status   === statusFilter;
    const matchLocation = locationFilter === 'All Locations' || a.location === locationFilter;
    return matchSearch && matchType && matchStatus && matchLocation;
  });

  // Only the last 5 alerts shown in the inline card
  const recentAlerts = allNotifications.slice(0, 5);

  // Filtered list for the modal card
  const modalAlerts = allNotifications.filter((item) => {
    if (modalFilter === 'all') return true;
    if (modalFilter === 'warning') return item.severity === 'warning' || item.severity === 'critical';
    if (modalFilter === 'healthy') return item.severity === 'healthy';
    if (modalFilter === 'info') return item.severity === 'info';
    return true;
  });

  // Redirect to Monitoring tab with selected asset
  const handleViewAssetInMonitoring = (assetName: string) => {
    navigate(`/dashboard?tab=monitoring&asset=${encodeURIComponent(assetName)}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER BAR: Title & Notification Icon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Assets</h2>
        </div>

        {/* Top Notification Icon Button */}
        <button
          type="button"
          onClick={() => setShowNotificationModal(true)}
          className="relative inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer group self-start sm:self-auto"
          title="Open Notifications & System Alerts History"
        >
          <div className="relative">
            <Bell className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <span>Notifications</span>
          <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
            {allNotifications.length}
          </span>
        </button>
      </div>

      {/* 2. FIRST HALF: ASSETS TABLE (Shows ~3 rows by default, scroll to view remaining 2, No arrow marks, Only Eye icon) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search & Filter Row */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search assets (name, ID, location)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 focus:bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-400 text-slate-800 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[{ value: typeFilter,     setter: setTypeFilter,     options: TYPE_OPTIONS },
              { value: statusFilter,   setter: setStatusFilter,   options: STATUS_OPTIONS },
              { value: locationFilter, setter: setLocationFilter, options: LOCATION_OPTIONS }
            ].map(({ value, setter, options }) => (
              <div key={options[0]} className="relative">
                <select
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="appearance-none bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-2 pr-7 text-xs font-medium text-slate-700 outline-none cursor-pointer transition-colors"
                >
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Table: By default shows all 5 assets, and if extra assets are added the rows will be scrollable */}
        <div className="overflow-x-auto max-h-[350px] overflow-y-auto divide-y divide-slate-100">
          <table className="w-full text-xs sm:text-sm border-collapse">
            <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-200 shadow-2xs">
              <tr>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider w-10">#</th>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Name / ID</th>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Location (AP)</th>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Live Data</th>
                <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Update</th>
                <th className="text-center px-4 py-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-xs text-slate-400">
                    No assets match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((asset, idx) => (
                  <tr key={asset.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-400 font-mono font-medium">{idx + 1}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Radio className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-900">{asset.name}</div>
                          <div className="text-[10.5px] text-slate-400 font-mono">{asset.assetId}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                        asset.type === 'Mobile Dosing Platform'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {asset.type}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{asset.location}</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        asset.status === 'Active'      ? 'bg-emerald-50 text-emerald-700' :
                        asset.status === 'Maintenance' ? 'bg-amber-50 text-amber-700'    :
                                                         'bg-slate-100 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          asset.status === 'Active'      ? 'bg-emerald-500' :
                          asset.status === 'Maintenance' ? 'bg-amber-500'   : 'bg-slate-400'
                        }`} />
                        {asset.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-xs text-slate-700 font-mono leading-tight">
                        <div>pH {asset.liveData.ph} | EC {asset.liveData.ec}</div>
                        <div className="text-[11px] text-slate-500">DO {asset.liveData.do} | Temp {asset.liveData.temp}°C</div>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-[11px] text-slate-600 font-mono leading-tight">
                        {asset.lastUpdate.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                      </div>
                    </td>

                    {/* ONLY EYE ICON UNDER ACTIONS */}
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleViewAssetInMonitoring(asset.name)}
                        title={`View ${asset.name} graphs & location in Monitoring`}
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all cursor-pointer shadow-2xs group"
                      >
                        <Eye className="w-4 h-4 text-slate-500 group-hover:text-blue-600 group-hover:scale-110 transition-all" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} Assets</span>
        </div>
      </div>

      {/* 3. SECOND HALF: MAPS SECTION (On below of the table) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Asset Locations
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              5 Assets Plotted
            </span>
            <span className="text-xs text-slate-400 font-mono hidden md:inline">
              Delta Catchment, AP
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <DeploymentMap
            deployments={assetDeploymentSites}
            fitBounds={true}
            height="h-[380px] sm:h-[420px]"
          >
            {/* Translucent Legend Card inside Map at Bottom Right */}
            <div className="absolute bottom-3 right-3 z-20 bg-white/75 backdrop-blur-md border border-slate-200/70 rounded-lg p-2.5 shadow-sm text-xs pointer-events-auto">
              <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Legend
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#123B5D]/90 text-white flex items-center justify-center text-[9px] font-bold shrink-0 shadow-2xs">
                    MDP
                  </span>
                  <span className="text-[11px] font-medium text-slate-800 whitespace-nowrap">
                    Mobile Dosing Platform (3)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-[#059669]/90 text-white flex items-center justify-center text-[9px] font-bold shrink-0 shadow-2xs">
                    MRV
                  </span>
                  <span className="text-[11px] font-medium text-slate-800 whitespace-nowrap">
                    MRV Sonde Station (2)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 flex items-center justify-center shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-800 whitespace-nowrap">
                    Active Pulse Stream
                  </span>
                </div>
              </div>
            </div>
          </DeploymentMap>
        </div>
      </div>

      {/* 4. ALERTS & NOTIFICATIONS SECTION (On below of map, shows only last 5 alerts + View All button) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Alerts & Notifications
              </h3>
            </div>
          </div>

          {/* View All Button on Header */}
          <button
            type="button"
            onClick={() => setShowNotificationModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer self-start sm:self-auto group"
          >
            <span>View All ({allNotifications.length})</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 5 Alerts List */}
        <div className="p-4 sm:p-5 divide-y divide-slate-100">
          {recentAlerts.map((alert) => {
            const isWarning = alert.severity === 'warning' || alert.severity === 'critical';
            const isHealthy = alert.severity === 'healthy';

            return (
              <div
                key={alert.id}
                className="py-3 first:pt-0 last:pb-0 flex items-start gap-3 hover:bg-slate-50/60 p-2 rounded-lg transition-colors"
              >
                {/* Severity Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isWarning ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                  isHealthy ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                              'bg-blue-50 text-blue-600 border border-blue-200'
                }`}>
                  {isWarning ? <AlertTriangle className="w-4 h-4" /> :
                   isHealthy ? <CheckCircle2 className="w-4 h-4" /> :
                               <Info className="w-4 h-4" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900">{alert.title}</span>
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {alert.stationName}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        isWarning ? 'bg-amber-100 text-amber-800' :
                        isHealthy ? 'bg-emerald-100 text-emerald-800' :
                                    'bg-blue-100 text-blue-800'
                      }`}>
                        {alert.category}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-mono shrink-0">
                      {alert.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Footer with View All Trigger */}
        <div className="px-4 sm:px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Showing <strong className="text-slate-800 font-semibold">5</strong> of <strong className="text-slate-800 font-semibold">{allNotifications.length}</strong> total notifications in log
          </span>

          <button
            type="button"
            onClick={() => setShowNotificationModal(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            <span>Open Full Notification History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. MODAL CARD: Show All Notifications History */}
      {showNotificationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 sm:p-6"
          onClick={() => setShowNotificationModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Notification History & System Log
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                      {allNotifications.length} Total
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Complete telemetry alarms, threshold crossings, and calibration events
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNotificationModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close notification history"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Filter Tabs */}
            <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
              {[
                { id: 'all',     label: `All (${allNotifications.length})` },
                { id: 'warning', label: `Warnings (${allNotifications.filter(n => n.severity === 'warning').length})` },
                { id: 'healthy', label: `Nominal (${allNotifications.filter(n => n.severity === 'healthy').length})` },
                { id: 'info',    label: `Telemetry (${allNotifications.filter(n => n.severity === 'info').length})` },
              ].map((tab) => {
                const isSelected = modalFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setModalFilter(tab.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Scrollable Notifications List */}
            <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100">
              {modalAlerts.length === 0 ? (
                <div className="text-center py-12 text-sm text-slate-400">
                  No notifications match the selected category.
                </div>
              ) : (
                modalAlerts.map((alert) => {
                  const isWarning = alert.severity === 'warning' || alert.severity === 'critical';
                  const isHealthy = alert.severity === 'healthy';

                  return (
                    <div
                      key={alert.id}
                      className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 hover:bg-slate-50/70 p-2 rounded-lg transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isWarning ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                        isHealthy ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                    'bg-blue-50 text-blue-600 border border-blue-200'
                      }`}>
                        {isWarning ? <AlertTriangle className="w-4 h-4" /> :
                         isHealthy ? <CheckCircle2 className="w-4 h-4" /> :
                                     <Info className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-900">{alert.title}</span>
                            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {alert.stationName}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                              isWarning ? 'bg-amber-100 text-amber-800' :
                              isHealthy ? 'bg-emerald-100 text-emerald-800' :
                                          'bg-blue-100 text-blue-800'
                            }`}>
                              {alert.category}
                            </span>
                          </div>

                          <span className="text-xs text-slate-400 font-mono shrink-0">
                            {alert.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Audit stream verified with active edge ingest
              </span>
              <button
                type="button"
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
