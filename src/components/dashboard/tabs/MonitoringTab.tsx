import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Waves,
  Calendar,
  ChevronDown,
  Download,
  AlertTriangle,
  Info,
  CheckCircle2,
  Droplets,
  Wind,
  Thermometer,
  Zap,
  Activity,
  Layers,
  MapPin,
  SlidersHorizontal,
  X,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Clock
} from 'lucide-react';
import { MonitoringAssetMap } from './MonitoringAssetMap';

interface AssetProfileData {
  name: string;
  assetId: string;
  type: string;
  location: string;
  baseEc: number;
  baseTurbidity: number;
  timeseries: { hour: string; ph: number; pco2: number; do: number; temp: number }[];
}

const ASSET_TELEMETRY_MAP: Record<string, AssetProfileData> = {
  'AquaDrone_MVP_001': {
    name: 'AquaDrone_MVP_001',
    assetId: 'ADR-MVP-001',
    type: 'Mobile Dosing Platform',
    location: 'Kesinapalli, AP',
    baseEc: 3120,
    baseTurbidity: 8.4,
    timeseries: [
      { hour: '00:00', ph: 7.5, pco2: 2450, do: 4.5, temp: 2.1 },
      { hour: '01:00', ph: 7.7, pco2: 2460, do: 4.6, temp: 2.1 },
      { hour: '02:00', ph: 8.0, pco2: 2480, do: 4.8, temp: 2.1 },
      { hour: '03:00', ph: 8.2, pco2: 2470, do: 5.2, temp: 2.2 },
      { hour: '04:00', ph: 8.5, pco2: 2500, do: 5.4, temp: 2.2 },
      { hour: '05:00', ph: 8.8, pco2: 2520, do: 5.6, temp: 2.2 },
      { hour: '06:00', ph: 7.9, pco2: 2500, do: 4.6, temp: 2.2 },
      { hour: '07:00', ph: 8.0, pco2: 2600, do: 4.4, temp: 2.3 },
      { hour: '08:00', ph: 9.1, pco2: 2950, do: 4.1, temp: 2.3 },
      { hour: '09:00', ph: 9.8, pco2: 2700, do: 4.3, temp: 2.3 },
      { hour: '10:00', ph: 10.3, pco2: 2300, do: 5.1, temp: 2.3 },
      { hour: '11:00', ph: 9.7, pco2: 2150, do: 4.5, temp: 2.3 },
      { hour: '12:00', ph: 8.4, pco2: 1980, do: 4.1, temp: 2.2 },
      { hour: '13:00', ph: 8.2, pco2: 2020, do: 4.1, temp: 2.2 },
      { hour: '14:00', ph: 8.2, pco2: 2050, do: 4.1, temp: 2.2 },
      { hour: '15:00', ph: 8.6, pco2: 2100, do: 3.9, temp: 2.2 },
      { hour: '16:00', ph: 10.2, pco2: 2450, do: 4.3, temp: 2.3 },
      { hour: '17:00', ph: 11.1, pco2: 3000, do: 4.7, temp: 2.5 },
      { hour: '18:00', ph: 10.9, pco2: 2900, do: 5.2, temp: 2.8 },
      { hour: '19:00', ph: 10.1, pco2: 2450, do: 5.3, temp: 2.8 },
      { hour: '20:00', ph: 9.3, pco2: 2800, do: 4.9, temp: 2.7 },
      { hour: '21:00', ph: 9.4, pco2: 2750, do: 5.1, temp: 2.7 },
      { hour: '22:00', ph: 9.5, pco2: 2650, do: 5.0, temp: 2.6 },
    ]
  },
  'AquaNode_ATV_001': {
    name: 'AquaNode_ATV_001',
    assetId: 'AN-ATV-001',
    type: 'MRV Station',
    location: 'Andaveli, AP',
    baseEc: 2980,
    baseTurbidity: 6.1,
    timeseries: [
      { hour: '00:00', ph: 7.9, pco2: 2320, do: 5.9, temp: 1.7 },
      { hour: '01:00', ph: 7.9, pco2: 2340, do: 5.9, temp: 1.7 },
      { hour: '02:00', ph: 7.8, pco2: 2350, do: 5.8, temp: 1.7 },
      { hour: '03:00', ph: 7.8, pco2: 2360, do: 5.8, temp: 1.8 },
      { hour: '04:00', ph: 7.8, pco2: 2380, do: 5.7, temp: 1.8 },
      { hour: '05:00', ph: 7.9, pco2: 2370, do: 5.8, temp: 1.8 },
      { hour: '06:00', ph: 7.9, pco2: 2350, do: 5.9, temp: 1.8 },
      { hour: '07:00', ph: 8.0, pco2: 2310, do: 6.0, temp: 1.9 },
      { hour: '08:00', ph: 8.0, pco2: 2280, do: 6.1, temp: 1.9 },
      { hour: '09:00', ph: 8.1, pco2: 2250, do: 6.2, temp: 1.9 },
      { hour: '10:00', ph: 8.0, pco2: 2260, do: 6.1, temp: 1.9 },
      { hour: '11:00', ph: 8.1, pco2: 2240, do: 6.2, temp: 2.0 },
      { hour: '12:00', ph: 8.1, pco2: 2220, do: 6.3, temp: 2.0 },
      { hour: '13:00', ph: 8.2, pco2: 2200, do: 6.3, temp: 2.0 },
      { hour: '14:00', ph: 8.1, pco2: 2210, do: 6.2, temp: 2.0 },
      { hour: '15:00', ph: 8.0, pco2: 2230, do: 6.1, temp: 2.0 },
      { hour: '16:00', ph: 8.0, pco2: 2250, do: 6.1, temp: 1.9 },
      { hour: '17:00', ph: 8.0, pco2: 2270, do: 6.0, temp: 1.9 },
      { hour: '18:00', ph: 7.9, pco2: 2290, do: 5.9, temp: 1.8 },
      { hour: '19:00', ph: 7.9, pco2: 2310, do: 5.9, temp: 1.8 },
      { hour: '20:00', ph: 7.9, pco2: 2320, do: 5.9, temp: 1.8 },
      { hour: '21:00', ph: 7.9, pco2: 2330, do: 5.8, temp: 1.7 },
      { hour: '22:00', ph: 7.8, pco2: 2340, do: 5.8, temp: 1.7 },
    ]
  },
  'RiverNode_RJY_001': {
    name: 'RiverNode_RJY_001',
    assetId: 'RN-RJY-001',
    type: 'MRV Station',
    location: 'Rajahmundry, AP',
    baseEc: 3015,
    baseTurbidity: 6.3,
    timeseries: [
      { hour: '00:00', ph: 7.8, pco2: 2210, do: 6.2, temp: 1.9 },
      { hour: '01:00', ph: 7.8, pco2: 2220, do: 6.2, temp: 1.9 },
      { hour: '02:00', ph: 7.8, pco2: 2230, do: 6.2, temp: 1.9 },
      { hour: '03:00', ph: 7.8, pco2: 2240, do: 6.1, temp: 1.9 },
      { hour: '04:00', ph: 7.8, pco2: 2250, do: 6.1, temp: 1.9 },
      { hour: '05:00', ph: 7.8, pco2: 2240, do: 6.2, temp: 2.0 },
      { hour: '06:00', ph: 7.9, pco2: 2220, do: 6.3, temp: 2.0 },
      { hour: '07:00', ph: 7.9, pco2: 2190, do: 6.4, temp: 2.0 },
      { hour: '08:00', ph: 7.9, pco2: 2170, do: 6.4, temp: 2.1 },
      { hour: '09:00', ph: 8.0, pco2: 2150, do: 6.5, temp: 2.1 },
      { hour: '10:00', ph: 7.9, pco2: 2160, do: 6.3, temp: 2.1 },
      { hour: '11:00', ph: 8.0, pco2: 2140, do: 6.4, temp: 2.2 },
      { hour: '12:00', ph: 8.0, pco2: 2120, do: 6.5, temp: 2.2 },
      { hour: '13:00', ph: 8.0, pco2: 2110, do: 6.5, temp: 2.2 },
      { hour: '14:00', ph: 8.0, pco2: 2130, do: 6.4, temp: 2.2 },
      { hour: '15:00', ph: 7.9, pco2: 2150, do: 6.3, temp: 2.1 },
      { hour: '16:00', ph: 7.9, pco2: 2170, do: 6.3, temp: 2.1 },
      { hour: '17:00', ph: 7.9, pco2: 2180, do: 6.2, temp: 2.0 },
      { hour: '18:00', ph: 7.9, pco2: 2190, do: 6.2, temp: 2.0 },
      { hour: '19:00', ph: 7.8, pco2: 2200, do: 6.2, temp: 1.9 },
      { hour: '20:00', ph: 7.8, pco2: 2210, do: 6.2, temp: 1.9 },
      { hour: '21:00', ph: 7.8, pco2: 2220, do: 6.2, temp: 1.9 },
      { hour: '22:00', ph: 7.8, pco2: 2220, do: 6.2, temp: 1.9 },
    ]
  },
  'AquaDrone_DOS_002': {
    name: 'AquaDrone_DOS_002',
    assetId: 'ADR-DOS-002',
    type: 'Mobile Dosing Platform',
    location: 'Nidamanuru, AP',
    baseEc: 3210,
    baseTurbidity: 5.5,
    timeseries: [
      { hour: '00:00', ph: 7.6, pco2: 2550, do: 4.8, temp: 2.8 },
      { hour: '01:00', ph: 7.7, pco2: 2540, do: 4.8, temp: 2.8 },
      { hour: '02:00', ph: 7.8, pco2: 2520, do: 5.0, temp: 2.8 },
      { hour: '03:00', ph: 7.9, pco2: 2510, do: 5.1, temp: 2.9 },
      { hour: '04:00', ph: 8.0, pco2: 2500, do: 5.2, temp: 2.9 },
      { hour: '05:00', ph: 8.1, pco2: 2490, do: 5.3, temp: 2.9 },
      { hour: '06:00', ph: 8.0, pco2: 2520, do: 5.2, temp: 2.9 },
      { hour: '07:00', ph: 8.2, pco2: 2580, do: 5.1, temp: 3.0 },
      { hour: '08:00', ph: 8.8, pco2: 2750, do: 4.9, temp: 3.1 },
      { hour: '09:00', ph: 9.3, pco2: 2880, do: 4.8, temp: 3.1 },
      { hour: '10:00', ph: 8.3, pco2: 2600, do: 5.5, temp: 3.1 },
      { hour: '11:00', ph: 8.9, pco2: 2700, do: 5.2, temp: 3.0 },
      { hour: '12:00', ph: 8.3, pco2: 2520, do: 5.4, temp: 3.0 },
      { hour: '13:00', ph: 8.1, pco2: 2480, do: 5.5, temp: 2.9 },
      { hour: '14:00', ph: 8.0, pco2: 2460, do: 5.6, temp: 2.9 },
      { hour: '15:00', ph: 8.3, pco2: 2540, do: 5.3, temp: 2.9 },
      { hour: '16:00', ph: 8.7, pco2: 2680, do: 5.0, temp: 3.0 },
      { hour: '17:00', ph: 8.9, pco2: 2720, do: 4.9, temp: 3.0 },
      { hour: '18:00', ph: 8.5, pco2: 2600, do: 5.2, temp: 2.9 },
      { hour: '19:00', ph: 8.2, pco2: 2540, do: 5.4, temp: 2.8 },
      { hour: '20:00', ph: 8.0, pco2: 2510, do: 5.5, temp: 2.8 },
      { hour: '21:00', ph: 7.9, pco2: 2500, do: 5.5, temp: 2.8 },
      { hour: '22:00', ph: 7.8, pco2: 2520, do: 5.4, temp: 2.8 },
    ]
  },
  'AquaDrone_DWN_003': {
    name: 'AquaDrone_DWN_003',
    assetId: 'ADR-DWN-003',
    type: 'Mobile Dosing Platform (Maintenance)',
    location: 'Dowleswaram, AP',
    baseEc: 2850,
    baseTurbidity: 5.1,
    timeseries: [
      { hour: '00:00', ph: 7.6, pco2: 2420, do: 5.0, temp: 1.5 },
      { hour: '01:00', ph: 7.6, pco2: 2420, do: 5.0, temp: 1.5 },
      { hour: '02:00', ph: 7.6, pco2: 2430, do: 5.0, temp: 1.5 },
      { hour: '03:00', ph: 7.6, pco2: 2430, do: 4.9, temp: 1.5 },
      { hour: '04:00', ph: 7.7, pco2: 2410, do: 5.0, temp: 1.5 },
      { hour: '05:00', ph: 7.7, pco2: 2400, do: 5.0, temp: 1.5 },
      { hour: '06:00', ph: 7.7, pco2: 2400, do: 5.1, temp: 1.5 },
      { hour: '07:00', ph: 7.7, pco2: 2390, do: 5.1, temp: 1.5 },
      { hour: '08:00', ph: 7.7, pco2: 2390, do: 5.1, temp: 1.5 },
      { hour: '09:00', ph: 7.7, pco2: 2380, do: 5.1, temp: 1.5 },
      { hour: '10:00', ph: 7.7, pco2: 2380, do: 5.1, temp: 1.5 },
      { hour: '11:00', ph: 7.7, pco2: 2370, do: 5.2, temp: 1.6 },
      { hour: '12:00', ph: 7.7, pco2: 2370, do: 5.2, temp: 1.6 },
      { hour: '13:00', ph: 7.8, pco2: 2360, do: 5.2, temp: 1.6 },
      { hour: '14:00', ph: 7.7, pco2: 2370, do: 5.2, temp: 1.6 },
      { hour: '15:00', ph: 7.7, pco2: 2380, do: 5.1, temp: 1.5 },
      { hour: '16:00', ph: 7.7, pco2: 2390, do: 5.1, temp: 1.5 },
      { hour: '17:00', ph: 7.7, pco2: 2390, do: 5.1, temp: 1.5 },
      { hour: '18:00', ph: 7.6, pco2: 2400, do: 5.0, temp: 1.5 },
      { hour: '19:00', ph: 7.6, pco2: 2410, do: 5.0, temp: 1.5 },
      { hour: '20:00', ph: 7.6, pco2: 2420, do: 5.0, temp: 1.5 },
      { hour: '21:00', ph: 7.6, pco2: 2420, do: 5.0, temp: 1.5 },
      { hour: '22:00', ph: 7.6, pco2: 2430, do: 4.9, temp: 1.5 },
    ]
  }
};

export interface AssetAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  time: string;
  description: string;
}

export const ASSET_ALERTS_MAP: Record<string, AssetAlert[]> = {
  'AquaDrone_MVP_001': [
    {
      id: 'a1',
      type: 'danger',
      title: 'High pH Alert',
      time: '10:24 AM',
      description: 'pH higher than threshold (8.5)'
    },
    {
      id: 'a2',
      type: 'warning',
      title: 'DO Drop',
      time: '09:15 AM',
      description: 'Dissolved oxygen below threshold (3.0 mg/L)'
    },
    {
      id: 'a3',
      type: 'info',
      title: 'Dosing Cycle Started',
      time: '06:00 AM',
      description: 'Dosing rate: 8.5 L/hr'
    },
    {
      id: 'a4',
      type: 'success',
      title: 'Sensor Calibration',
      time: '05:30 AM',
      description: 'pH sensor calibration completed'
    },
    {
      id: 'a5',
      type: 'info',
      title: 'Waypoint 4 Reach Completed',
      time: '04:15 AM',
      description: 'Autonomous waypoint transit reached along Kesinapalli reach'
    }
  ],
  'AquaNode_ATV_001': [
    {
      id: 'b1',
      type: 'warning',
      title: 'Salinity / EC Spike Detected',
      time: '11:15 AM',
      description: 'EC reached 2,980 µS/cm near tidal brackish interface'
    },
    {
      id: 'b2',
      type: 'info',
      title: 'Upstream Gate Released',
      time: '08:30 AM',
      description: 'Godavari tidal flood gate released upstream freshwater flush'
    },
    {
      id: 'b3',
      type: 'success',
      title: 'Optical DO Sensor Calibrated',
      time: '06:00 AM',
      description: 'Auto-cleaning wiper cycle completed with 99.8% optical transmission'
    },
    {
      id: 'b4',
      type: 'info',
      title: 'Satellite Burst Transmitted',
      time: '05:00 AM',
      description: '24-hour telemetry bundle successfully synced to cloud'
    }
  ],
  'RiverNode_RJY_001': [
    {
      id: 'c1',
      type: 'warning',
      title: 'Elevated River Silt Alert',
      time: '12:30 PM',
      description: 'Turbidity elevated to 6.3 NTU due to barrage sluice adjustment'
    },
    {
      id: 'c2',
      type: 'info',
      title: 'Water Velocity Update',
      time: '09:40 AM',
      description: 'Rajahmundry Barrage discharge increased flow to 1.4 m/s'
    },
    {
      id: 'c3',
      type: 'warning',
      title: 'Solar Auxiliary Switch',
      time: '06:15 AM',
      description: 'Solar irradiance below 150 W/m²; switched to auxiliary battery'
    },
    {
      id: 'c4',
      type: 'success',
      title: 'Baseline Validation Complete',
      time: '05:00 AM',
      description: 'Stationary baseline pH validated at 7.80'
    }
  ],
  'AquaDrone_DOS_002': [
    {
      id: 'd1',
      type: 'danger',
      title: 'High pCO₂ Level Recorded',
      time: '10:45 AM',
      description: 'pCO₂ rose to 2,880 µatm prior to secondary dosing phase'
    },
    {
      id: 'd2',
      type: 'warning',
      title: 'Alkaline Tank at 18%',
      time: '08:20 AM',
      description: 'Dosing chemical inventory reserve reaching refill threshold'
    },
    {
      id: 'd3',
      type: 'info',
      title: 'Dosing Cycle 1 Activated',
      time: '07:00 AM',
      description: 'Dispersion started at 9.2 L/hr along Nidamanuru transect'
    },
    {
      id: 'd4',
      type: 'success',
      title: 'RTK GPS Fix Established',
      time: '06:10 AM',
      description: 'Centimeter-grade RTK positioning locked with 14 satellites'
    }
  ],
  'AquaDrone_DWN_003': [
    {
      id: 'e1',
      type: 'info',
      title: 'Scheduled Maintenance Mode',
      time: '09:30 AM',
      description: 'Docked at Dowleswaram pier for propeller inspection'
    },
    {
      id: 'e2',
      type: 'success',
      title: 'Battery Diagnostics Passed',
      time: '07:15 AM',
      description: 'LiFePO4 cells balanced; state of charge at 98.4%'
    },
    {
      id: 'e3',
      type: 'info',
      title: 'LoRaWAN Relay Synced',
      time: '06:00 AM',
      description: 'Bridge uplink confirmed with RiverNode_RJY'
    },
    {
      id: 'e4',
      type: 'success',
      title: 'Firmware Check Completed',
      time: '04:00 AM',
      description: 'Navigation kernel validated (v2.4.1-patch)'
    }
  ]
};

export const MonitoringTab: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlAsset = searchParams.get('asset');
  const [selectedAsset, setSelectedAsset] = useState<string>(
    urlAsset && ASSET_TELEMETRY_MAP[urlAsset] ? urlAsset : 'AquaDrone_MVP_001'
  );

  useEffect(() => {
    if (urlAsset && ASSET_TELEMETRY_MAP[urlAsset] && urlAsset !== selectedAsset) {
      setSelectedAsset(urlAsset);
    }
  }, [urlAsset]);

  const currentAssetData = ASSET_TELEMETRY_MAP[selectedAsset] || ASSET_TELEMETRY_MAP['AquaDrone_MVP_001'];
  const timeseriesData = currentAssetData.timeseries;
  const [selectedDateIso, setSelectedDateIso] = useState('2026-10-16');
  const [selectedDate, setSelectedDate] = useState('16 Oct 2026');
  const urlMode = searchParams.get('mode');
  const [visualizationMode, setVisualizationMode] = useState<'standard' | 'timeseries'>(
    urlMode === 'standard' ? 'standard' : 'timeseries'
  );
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Available Parameters Toggle (5 parameters)
  const [params, setParams] = useState({
    ph: true,
    pco2: true,
    do: true,
    temperature: true,
    ec: false,
  });
  const [isParamDropdownOpen, setIsParamDropdownOpen] = useState(false);

  // Current Telemetry Reference Time
  const scrubberProgress = 0.466; // ~10:15 am reference time
  const [mapType, setMapType] = useState<'satellite' | 'street'>('satellite');

  // Time format helper: convert ratio (0 to 1) into hh:mm:ss across 00:00 to 22:00
  const formatTimeFromProgress = (ratio: number) => {
    const totalSeconds = Math.round(ratio * 22 * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentTimeString = formatTimeFromProgress(scrubberProgress);

  // Handle Export Trigger (Direct CSV Export)
  const handleExport = () => {
    setExportToast(`Generating CSV export for ${selectedAsset} (${selectedDate})...`);
    setTimeout(() => {
      setExportToast(null);
    }, 2500);
  };

  // Toggle Parameter Visibility
  const toggleParam = (key: keyof typeof params) => {
    setParams((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [showAllAlertsModal, setShowAllAlertsModal] = useState(false);
  const assetAlerts = ASSET_ALERTS_MAP[selectedAsset] || ASSET_ALERTS_MAP['AquaDrone_MVP_001'];

  // Chart Ref for non-passive event listeners & fullscreen toggle
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Chart Dimensions & Coordinate Mapping (Full width chart)
  const chartWidth = 1000;
  const chartHeight = 280;
  const padding = { top: 35, right: 65, bottom: 35, left: 55 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // 22-Hour Telemetry Dataset (Dynamic based on selectedAsset)
  const TOTAL_DAY_SECONDS = 22 * 3600; // 79,200 seconds (00:00 to 22:00)

  // Interactive Zoom Window in seconds [startSec, endSec]
  const [zoomWindow, setZoomWindow] = useState<{ startSec: number; endSec: number }>({
    startSec: 0,
    endSec: TOTAL_DAY_SECONDS,
  });

  const [activeZoomPreset, setActiveZoomPreset] = useState<'24h' | '6h' | '1h' | '15m' | 'full' | 'custom'>('24h');
  const [focusedParam] = useState<'all' | 'ph' | 'pco2' | 'do' | 'temp'>('all');
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartWindow, setDragStartWindow] = useState<{ startSec: number; endSec: number }>({
    startSec: 0,
    endSec: TOTAL_DAY_SECONDS,
  });

  // Crosshair cursor on hover
  const [hoverCursor, setHoverCursor] = useState<{
    active: boolean;
    x: number;
    sec: number;
    telem: { ph: number; pco2: number; do: number; temp: number };
  } | null>(null);

  // Time format helper: returns HH:mm or HH:mm:ss based on depth
  const formatSecondsToClock = (sec: number, includeSeconds: boolean = true) => {
    const sClamped = Math.max(0, Math.min(TOTAL_DAY_SECONDS, Math.round(sec)));
    const h = Math.floor(sClamped / 3600);
    const m = Math.floor((sClamped % 3600) / 60);
    const s = sClamped % 60;
    if (!includeSeconds) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getZoomSpanDescription = () => {
    const span = zoomWindow.endSec - zoomWindow.startSec;
    if (span >= 50000) return '24h View (Normal • Hours)';
    if (span >= 14400) return `${Math.round(span / 3600)}h View (Hourly)`;
    if (span >= 3600) return `${(span / 3600).toFixed(1)}h View (30m Interval)`;
    if (span >= 600) return `${Math.round(span / 60)}m View (Minute Depth)`;
    if (span >= 120) return `${Math.round(span / 60)}m View (30s Depth)`;
    return `${span}s View (Full Depth • Seconds)`;
  };

  // High-fidelity continuous telemetry interpolation at any second
  const getInterpolatedTelemetryAtSecond = (sec: number) => {
    const clampedSec = Math.max(0, Math.min(TOTAL_DAY_SECONDS, sec));
    const hourFloat = clampedSec / 3600;
    const idx0 = Math.floor(hourFloat);
    const idx1 = Math.min(idx0 + 1, timeseriesData.length - 1);
    const u = hourFloat - idx0;
    const smoothU = u * u * (3 - 2 * u);

    const d0 = timeseriesData[idx0];
    const d1 = timeseriesData[idx1];

    let ph = d0.ph + (d1.ph - d0.ph) * smoothU;
    let pco2 = d0.pco2 + (d1.pco2 - d0.pco2) * smoothU;
    let doVal = d0.do + (d1.do - d0.do) * smoothU;
    let temp = 25.0 + (d0.temp + (d1.temp - d0.temp) * smoothU) * 1.3;

    // Realistic in-situ hydrodynamic wavelets for minute and seconds depth:
    const microPhase = clampedSec * 0.12;
    const wave1 = Math.sin(microPhase) * 0.12;
    const wave2 = Math.cos(microPhase * 2.3) * 0.06;

    ph = Math.max(6.8, Math.min(11.2, ph + wave1 + wave2 * 0.5));
    pco2 = Math.round(pco2 - (wave1 * 85 + wave2 * 40));
    doVal = Math.max(3.5, Math.min(6.8, doVal + wave2 * 0.25));
    temp = Math.max(24.5, Math.min(29.5, temp + wave1 * 0.1));

    return { ph, pco2, do: doVal, temp };
  };

  // Dynamic scale functions so variations and dosing peaks are clearly visible and pronounced:
  // pH scale: 6.8 to 11.2 (baseline ~8.0, peak ~10.4)
  const getYPh = (val: number) => padding.top + Math.max(0, Math.min(1, (11.5 - val) / (11.5 - 6.5))) * innerHeight;
  // pCO2 scale: 1,800 to 3,200 µatm (peaks ~3000, drawdown dips to ~1980)
  const getYPco2 = (val: number) => padding.top + Math.max(0, Math.min(1, (3200 - val) / (3200 - 1800))) * innerHeight;
  // DO scale: 3.2 to 6.8 mg/L
  const getYDo = (val: number) => padding.top + Math.max(0, Math.min(1, (6.8 - val) / (6.8 - 3.2))) * innerHeight;
  // Water Temp scale: 24.0°C to 30.0°C
  const getYTemp = (val: number) => padding.top + Math.max(0, Math.min(1, (30.0 - val) / (30.0 - 24.0))) * innerHeight;

  // Generic fallback mapping functions
  const getYLeft = (val: number) => getYPh(val);
  const getYRight = (val: number) => getYPco2(val);

  // Maps seconds to X pixel coordinate based on current zoom window
  const getTimeX = (sec: number) => {
    const span = Math.max(10, zoomWindow.endSec - zoomWindow.startSec);
    const ratio = (sec - zoomWindow.startSec) / span;
    return padding.left + ratio * innerWidth;
  };

  // Maps X pixel coordinate to seconds
  const getSecFromX = (pixelX: number) => {
    const ratio = Math.max(0, Math.min(1, (pixelX - padding.left) / innerWidth));
    const span = zoomWindow.endSec - zoomWindow.startSec;
    return zoomWindow.startSec + ratio * span;
  };

  // Dynamic Ticks Generator (Adapts smoothly from 24h hours to sub-minute seconds)
  const dynamicTicks = useMemo(() => {
    const span = zoomWindow.endSec - zoomWindow.startSec;
    let intervalSec = 4 * 3600; // 4 hours for 24h normal view
    let showSeconds = false;

    if (span > 45000) {
      intervalSec = 4 * 3600; // 4h: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00
    } else if (span > 18000) {
      intervalSec = 3600; // 1h
    } else if (span > 3600) {
      intervalSec = 1800; // 30m
    } else if (span > 1200) {
      intervalSec = 600; // 10m
    } else if (span > 300) {
      intervalSec = 120; // 2m
    } else if (span > 90) {
      intervalSec = 30; // 30s
      showSeconds = true;
    } else {
      intervalSec = 15; // 15s (seconds depth zoom!)
      showSeconds = true;
    }

    const ticks: { sec: number; label: string; x: number; isMajor: boolean }[] = [];
    const firstSec = Math.ceil(zoomWindow.startSec / intervalSec) * intervalSec;

    for (let sec = firstSec; sec <= zoomWindow.endSec; sec += intervalSec) {
      const x = getTimeX(sec);
      if (x >= padding.left - 2 && x <= chartWidth - padding.right + 2) {
        ticks.push({
          sec,
          label: formatSecondsToClock(sec, showSeconds),
          x,
          isMajor: sec % (intervalSec * 2) === 0,
        });
      }
    }
    return ticks;
  }, [zoomWindow]);

  // 120 dense sample points across the visible window for ultra-smooth curves
  const DENSE_SAMPLE_COUNT = 120;
  const denseSampledPoints = useMemo(() => {
    const pts = [];
    const span = zoomWindow.endSec - zoomWindow.startSec;
    for (let i = 0; i < DENSE_SAMPLE_COUNT; i++) {
      const sec = zoomWindow.startSec + (i / (DENSE_SAMPLE_COUNT - 1)) * span;
      const x = padding.left + (i / (DENSE_SAMPLE_COUNT - 1)) * innerWidth;
      const telem = getInterpolatedTelemetryAtSecond(sec);
      pts.push({
        sec,
        x,
        ph: telem.ph,
        pco2: telem.pco2,
        do: telem.do,
        temp: telem.temp,
        yPh: getYPh(telem.ph),
        yPco2: getYPco2(telem.pco2),
        yDo: getYDo(telem.do),
        yTemp: getYTemp(telem.temp),
      });
    }
    return pts;
  }, [zoomWindow, timeseriesData]);

  const densePhPointsStr = denseSampledPoints.map((p) => `${p.x.toFixed(1)},${p.yPh.toFixed(1)}`).join(' ');
  const densePco2PointsStr = denseSampledPoints.map((p) => `${p.x.toFixed(1)},${p.yPco2.toFixed(1)}`).join(' ');
  const denseDoPointsStr = denseSampledPoints.map((p) => `${p.x.toFixed(1)},${p.yDo.toFixed(1)}`).join(' ');
  const denseTempPointsStr = denseSampledPoints.map((p) => `${p.x.toFixed(1)},${p.yTemp.toFixed(1)}`).join(' ');

  // SVG Area path for pH fill under the curve
  const phAreaPathStr = `M ${padding.left},${chartHeight - padding.bottom} ` +
    denseSampledPoints.map((p) => `L ${p.x.toFixed(1)},${p.yPh.toFixed(1)}`).join(' ') +
    ` L ${chartWidth - padding.right},${chartHeight - padding.bottom} Z`;

  // SVG Area path for pCO2 fill under curve
  const pco2AreaPathStr = `M ${padding.left},${chartHeight - padding.bottom} ` +
    denseSampledPoints.map((p) => `L ${p.x.toFixed(1)},${p.yPco2.toFixed(1)}`).join(' ') +
    ` L ${chartWidth - padding.right},${chartHeight - padding.bottom} Z`;

  // Dosing Bands Pixel Coordinates (Clipped to current zoom view)
  const c1RawStart = getTimeX(21600); // 06:00
  const c1RawEnd = getTimeX(32400);   // 09:00
  const c1StartX = Math.max(padding.left, c1RawStart);
  const c1EndX = Math.min(chartWidth - padding.right, c1RawEnd);
  const isC1Visible = c1EndX > c1StartX;

  const c2RawStart = getTimeX(54000); // 15:00
  const c2RawEnd = getTimeX(64800);   // 18:00
  const c2StartX = Math.max(padding.left, c2RawStart);
  const c2EndX = Math.min(chartWidth - padding.right, c2RawEnd);
  const isC2Visible = c2EndX > c2StartX;

  // Current Scrubber Position in seconds and pixels
  const scrubberSec = scrubberProgress * TOTAL_DAY_SECONDS;
  const scrubberX = getTimeX(scrubberSec);
  const isScrubberInWindow = scrubberSec >= zoomWindow.startSec && scrubberSec <= zoomWindow.endSec;

  // Interpolated Sensor Readings based on current scrubber progress
  const scrubberTelem = getInterpolatedTelemetryAtSecond(scrubberSec);
  const currentPh = scrubberTelem.ph.toFixed(1);
  const currentPco2 = Math.round(scrubberTelem.pco2);
  const currentDo = scrubberTelem.do.toFixed(1);
  const currentTemp = scrubberTelem.temp.toFixed(1);

  // Zoom & Pan Handlers (Centered around current scrubber position)
  const handleApplyPreset = (preset: '24h' | '6h' | '1h' | '15m' | 'full') => {
    setActiveZoomPreset(preset);
    const centerSec = scrubberProgress * TOTAL_DAY_SECONDS;

    switch (preset) {
      case '24h':
        setZoomWindow({ startSec: 0, endSec: TOTAL_DAY_SECONDS });
        break;
      case '6h': {
        const span = 6 * 3600;
        let start = Math.max(0, centerSec - span / 2);
        let end = start + span;
        if (end > TOTAL_DAY_SECONDS) {
          end = TOTAL_DAY_SECONDS;
          start = Math.max(0, TOTAL_DAY_SECONDS - span);
        }
        setZoomWindow({ startSec: Math.round(start), endSec: Math.round(end) });
        break;
      }
      case '1h': {
        const span = 3600;
        let start = Math.max(0, centerSec - span / 2);
        let end = start + span;
        if (end > TOTAL_DAY_SECONDS) {
          end = TOTAL_DAY_SECONDS;
          start = Math.max(0, TOTAL_DAY_SECONDS - span);
        }
        setZoomWindow({ startSec: Math.round(start), endSec: Math.round(end) });
        break;
      }
      case '15m': {
        const span = 900;
        let start = Math.max(0, centerSec - span / 2);
        let end = start + span;
        if (end > TOTAL_DAY_SECONDS) {
          end = TOTAL_DAY_SECONDS;
          start = Math.max(0, TOTAL_DAY_SECONDS - span);
        }
        setZoomWindow({ startSec: Math.round(start), endSec: Math.round(end) });
        break;
      }
      case 'full': {
        // Full depth: 120 seconds centered around current scrubber time!
        const span = 120;
        let start = Math.max(0, centerSec - span / 2);
        let end = start + span;
        if (end > TOTAL_DAY_SECONDS) {
          end = TOTAL_DAY_SECONDS;
          start = Math.max(0, TOTAL_DAY_SECONDS - span);
        }
        setZoomWindow({ startSec: Math.round(start), endSec: Math.round(end) });
        break;
      }
    }
  };

  const handleZoomByFactor = (factor: number, centerRatio: number = 0.5) => {
    setZoomWindow((prev) => {
      const currentSpan = prev.endSec - prev.startSec;
      const newSpan = Math.max(30, Math.min(TOTAL_DAY_SECONDS, currentSpan * factor));
      const centerSec = prev.startSec + centerRatio * currentSpan;
      let newStart = centerSec - centerRatio * newSpan;
      let newEnd = newStart + newSpan;

      if (newStart < 0) {
        newStart = 0;
        newEnd = Math.min(TOTAL_DAY_SECONDS, newSpan);
      }
      if (newEnd > TOTAL_DAY_SECONDS) {
        newEnd = TOTAL_DAY_SECONDS;
        newStart = Math.max(0, TOTAL_DAY_SECONDS - newSpan);
      }

      return { startSec: Math.round(newStart), endSec: Math.round(newEnd) };
    });
    setActiveZoomPreset('custom');
  };

  const handlePanByRatio = (ratioDelta: number) => {
    setZoomWindow((prev) => {
      const currentSpan = prev.endSec - prev.startSec;
      const deltaSec = currentSpan * ratioDelta;
      let newStart = prev.startSec + deltaSec;
      let newEnd = prev.endSec + deltaSec;

      if (newStart < 0) {
        newStart = 0;
        newEnd = currentSpan;
      }
      if (newEnd > TOTAL_DAY_SECONDS) {
        newEnd = TOTAL_DAY_SECONDS;
        newStart = TOTAL_DAY_SECONDS - currentSpan;
      }

      return { startSec: Math.round(newStart), endSec: Math.round(newEnd) };
    });
    setActiveZoomPreset('custom');
  };

  // Ref to always hold latest handleZoomByFactor function
  const handleZoomByFactorRef = useRef(handleZoomByFactor);
  useEffect(() => {
    handleZoomByFactorRef.current = handleZoomByFactor;
  });

  // Native non-passive Wheel Event Listener:
  // Crucial: Intercepts Ctrl+Wheel (browser page zoom shortcut) and trackpad pinch gestures,
  // preventing the entire page from zooming or scrolling, and instead expanding ONLY the graph!
  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;

    const onNativeWheel = (e: WheelEvent) => {
      // STOP browser page zoom (Ctrl+wheel / pinch) and page scroll!
      e.preventDefault();
      e.stopPropagation();

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const paddingLeftPx = (padding.left / chartWidth) * rect.width;
      const innerWidthPx = (innerWidth / chartWidth) * rect.width;
      const ratio = Math.max(
        0,
        Math.min(1, (mouseX - paddingLeftPx) / Math.max(1, innerWidthPx))
      );

      // Smooth zoom factor calculation
      // deltaY < 0 means scrolling up (zoom IN / expand time series)
      // deltaY > 0 means scrolling down (zoom OUT / compress time series)
      const sensitivity = e.ctrlKey ? 0.008 : 0.002;
      const clampedDelta = Math.max(-120, Math.min(120, e.deltaY));
      const factor = Math.exp(clampedDelta * sensitivity);

      handleZoomByFactorRef.current(factor, ratio);
    };

    el.addEventListener('wheel', onNativeWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', onNativeWheel);
    };
  }, [chartWidth, innerWidth, padding.left]);

  // Drag to pan on SVG chart
  const handleSvgMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDraggingPan(true);
    setDragStartX(e.clientX);
    setDragStartWindow({ ...zoomWindow });
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const chartPixelX = (mouseX / rect.width) * chartWidth;

    if (chartPixelX >= padding.left && chartPixelX <= chartWidth - padding.right) {
      const sec = getSecFromX(chartPixelX);
      const telem = getInterpolatedTelemetryAtSecond(sec);
      setHoverCursor({
        active: true,
        x: chartPixelX,
        sec: Math.round(sec),
        telem,
      });
    } else {
      setHoverCursor(null);
    }

    if (isDraggingPan) {
      const deltaPixelX = e.clientX - dragStartX;
      const windowSpan = dragStartWindow.endSec - dragStartWindow.startSec;
      const deltaSec = -(deltaPixelX / rect.width) * windowSpan * (chartWidth / innerWidth);

      let nextStart = dragStartWindow.startSec + deltaSec;
      let nextEnd = dragStartWindow.endSec + deltaSec;

      if (nextStart < 0) {
        nextStart = 0;
        nextEnd = windowSpan;
      }
      if (nextEnd > TOTAL_DAY_SECONDS) {
        nextEnd = TOTAL_DAY_SECONDS;
        nextStart = TOTAL_DAY_SECONDS - windowSpan;
      }

      setZoomWindow({
        startSec: Math.round(nextStart),
        endSec: Math.round(nextEnd),
      });
      setActiveZoomPreset('custom');
    }
  };

  const handleSvgMouseUp = () => {
    setIsDraggingPan(false);
  };

  const handleSvgMouseLeave = () => {
    setIsDraggingPan(false);
    setHoverCursor(null);
  };

  // Standard Benchmark Metrics (Comparative analysis vs Regulatory Target Baseline)
  const standardMetrics = [
    params.ph && {
      id: 'ph',
      name: 'pH Buffer',
      unit: 'pH',
      measured: parseFloat(currentPh),
      baseline: 8.0,
      min: 6.5,
      max: 8.5,
      normalizedMeasured: Math.min(145, Math.max(10, (parseFloat(currentPh) / 8.0) * 100)),
      status: 'Optimal Buffer',
      color: '#0284C7',
      deltaText: `${parseFloat(currentPh) >= 8.0 ? '+' : ''}${(parseFloat(currentPh) - 8.0).toFixed(2)}`
    },
    params.pco2 && {
      id: 'pco2',
      name: 'pCO₂ Drawdown',
      unit: 'µatm',
      measured: currentPco2,
      baseline: 2200,
      min: 1600,
      max: 2800,
      normalizedMeasured: Math.min(145, Math.max(10, (currentPco2 / 2200) * 100)),
      status: 'Active Drawdown',
      color: '#10B981',
      deltaText: `${currentPco2 >= 2200 ? '+' : ''}${Math.round(((currentPco2 - 2200) / 2200) * 100)}%`
    },
    params.do && {
      id: 'do',
      name: 'Dissolved Oxygen',
      unit: 'mg/L',
      measured: parseFloat(currentDo),
      baseline: 5.0,
      min: 4.0,
      max: 7.0,
      normalizedMeasured: Math.min(145, Math.max(10, (parseFloat(currentDo) / 5.0) * 100)),
      status: 'Healthy Aerobic',
      color: '#8B5CF6',
      deltaText: `${parseFloat(currentDo) >= 5.0 ? '+' : ''}${(parseFloat(currentDo) - 5.0).toFixed(1)} mg/L`
    },
    params.temperature && {
      id: 'temperature',
      name: 'Temperature',
      unit: '°C',
      measured: parseFloat(currentTemp),
      baseline: 26.0,
      min: 22.0,
      max: 30.0,
      normalizedMeasured: Math.min(145, Math.max(10, (parseFloat(currentTemp) / 26.0) * 100)),
      status: 'Nominal Ambient',
      color: '#F59E0B',
      deltaText: `${parseFloat(currentTemp) >= 26.0 ? '+' : ''}${(parseFloat(currentTemp) - 26.0).toFixed(1)} °C`
    },
    params.ec && {
      id: 'ec',
      name: 'Conductivity (EC)',
      unit: 'µS/cm',
      measured: currentAssetData.baseEc,
      baseline: 3000,
      min: 2000,
      max: 3600,
      normalizedMeasured: Math.min(145, Math.max(10, (currentAssetData.baseEc / 3000) * 100)),
      status: 'Estuarine Mix',
      color: '#06B6D4',
      deltaText: `${currentAssetData.baseEc >= 3000 ? '+' : ''}${currentAssetData.baseEc - 3000} µS/cm`
    }
  ].filter(Boolean) as {
    id: string;
    name: string;
    unit: string;
    measured: number;
    baseline: number;
    min: number;
    max: number;
    normalizedMeasured: number;
    status: string;
    color: string;
    deltaText: string;
  }[];

  const renderAlertIcon = (type: AssetAlert['type']) => {
    switch (type) {
      case 'danger':
        return (
          <div className="w-6 h-6 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-6 h-6 rounded bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
        );
      case 'info':
        return (
          <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
          </div>
        );
      case 'success':
        return (
          <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        );
    }
  };

  const getAlertTitleColor = (type: AssetAlert['type']) => {
    switch (type) {
      case 'danger':
        return 'text-rose-600';
      case 'warning':
        return 'text-amber-600';
      case 'info':
        return 'text-blue-600';
      case 'success':
        return 'text-emerald-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast feedback */}
      {exportToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          {exportToast}
        </div>
      )}

      {/* 1. Page Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1628] tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600" />
            Monitoring
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Sonde telemetry, graphs & location for <strong className="text-slate-800 font-semibold">{currentAssetData.name}</strong> ({currentAssetData.assetId} • {currentAssetData.location})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {currentAssetData.name}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
            {currentAssetData.type}
          </span>
        </div>
      </div>

      {/* 2. Top Filter Controls Bar (4 Cards in a row) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Asset Selector */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs">
          <label className="block text-[11px] text-slate-500 font-medium mb-1">
            Asset
          </label>
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors">
            <div className="w-5 h-5 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mr-2">
              <Waves className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedAsset}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedAsset(val);
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set('asset', val);
                  return next;
                });
              }}
              className="w-full appearance-none bg-transparent text-xs font-semibold text-slate-800 pr-6 outline-none cursor-pointer"
            >
              <option value="AquaDrone_MVP_001">AquaDrone_MVP_001</option>
              <option value="AquaNode_ATV_001">AquaNode_ATV_001</option>
              <option value="RiverNode_RJY_001">RiverNode_RJY_001</option>
              <option value="AquaDrone_DOS_002">AquaDrone_DOS_002</option>
              <option value="AquaDrone_DWN_003">AquaDrone_DWN_003</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Card 2: Date Selector (Functional date selection) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs">
          <label className="block text-[11px] text-slate-500 font-medium mb-1">
            Date
          </label>
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-2 pointer-events-none" />
            <input
              type="date"
              value={selectedDateIso}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedDateIso(val);
                if (val) {
                  const d = new Date(val + 'T00:00:00');
                  setSelectedDate(d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
                }
              }}
              className="w-full bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Card 3: Visualization Dropdown (Standard vs Time-series) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs">
          <label className="block text-[11px] text-slate-500 font-medium mb-1">
            Visualization
          </label>
          <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors">
            <select
              value={visualizationMode}
              onChange={(e) => setVisualizationMode(e.target.value as 'standard' | 'timeseries')}
              className="w-full appearance-none bg-transparent text-xs font-semibold text-slate-800 pr-6 outline-none cursor-pointer"
            >
              <option value="timeseries">Time-series</option>
              <option value="standard">Standard</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Card 4: Available Parameters Popover & Direct Export Button */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs">
          <label className="block text-[11px] text-slate-500 font-medium mb-1">
            Parameters & Export
          </label>
          <div className="flex items-center gap-2">
            {/* Available Parameters Button with 5 Checkboxes Popover */}
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setIsParamDropdownOpen(!isParamDropdownOpen)}
                className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                title="Select Available Parameters"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">Parameters ({Object.values(params).filter(Boolean).length}/5)</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isParamDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Popover Dropdown with 5 Checkboxes */}
              {isParamDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsParamDropdownOpen(false)}
                  />
                  <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-1.5 z-40 w-60 bg-white rounded-xl border border-slate-200 shadow-xl p-3 space-y-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Available Parameters
                      </span>
                      <span className="text-[10px] text-blue-600 font-bold font-mono">
                        {Object.values(params).filter(Boolean).length} Active
                      </span>
                    </div>

                    {/* 1. pH */}
                    <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={params.ph}
                        onChange={() => toggleParam('ph')}
                        className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                        pH
                      </span>
                    </label>

                    {/* 2. pCO2 */}
                    <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={params.pco2}
                        onChange={() => toggleParam('pco2')}
                        className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        pCO₂
                      </span>
                    </label>

                    {/* 3. DO */}
                    <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={params.do}
                        onChange={() => toggleParam('do')}
                        className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        DO
                      </span>
                    </label>

                    {/* 4. Temperature */}
                    <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={params.temperature}
                        onChange={() => toggleParam('temperature')}
                        className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600" />
                        Temperature
                      </span>
                    </label>

                    {/* 5. EC */}
                    <label className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-slate-50 transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={params.ec}
                        onChange={() => toggleParam('ec')}
                        className="w-3.5 h-3.5 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-600" />
                        EC
                      </span>
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* Direct Export CSV Button */}
            <button
              type="button"
              onClick={handleExport}
              className="btn-press px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer shrink-0 flex items-center gap-1.5"
              title="Export CSV Telemetry"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Parameter Trends / Benchmark Chart (Full Width, Changes with Visualization Mode) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header with Title */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-bold text-[#0A1628]">
              Live Telemetry
            </h2>
          </div>

          {/* SVG Chart: Changes dynamically based on visualizationMode */}
          <div
            ref={chartContainerRef}
            className="relative w-full overflow-hidden bg-white rounded-lg select-none h-64 sm:h-72 transition-all duration-300"
            style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
          >
            {visualizationMode === 'standard' ? (
              /* ================= MODE 1: STANDARD BENCHMARK & REGULATORY COMPLIANCE CHART ================= */
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                {/* Horizontal Standard Benchmark Gridlines (0%, 25%, 50%, 75%, 100%, 125%, 150%) */}
                {[0, 25, 50, 75, 100, 125, 150].map((pct) => {
                  const y = padding.top + ((150 - pct) / 150) * innerHeight;
                  const is100 = pct === 100;
                  return (
                    <g key={pct}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={chartWidth - padding.right}
                        y2={y}
                        stroke={is100 ? '#0284C7' : '#F1F5F9'}
                        strokeWidth={is100 ? '1.5' : '1'}
                        strokeDasharray={is100 ? '4,4' : undefined}
                      />
                      <text
                        x={padding.left - 8}
                        y={y + 3.5}
                        textAnchor="end"
                        fontSize="9.5"
                        fill={is100 ? '#0284C7' : '#64748B'}
                        fontWeight={is100 ? 'bold' : 'normal'}
                        fontFamily="Inter, sans-serif"
                      >
                        {pct}%
                      </text>
                    </g>
                  );
                })}

                {/* Left Axis Title */}
                <text
                  x={12}
                  y={chartHeight / 2}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#64748B"
                  transform={`rotate(-90 12 ${chartHeight / 2})`}
                  fontFamily="Inter, sans-serif"
                >
                  % of Regulatory Standard Baseline
                </text>

                {/* Shaded Safe Operating Envelope Band (80% to 120%) */}
                <rect
                  x={padding.left}
                  y={padding.top + ((150 - 120) / 150) * innerHeight}
                  width={innerWidth}
                  height={((120 - 80) / 150) * innerHeight}
                  fill="#ECFDF5"
                  fillOpacity="0.45"
                  stroke="#A7F3D0"
                  strokeDasharray="4,4"
                  strokeWidth="1"
                />
                <text
                  x={chartWidth - padding.right - 8}
                  y={padding.top + ((150 - 120) / 150) * innerHeight + 14}
                  textAnchor="end"
                  fontSize="8.5"
                  fill="#059669"
                  fontWeight="bold"
                >
                  Safe Tolerance Envelope (80% – 120% of Target Baseline)
                </text>

                {/* 100% Target Standard Tag */}
                <g transform={`translate(${padding.left + 8}, ${padding.top + ((150 - 100) / 150) * innerHeight - 6})`}>
                  <rect x="0" y="-10" width="138" height="14" rx="3" fill="#E0F2FE" />
                  <text x="6" y="1" fontSize="8" fontWeight="bold" fill="#0369A1">
                    ★ 100% Regulatory Standard Baseline
                  </text>
                </g>

                {/* Grouped Comparative Columns for Active Parameters */}
                {standardMetrics.map((metric, idx) => {
                  const N = Math.max(1, standardMetrics.length);
                  const colSpacing = innerWidth / N;
                  const centerX = padding.left + (idx + 0.5) * colSpacing;
                  const barWidth = Math.min(36, colSpacing * 0.28);

                  const targetY = padding.top + ((150 - 100) / 150) * innerHeight;
                  const targetHeight = (100 / 150) * innerHeight;

                  const measuredPct = metric.normalizedMeasured;
                  const measuredY = padding.top + ((150 - measuredPct) / 150) * innerHeight;
                  const measuredHeight = Math.max(4, (measuredPct / 150) * innerHeight);

                  return (
                    <g key={metric.id}>
                      {/* Bar 1: Regulatory Standard Baseline (Target = 100%) */}
                      <rect
                        x={centerX - barWidth - 4}
                        y={targetY}
                        width={barWidth}
                        height={targetHeight}
                        fill="#E2E8F0"
                        stroke="#CBD5E1"
                        strokeWidth="1"
                        rx="4"
                      />

                      {/* Bar 2: Current Measured Value */}
                      <rect
                        x={centerX + 4}
                        y={measuredY}
                        width={barWidth}
                        height={measuredHeight}
                        fill={metric.color}
                        rx="4"
                      />

                      {/* Floating Measured Value Pill on top */}
                      <g transform={`translate(${centerX + 4 + barWidth / 2}, ${measuredY - 8})`}>
                        <rect
                          x="-32"
                          y="-14"
                          width="64"
                          height="16"
                          rx="4"
                          fill="#0F172A"
                          stroke={metric.color}
                          strokeWidth="1.5"
                        />
                        <text
                          textAnchor="middle"
                          y="-3"
                          fontSize="8.5"
                          fontWeight="bold"
                          fill="#FFFFFF"
                          fontFamily="Inter, sans-serif"
                        >
                          {metric.measured} {metric.unit}
                        </text>
                      </g>

                      {/* X-Axis Parameter Name & Status */}
                      <text
                        x={centerX}
                        y={chartHeight - 20}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="#1E293B"
                        fontFamily="Inter, sans-serif"
                      >
                        {metric.name}
                      </text>
                      <text
                        x={centerX}
                        y={chartHeight - 7}
                        textAnchor="middle"
                        fontSize="8.5"
                        fontWeight="bold"
                        fill={metric.color}
                        fontFamily="Inter, sans-serif"
                      >
                        {metric.status} ({metric.deltaText})
                      </text>
                    </g>
                  );
                })}
              </svg>
            ) : (
              /* ================= MODE 2: TIME-SERIES INTERACTIVE TELEMETRY CHART ================= */
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible select-none cursor-crosshair"
                onMouseDown={handleSvgMouseDown}
                onMouseMove={handleSvgMouseMove}
                onMouseUp={handleSvgMouseUp}
                onMouseLeave={handleSvgMouseLeave}
                onDoubleClick={() => handleZoomByFactor(0.5)}
              >
                <defs>
                  {/* Soft area gradient fill for pH curve */}
                  <linearGradient id="phFillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Soft area gradient fill for pCO2 curve */}
                  <linearGradient id="pco2FillGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Left Y-Axis Gridlines & Labels */}
                {(focusedParam === 'all' || focusedParam === 'ph') &&
                  [7.0, 8.0, 9.0, 10.0, 11.0].map((val) => (
                    <g key={`ph-grid-${val}`}>
                      <line
                        x1={padding.left}
                        y1={getYPh(val)}
                        x2={chartWidth - padding.right}
                        y2={getYPh(val)}
                        stroke={val === 8.0 ? '#BAE6FD' : '#F1F5F9'}
                        strokeWidth={val === 8.0 ? '1.5' : '1'}
                        strokeDasharray={val === 8.0 ? '4,4' : undefined}
                      />
                      <text
                        x={padding.left - 8}
                        y={getYPh(val) + 3}
                        textAnchor="end"
                        fontSize="9.5"
                        fill={val === 8.0 ? '#0284C7' : '#64748B'}
                        fontWeight={val === 8.0 ? 'bold' : 'normal'}
                        fontFamily="Inter, sans-serif"
                      >
                        {val.toFixed(1)} {val === 8.0 ? '★' : ''}
                      </text>
                    </g>
                  ))}

                {focusedParam === 'pco2' &&
                  [1800, 2200, 2600, 3000].map((val) => (
                    <g key={`pco2-grid-${val}`}>
                      <line
                        x1={padding.left}
                        y1={getYPco2(val)}
                        x2={chartWidth - padding.right}
                        y2={getYPco2(val)}
                        stroke="#F1F5F9"
                        strokeWidth="1"
                      />
                      <text
                        x={padding.left - 8}
                        y={getYPco2(val) + 3}
                        textAnchor="end"
                        fontSize="9.5"
                        fill="#059669"
                        fontFamily="Inter, sans-serif"
                      >
                        {val}
                      </text>
                    </g>
                  ))}

                {focusedParam === 'do' &&
                  [3.5, 4.5, 5.5, 6.5].map((val) => (
                    <g key={`do-grid-${val}`}>
                      <line
                        x1={padding.left}
                        y1={getYDo(val)}
                        x2={chartWidth - padding.right}
                        y2={getYDo(val)}
                        stroke="#F1F5F9"
                        strokeWidth="1"
                      />
                      <text
                        x={padding.left - 8}
                        y={getYDo(val) + 3}
                        textAnchor="end"
                        fontSize="9.5"
                        fill="#7C3AED"
                        fontFamily="Inter, sans-serif"
                      >
                        {val.toFixed(1)}
                      </text>
                    </g>
                  ))}

                {focusedParam === 'temp' &&
                  [25.0, 26.0, 27.0, 28.0, 29.0].map((val) => (
                    <g key={`temp-grid-${val}`}>
                      <line
                        x1={padding.left}
                        y1={getYTemp(val)}
                        x2={chartWidth - padding.right}
                        y2={getYTemp(val)}
                        stroke="#F1F5F9"
                        strokeWidth="1"
                      />
                      <text
                        x={padding.left - 8}
                        y={getYTemp(val) + 3}
                        textAnchor="end"
                        fontSize="9.5"
                        fill="#D97706"
                        fontFamily="Inter, sans-serif"
                      >
                        {val.toFixed(1)}°
                      </text>
                    </g>
                  ))}

                {/* Right Y-Axis Labels for pCO2 when All Parameters is active */}
                {focusedParam === 'all' &&
                  [1800, 2200, 2600, 3000].map((tick) => (
                    <text
                      key={`right-${tick}`}
                      x={chartWidth - padding.right + 8}
                      y={getYPco2(tick) + 3}
                      textAnchor="start"
                      fontSize="9"
                      fill="#059669"
                      fontFamily="Inter, sans-serif"
                    >
                      {tick}
                    </text>
                  ))}

                {/* Left Axis Title */}
                <text
                  x={14}
                  y={chartHeight / 2}
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="bold"
                  fill="#475569"
                  transform={`rotate(-90 14 ${chartHeight / 2})`}
                  fontFamily="Inter, sans-serif"
                >
                  {focusedParam === 'all'
                    ? 'pH Buffer'
                    : focusedParam === 'ph'
                    ? 'pH Buffer Level'
                    : focusedParam === 'pco2'
                    ? 'pCO₂ Drawdown (µatm)'
                    : focusedParam === 'do'
                    ? 'Dissolved Oxygen (mg/L)'
                    : 'Water Temp (°C)'}
                </text>

                {/* Right Axis Title (when All Parameters active) */}
                {focusedParam === 'all' && (
                  <text
                    x={chartWidth - 10}
                    y={chartHeight / 2}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#059669"
                    transform={`rotate(90 ${chartWidth - 10} ${chartHeight / 2})`}
                    fontFamily="Inter, sans-serif"
                  >
                    pCO₂ (µatm)
                  </text>
                )}

                {/* Dosing Window 1 Highlighted Shaded Column (06:00 to 09:00) */}
                {isC1Visible && (
                  <g>
                    <rect
                      x={c1StartX}
                      y={padding.top}
                      width={c1EndX - c1StartX}
                      height={innerHeight}
                      fill="#E0F2FE"
                      fillOpacity="0.45"
                      stroke="#7DD3FC"
                      strokeDasharray="4,4"
                      strokeWidth="1"
                    />
                    <g
                      transform={`translate(${Math.max(
                        padding.left + 50,
                        Math.min(chartWidth - padding.right - 50, (c1StartX + c1EndX) / 2)
                      )}, ${padding.top - 8})`}
                    >
                      <rect
                        x="-45"
                        y="-14"
                        width="90"
                        height="20"
                        rx="4"
                        fill="#0284C7"
                        stroke="#0369A1"
                        strokeWidth="1"
                      />
                      <text textAnchor="middle" y="0" fontSize="8.5" fontWeight="bold" fill="#FFFFFF">
                        Dosing Window 1
                      </text>
                    </g>
                  </g>
                )}

                {/* Dosing Window 2 Highlighted Shaded Column (15:00 to 18:00) */}
                {isC2Visible && (
                  <g>
                    <rect
                      x={c2StartX}
                      y={padding.top}
                      width={c2EndX - c2StartX}
                      height={innerHeight}
                      fill="#E0F2FE"
                      fillOpacity="0.45"
                      stroke="#7DD3FC"
                      strokeDasharray="4,4"
                      strokeWidth="1"
                    />
                    <g
                      transform={`translate(${Math.max(
                        padding.left + 50,
                        Math.min(chartWidth - padding.right - 50, (c2StartX + c2EndX) / 2)
                      )}, ${padding.top - 8})`}
                    >
                      <rect
                        x="-45"
                        y="-14"
                        width="90"
                        height="20"
                        rx="4"
                        fill="#0284C7"
                        stroke="#0369A1"
                        strokeWidth="1"
                      />
                      <text textAnchor="middle" y="0" fontSize="8.5" fontWeight="bold" fill="#FFFFFF">
                        Dosing Window 2
                      </text>
                    </g>
                  </g>
                )}

                {/* Dynamic X Axis Time Labels (Adapts from 4-hour skips down to seconds) */}
                {dynamicTicks.map((tick) => (
                  <g key={`tick-${tick.sec}`}>
                    <line
                      x1={tick.x}
                      y1={chartHeight - padding.bottom}
                      x2={tick.x}
                      y2={chartHeight - padding.bottom + 5}
                      stroke={tick.isMajor ? '#64748B' : '#CBD5E1'}
                      strokeWidth={tick.isMajor ? '1.5' : '1'}
                    />
                    <text
                      x={tick.x}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fontSize={tick.isMajor ? '9.5' : '8.5'}
                      fontWeight={tick.isMajor ? 'bold' : 'normal'}
                      fill={tick.isMajor ? '#1E293B' : '#64748B'}
                      fontFamily="Inter, sans-serif"
                    >
                      {tick.label}
                    </text>
                  </g>
                ))}

                {/* Area Gradient Fills */}
                {(focusedParam === 'all' || focusedParam === 'ph') && (
                  <path d={phAreaPathStr} fill="url(#phFillGradient)" />
                )}
                {focusedParam === 'pco2' && (
                  <path d={pco2AreaPathStr} fill="url(#pco2FillGradient)" />
                )}

                {/* Dynamic Curves with expressive vertical shape */}
                {/* 1. Temperature Curve (Orange) */}
                {(focusedParam === 'all' || focusedParam === 'temp') && params.temperature && (
                  <polyline
                    points={denseTempPointsStr}
                    fill="none"
                    stroke="#F97316"
                    strokeWidth={focusedParam === 'temp' ? '2.5' : '2'}
                    strokeOpacity={focusedParam === 'all' || focusedParam === 'temp' ? 1 : 0.25}
                    strokeLinecap="round"
                  />
                )}

                {/* 2. DO Curve (Purple) */}
                {(focusedParam === 'all' || focusedParam === 'do') && params.do && (
                  <polyline
                    points={denseDoPointsStr}
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth={focusedParam === 'do' ? '2.5' : '2'}
                    strokeOpacity={focusedParam === 'all' || focusedParam === 'do' ? 1 : 0.25}
                    strokeLinecap="round"
                  />
                )}

                {/* 3. pCO2 Curve (Green) */}
                {(focusedParam === 'all' || focusedParam === 'pco2') && params.pco2 && (
                  <polyline
                    points={densePco2PointsStr}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={focusedParam === 'pco2' ? '2.5' : '2'}
                    strokeOpacity={focusedParam === 'all' || focusedParam === 'pco2' ? 1 : 0.25}
                    strokeLinecap="round"
                  />
                )}

                {/* 4. pH Curve (Blue) */}
                {(focusedParam === 'all' || focusedParam === 'ph') && params.ph && (
                  <polyline
                    points={densePhPointsStr}
                    fill="none"
                    stroke="#0284C7"
                    strokeWidth={focusedParam === 'ph' ? '3' : '2.5'}
                    strokeOpacity={focusedParam === 'all' || focusedParam === 'ph' ? 1 : 0.25}
                    strokeLinecap="round"
                  />
                )}

                {/* Sample nodes when zoomed */}
                {denseSampledPoints
                  .filter((_, idx) => {
                    const span = zoomWindow.endSec - zoomWindow.startSec;
                    if (span > 36000) return idx % 12 === 0;
                    if (span > 7200) return idx % 8 === 0;
                    if (span > 1800) return idx % 4 === 0;
                    return idx % 2 === 0;
                  })
                  .map((p) => (
                    <g key={`nodes-${p.sec}`}>
                      {(focusedParam === 'all' || focusedParam === 'ph') && params.ph && (
                        <circle cx={p.x} cy={p.yPh} r="2.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1" />
                      )}
                      {(focusedParam === 'all' || focusedParam === 'pco2') && params.pco2 && (
                        <circle cx={p.x} cy={p.yPco2} r="2.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" />
                      )}
                      {(focusedParam === 'all' || focusedParam === 'do') && params.do && (
                        <circle cx={p.x} cy={p.yDo} r="2.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1" />
                      )}
                      {(focusedParam === 'all' || focusedParam === 'temp') && params.temperature && (
                        <circle cx={p.x} cy={p.yTemp} r="2.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="1" />
                      )}
                    </g>
                  ))}

                {/* Hover Crosshair & Precision HUD Card */}
                {hoverCursor && hoverCursor.active && (
                  <g>
                    {/* Vertical Guideline */}
                    <line
                      x1={hoverCursor.x}
                      y1={padding.top}
                      x2={hoverCursor.x}
                      y2={chartHeight - padding.bottom}
                      stroke="#475569"
                      strokeWidth="1.5"
                      strokeDasharray="2,2"
                    />
                    {/* Time Pill on X-Axis */}
                    <g transform={`translate(${hoverCursor.x}, ${chartHeight - 4})`}>
                      <rect x="-32" y="-13" width="64" height="15" rx="3" fill="#0F172A" />
                      <text textAnchor="middle" y="-2" fontSize="8.5" fill="#FFFFFF" fontWeight="bold" fontFamily="monospace">
                        {formatSecondsToClock(hoverCursor.sec, true)}
                      </text>
                    </g>
                    {/* Floating Precision Telemetry HUD Card */}
                    <g
                      transform={`translate(${
                        hoverCursor.x > chartWidth - 170 ? hoverCursor.x - 165 : hoverCursor.x + 10
                      }, ${padding.top + 6})`}
                    >
                      <rect
                        x="0"
                        y="0"
                        width="155"
                        height="68"
                        rx="6"
                        fill="#0F172A"
                        fillOpacity="0.95"
                        stroke="#334155"
                        strokeWidth="1"
                      />
                      <text x="8" y="14" fontSize="8.5" fontWeight="bold" fill="#94A3B8" fontFamily="monospace">
                        ⏱ {formatSecondsToClock(hoverCursor.sec, true)}
                      </text>
                      <text x="8" y="28" fontSize="8.5" fontWeight="bold" fill="#38BDF8">
                        pH Level: {hoverCursor.telem.ph.toFixed(2)}
                      </text>
                      <text x="8" y="41" fontSize="8.5" fontWeight="bold" fill="#34D399">
                        pCO₂: {hoverCursor.telem.pco2} µatm
                      </text>
                      <text x="8" y="54" fontSize="8.5" fontWeight="bold" fill="#A78BFA">
                        DO: {hoverCursor.telem.do.toFixed(2)} mg/L
                      </text>
                      <text x="84" y="54" fontSize="8.5" fontWeight="bold" fill="#FBBF24">
                        Temp: {hoverCursor.telem.temp.toFixed(1)}°C
                      </text>
                    </g>
                  </g>
                )}
              </svg>
            )}
          </div>
        </div>


      </div>

      {/* 4. On Below: Asset Map / Location (24 hrs) (Full Width) */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-bold text-[#0A1628]">
              Asset Location
            </h2>
          </div>
        </div>

        {/* Live Synchronized Asset Satellite Map */}
        <MonitoringAssetMap
          progressRatio={scrubberProgress}
          mapType={mapType}
          onMapTypeChange={setMapType}
          assetName={selectedAsset}
        />
      </div>

      {/* 5. Bottom Section: Sensor Readings (Left) + Notifications & Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Sensor Readings (Selected Time) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Title & Current Timestamp */}
            <div className="mb-3">
              <h2 className="text-sm font-bold text-[#0A1628]">
                Sensor Readings (Current Telemetry)
              </h2>
              <p className="text-xs text-slate-500">
                {selectedDate}, {currentTimeString}
              </p>
            </div>

            {/* 6 Metric Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {/* Card 1: pH */}
              <div className="p-3 rounded-lg bg-[#EFF6FF] border border-[#BFDBFE]/60 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                    <Droplets className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">pH</span>
                </div>
                <div className="my-1">
                  <div className="text-2xl font-black text-slate-900 tracking-tight leading-none font-sans">
                    {currentPh}
                  </div>
                </div>
                <div className="mt-1 flex flex-col gap-0.5">
                  <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold self-start">
                    Normal
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-mono mt-0.5">
                    (6.5 – 8.5)
                  </span>
                </div>
              </div>

              {/* Card 2: pCO2 */}
              <div className="p-3 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0]/60 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    <Wind className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">pCO₂</span>
                </div>
                <div className="my-1">
                  <div className="text-2xl font-black text-slate-900 tracking-tight leading-none font-sans">
                    {currentPco2}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">µatm</span>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                </div>
              </div>

              {/* Card 3: DO */}
              <div className="p-3 rounded-lg bg-[#F5F3FF] border border-[#DDD6FE]/60 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    <Activity className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">DO</span>
                </div>
                <div className="my-1">
                  <div className="text-2xl font-black text-slate-900 tracking-tight leading-none font-sans">
                    {currentDo}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">mg/L</span>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                </div>
              </div>

              {/* Card 4: Temperature */}
              <div className="p-3 rounded-lg bg-[#FFF7ED] border border-[#FED7AA]/60 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px]">
                    <Thermometer className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 truncate">Temperature</span>
                </div>
                <div className="my-1">
                  <div className="text-2xl font-black text-slate-900 tracking-tight leading-none font-sans">
                    {currentTemp}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">°C</span>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                </div>
              </div>

              {/* Card 5: EC */}
              <div className="p-3 rounded-lg bg-[#F0FDF4] border border-[#BAE6FD]/60 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-cyan-600 text-white flex items-center justify-center text-[10px]">
                    <Zap className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">EC</span>
                </div>
                <div className="my-1">
                  <div className="text-2xl font-black text-slate-900 tracking-tight leading-none font-sans">
                    {currentAssetData.baseEc}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">µS/cm</span>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                </div>
              </div>

              {/* Card 6: Turbidity */}
              <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A]/60 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px]">
                    <Waves className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 truncate">Turbidity</span>
                </div>
                <div className="my-1">
                  <div className="text-2xl font-black text-slate-900 tracking-tight leading-none font-sans">
                    {currentAssetData.baseTurbidity}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">NTU</span>
                </div>
                <div className="mt-1">
                  <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notifications & Alerts */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Title & View All */}
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-bold text-[#0A1628]">
                Notifications & Alerts
              </h2>
              <button
                type="button"
                onClick={() => setShowAllAlertsModal(true)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* Alert Items matching selected asset */}
            <div className="space-y-2.5">
              {assetAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex items-start gap-2.5">
                  {renderAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className={`text-xs font-bold ${getAlertTitleColor(alert.type)} truncate`}>
                        {alert.title}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: All Notifications & Alerts History for Selected Asset */}
      {showAllAlertsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Notifications & Alerts History
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logs for <strong className="text-slate-800">{currentAssetData.name}</strong> ({currentAssetData.assetId} • {currentAssetData.location})
                </p>
              </div>
              <button
                onClick={() => setShowAllAlertsModal(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {assetAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start gap-3"
                >
                  {renderAlertIcon(alert.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-bold ${getAlertTitleColor(alert.type)}`}>
                        {alert.title}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowAllAlertsModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
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
