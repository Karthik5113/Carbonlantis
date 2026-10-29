import {
  DashboardOverviewKpis,
  OperationalAsset,
  MonitoringTimeseriesPoint,
  SubsystemHealth,
  AlertItemData,
  SensorNode,
  DosingCycle,
  GpsAssetTrack,
  MineralFeedstock,
  SlurryMixerTank,
  PumpController,
  SlurryBatchRecord,
  DosingPlan,
  DosingReconciliationRecord,
  CarbonateChemistryState,
  CarbonRemovalAccounting,
  MrvReportPackage,
  UserAccount,
  ActivityLogItem,
  BackupHistoryRecord,
  AssetConfigItem
} from '../types';

/* ========================================================
   MODULE 1: DASHBOARD OVERVIEW DATA
   ======================================================== */

export const dashboardOverviewKpis: DashboardOverviewKpis = {
  cumulativeCo2RemovedTonnes: 842.8,
  netAlkalinityInjectedTons: 1124.5,
  activeDeploymentsCount: 12,
  totalDeploymentsCount: 14,
  averageDeltaPh: 0.38,
  realtimeSensorsCount: 208,
  telemetryIngestRatePps: 42.6,
  systemReliabilityPct: 99.92,
  criticalAlertsCount: 0,
  warningAlertsCount: 2
};

export const operationalAssetsData: OperationalAsset[] = [
  {
    id: "ast-01",
    name: "MDP-01 (Vessel Albatross)",
    code: "KSP-MDP-01",
    type: "mobile-dosing",
    status: "Active",
    catchment: "Kesinapalli Main Drain",
    coordinates: [16.5412, 81.9125],
    batteryPct: 96,
    solarWatts: 340,
    signalStrengthDbm: -68,
    dosingRateKgHr: 180.5,
    slurryDensityGPerL: 1180,
    waterDischargeM3s: 14.2,
    lastPing: "Just now",
    firmwareVersion: "v2.8.4-rt",
    operatorInCharge: "Dr. Elena Vance",
    healthScore: 98
  },
  {
    id: "ast-02",
    name: "MDP-02 (Delta Ranger)",
    code: "GDV-MDP-02",
    type: "mobile-dosing",
    status: "Active",
    catchment: "Godavari Mid Reach",
    coordinates: [16.5740, 81.8890],
    batteryPct: 88,
    solarWatts: 295,
    signalStrengthDbm: -74,
    dosingRateKgHr: 142.0,
    slurryDensityGPerL: 1175,
    waterDischargeM3s: 22.8,
    lastPing: "1m ago",
    firmwareVersion: "v2.8.4-rt",
    operatorInCharge: "Marcus Chen",
    healthScore: 95
  },
  {
    id: "ast-03",
    name: "MRV Station Alpha (Upstream Baseline)",
    code: "KSP-MRV-01",
    type: "mrv-station",
    status: "Active",
    catchment: "Kesinapalli Reach A",
    coordinates: [16.5621, 81.8942],
    batteryPct: 100,
    solarWatts: 180,
    signalStrengthDbm: -62,
    waterDischargeM3s: 14.0,
    lastPing: "Just now",
    firmwareVersion: "v3.1.0-sonde",
    operatorInCharge: "Automated Telemetry",
    healthScore: 99
  },
  {
    id: "ast-04",
    name: "MRV Station Beta (Mixing Zone)",
    code: "KSP-MRV-02",
    type: "mrv-station",
    status: "Active",
    catchment: "Kesinapalli Reach B",
    coordinates: [16.5184, 81.9318],
    batteryPct: 94,
    solarWatts: 175,
    signalStrengthDbm: -71,
    waterDischargeM3s: 15.6,
    lastPing: "2m ago",
    firmwareVersion: "v3.1.0-sonde",
    operatorInCharge: "Automated Telemetry",
    healthScore: 97
  },
  {
    id: "ast-05",
    name: "MRV Station Gamma (Downstream Verification)",
    code: "GDV-MRV-03",
    type: "mrv-station",
    status: "Active",
    catchment: "Amalapuram Confluence",
    coordinates: [16.5020, 81.9480],
    batteryPct: 91,
    solarWatts: 165,
    signalStrengthDbm: -78,
    waterDischargeM3s: 38.4,
    lastPing: "4m ago",
    firmwareVersion: "v3.1.0-sonde",
    operatorInCharge: "Automated Telemetry",
    healthScore: 96
  },
  {
    id: "ast-06",
    name: "MRV Station Delta (Marine Outfall)",
    code: "GDV-MRV-04",
    type: "mrv-station",
    status: "Active",
    catchment: "Yanam Delta Estuary",
    coordinates: [16.4820, 81.9650],
    batteryPct: 84,
    solarWatts: 190,
    signalStrengthDbm: -82,
    waterDischargeM3s: 64.2,
    lastPing: "6m ago",
    firmwareVersion: "v3.1.0-sonde",
    operatorInCharge: "Automated Telemetry",
    healthScore: 92
  },
  {
    id: "ast-07",
    name: "MDP-03 (Estuary Sentinel)",
    code: "GDV-MDP-03",
    type: "mobile-dosing",
    status: "Standby",
    catchment: "Yanam Port Basin",
    coordinates: [16.4710, 81.9820],
    batteryPct: 99,
    solarWatts: 360,
    signalStrengthDbm: -65,
    dosingRateKgHr: 0,
    slurryDensityGPerL: 1190,
    waterDischargeM3s: 0,
    lastPing: "5m ago",
    firmwareVersion: "v2.8.4-rt",
    operatorInCharge: "K. Rao",
    healthScore: 100
  },
  {
    id: "ast-08",
    name: "MRV Station Epsilon (Sonde Recalibration)",
    code: "GDV-MRV-05",
    type: "mrv-station",
    status: "Calibrating",
    catchment: "Razole Tributary Outfall",
    coordinates: [16.5310, 81.8710],
    batteryPct: 76,
    solarWatts: 120,
    signalStrengthDbm: -89,
    waterDischargeM3s: 9.8,
    lastPing: "12m ago",
    firmwareVersion: "v3.0.9-sonde",
    operatorInCharge: "Field Tech 02",
    healthScore: 81
  }
];

export const monitoringTimeseriesData: MonitoringTimeseriesPoint[] = [
  { time: "00:00", ph: 7.74, phCeiling: 8.50, phBaseline: 7.68, dissolvedOxygen: 6.95, temp: 25.8, turbidity: 6.8, alkalinityDosedKg: 85, co2DrawdownKg: 64 },
  { time: "02:00", ph: 7.78, phCeiling: 8.50, phBaseline: 7.69, dissolvedOxygen: 6.90, temp: 25.6, turbidity: 6.5, alkalinityDosedKg: 90, co2DrawdownKg: 68 },
  { time: "04:00", ph: 7.82, phCeiling: 8.50, phBaseline: 7.68, dissolvedOxygen: 6.85, temp: 25.4, turbidity: 6.4, alkalinityDosedKg: 95, co2DrawdownKg: 72 },
  { time: "06:00", ph: 7.89, phCeiling: 8.50, phBaseline: 7.70, dissolvedOxygen: 7.10, temp: 25.9, turbidity: 7.1, alkalinityDosedKg: 120, co2DrawdownKg: 91 },
  { time: "08:00", ph: 8.04, phCeiling: 8.50, phBaseline: 7.71, dissolvedOxygen: 7.35, temp: 26.4, turbidity: 8.2, alkalinityDosedKg: 160, co2DrawdownKg: 121 },
  { time: "10:00", ph: 8.22, phCeiling: 8.50, phBaseline: 7.72, dissolvedOxygen: 7.48, temp: 27.0, turbidity: 8.9, alkalinityDosedKg: 185, co2DrawdownKg: 140 },
  { time: "12:00", ph: 8.35, phCeiling: 8.50, phBaseline: 7.73, dissolvedOxygen: 7.60, temp: 27.6, turbidity: 9.4, alkalinityDosedKg: 195, co2DrawdownKg: 148 },
  { time: "14:00", ph: 8.38, phCeiling: 8.50, phBaseline: 7.74, dissolvedOxygen: 7.55, temp: 27.8, turbidity: 9.8, alkalinityDosedKg: 190, co2DrawdownKg: 144 },
  { time: "16:00", ph: 8.29, phCeiling: 8.50, phBaseline: 7.73, dissolvedOxygen: 7.42, temp: 27.4, turbidity: 8.7, alkalinityDosedKg: 175, co2DrawdownKg: 133 },
  { time: "18:00", ph: 8.16, phCeiling: 8.50, phBaseline: 7.71, dissolvedOxygen: 7.28, temp: 26.8, turbidity: 7.9, alkalinityDosedKg: 150, co2DrawdownKg: 114 },
  { time: "20:00", ph: 8.02, phCeiling: 8.50, phBaseline: 7.70, dissolvedOxygen: 7.15, temp: 26.4, turbidity: 7.2, alkalinityDosedKg: 125, co2DrawdownKg: 95 },
  { time: "22:00", ph: 7.91, phCeiling: 8.50, phBaseline: 7.69, dissolvedOxygen: 7.02, temp: 26.1, turbidity: 6.9, alkalinityDosedKg: 110, co2DrawdownKg: 83 }
];

export const subsystemHealthData: SubsystemHealth[] = [
  {
    id: "sub-1",
    name: "Optical In-situ pH & DO Sondes",
    category: "Sensors & Sondes",
    status: "nominal",
    metric: "±0.012 pH",
    target: "< ±0.030 pH drift",
    lastChecked: "4m ago",
    details: "All 18 multi-parameter glass & ISFET probes within verified calibration limits."
  },
  {
    id: "sub-2",
    name: "Cellular / Sat LoRaWAN Gateway",
    category: "IoT Telemetry",
    status: "nominal",
    metric: "118 ms latency",
    target: "< 250 ms latency",
    lastChecked: "Just now",
    details: "99.92% packet delivery rate. Dual redundancy failover enabled."
  },
  {
    id: "sub-3",
    name: "Slurry Dosing Peristaltic Actuation",
    category: "Dosing Actuation",
    status: "nominal",
    metric: "2.35 bar",
    target: "2.0 – 2.8 bar",
    lastChecked: "1m ago",
    details: "Flow variance < 1.2%. Automated line purge cycle active on MDP-01."
  },
  {
    id: "sub-4",
    name: "Fleet Solar & Battery Storage",
    category: "Power & Energy",
    status: "nominal",
    metric: "94% SoC",
    target: "> 40% SoC reserve",
    lastChecked: "3m ago",
    details: "1.84 kW peak solar harvesting currently offsetting fleet operating draw."
  },
  {
    id: "sub-5",
    name: "Mineral Slurry Consistency Index",
    category: "Dosing Actuation",
    status: "nominal",
    metric: "1.18 g/cm³",
    target: "1.15 – 1.22 g/cm³",
    lastChecked: "15m ago",
    details: "High shear continuous mixing active. Calcium silicate grain diameter: 45 µm."
  },
  {
    id: "sub-6",
    name: "Razole Tributary Sonde Calibration",
    category: "Sensors & Sondes",
    status: "warning",
    metric: "±0.038 pH",
    target: "< ±0.030 pH drift",
    lastChecked: "12m ago",
    details: "Turbidity biofilm deposit detected on secondary glass bulb. Auto-wiper scheduled."
  }
];

export const dashboardOperationalAlerts: AlertItemData[] = [
  {
    id: "d-alt-1",
    title: "Approaching Buffer Ceiling Limit",
    description: "MDP-01 local plume pH reached 8.38 (Safety threshold limit: 8.50 pH). Automatic feed modulation engaged.",
    timestamp: "8 mins ago",
    severity: "warning",
    category: "pH",
    stationName: "KSP-MDP-01",
    acknowledged: false
  },
  {
    id: "d-alt-2",
    title: "Station Epsilon Biofilm Notice",
    description: "Electrochemical sensor drift at ±0.038 pH. Automated wiper blade sweep initiated.",
    timestamp: "24 mins ago",
    severity: "warning",
    category: "System",
    stationName: "GDV-MRV-05",
    acknowledged: false
  },
  {
    id: "d-alt-3",
    title: "Automated Data Batch Ledger Ingest",
    description: "Ingested 12,480 telemetry rows. Cryptographic SHA-256 block hash #84920 verified.",
    timestamp: "1 hour ago",
    severity: "info",
    category: "Data Sync",
    stationName: "Ingest Gateway 01",
    acknowledged: true
  },
  {
    id: "d-alt-4",
    title: "Dosing Platform MDP-02 Nominal Sync",
    description: "Slurry peristaltic rate steady at 142.0 kg/hr. Dissolution kinetics matching model expectations.",
    timestamp: "2 hours ago",
    severity: "healthy",
    category: "Pump",
    stationName: "GDV-MDP-02",
    acknowledged: true
  },
  {
    id: "d-alt-5",
    title: "Baseline Water Quality Established",
    description: "Reach A background alkalinity 1,840 µeq/L; background pCO₂ 492 ppm.",
    timestamp: "4 hours ago",
    severity: "healthy",
    category: "System",
    stationName: "KSP-MRV-01",
    acknowledged: true
  }
];

/* ========================================================
   MODULE 2: MONITORING DATA
   ======================================================== */

export const sensorNodesData: SensorNode[] = [
  {
    id: "sen-01",
    code: "SN-PH-KSP01",
    stationName: "KSP-MRV-01 (Reach A)",
    parameter: "pH",
    unit: "pH",
    currentValue: 7.78,
    min24h: 7.68,
    max24h: 7.84,
    baselineVariance: "+0.02",
    status: "nominal",
    lastPing: "Just now",
    depthMeters: 1.2
  },
  {
    id: "sen-02",
    code: "SN-PH-KSP02",
    stationName: "KSP-MRV-02 (Reach B Plume)",
    parameter: "pH",
    unit: "pH",
    currentValue: 8.34,
    min24h: 7.72,
    max24h: 8.38,
    baselineVariance: "+0.58",
    status: "nominal",
    lastPing: "1m ago",
    depthMeters: 1.5
  },
  {
    id: "sen-03",
    code: "SN-DO-KSP01",
    stationName: "KSP-MRV-01 (Reach A)",
    parameter: "Dissolved Oxygen",
    unit: "mg/L",
    currentValue: 7.12,
    min24h: 6.85,
    max24h: 7.42,
    baselineVariance: "-0.05",
    status: "nominal",
    lastPing: "Just now",
    depthMeters: 1.2
  },
  {
    id: "sen-04",
    code: "SN-EC-KSP02",
    stationName: "KSP-MRV-02 (Reach B)",
    parameter: "Conductivity (EC)",
    unit: "µS/cm",
    currentValue: 518,
    min24h: 480,
    max24h: 535,
    baselineVariance: "+32",
    status: "nominal",
    lastPing: "2m ago",
    depthMeters: 1.5
  },
  {
    id: "sen-05",
    code: "SN-TURB-KSP01",
    stationName: "KSP-MRV-01 (Reach A)",
    parameter: "Turbidity",
    unit: "NTU",
    currentValue: 8.4,
    min24h: 6.2,
    max24h: 14.2,
    baselineVariance: "+1.8",
    status: "nominal",
    lastPing: "Just now",
    depthMeters: 1.2
  },
  {
    id: "sen-06",
    code: "SN-PCO2-GDV03",
    stationName: "GDV-MRV-03 (Confluence)",
    parameter: "pCO2",
    unit: "ppm",
    currentValue: 348,
    min24h: 340,
    max24h: 495,
    baselineVariance: "-147",
    status: "nominal",
    lastPing: "4m ago",
    depthMeters: 2.0
  },
  {
    id: "sen-07",
    code: "SN-PH-GDV05",
    stationName: "GDV-MRV-05 (Razole)",
    parameter: "pH",
    unit: "pH",
    currentValue: 7.88,
    min24h: 7.74,
    max24h: 8.02,
    baselineVariance: "+0.14",
    status: "warning",
    lastPing: "12m ago",
    depthMeters: 1.0
  }
];

export const dosingCyclesData: DosingCycle[] = [
  {
    id: "cyc-148",
    cycleNumber: 148,
    vesselName: "MDP-01 (Vessel Albatross)",
    catchment: "Kesinapalli Main Drain Reach B",
    startTime: "Today, 08:00 UTC",
    endTime: "Today, 14:00 UTC",
    durationMinutes: 360,
    targetRateKgHr: 180,
    totalReagentKg: 1083,
    status: "Completed",
    meanPlumePh: 8.28,
    operator: "Dr. Elena Vance"
  },
  {
    id: "cyc-149",
    cycleNumber: 149,
    vesselName: "MDP-02 (Delta Ranger)",
    catchment: "Godavari Mid Reach",
    startTime: "Today, 10:30 UTC",
    endTime: "In Progress",
    durationMinutes: 210,
    targetRateKgHr: 140,
    totalReagentKg: 490,
    status: "In Progress",
    meanPlumePh: 8.22,
    operator: "Marcus Chen"
  },
  {
    id: "cyc-150",
    cycleNumber: 150,
    vesselName: "MDP-01 (Vessel Albatross)",
    catchment: "Kesinapalli Lower Reach",
    startTime: "Scheduled 16:00 UTC",
    endTime: "Pending",
    durationMinutes: 240,
    targetRateKgHr: 160,
    totalReagentKg: 640,
    status: "Scheduled",
    meanPlumePh: 8.20,
    operator: "Dr. Elena Vance"
  }
];

export const gpsAssetTracksData: GpsAssetTrack[] = [
  {
    assetId: "ast-01",
    name: "MDP-01 (Vessel Albatross)",
    coordinates: [16.5412, 81.9125],
    headingDegrees: 142,
    speedKnots: 2.4,
    geofenceStatus: "Within Boundary",
    activeSwathLengthMeters: 4820,
    trail: [
      [16.5510, 81.9050],
      [16.5475, 81.9080],
      [16.5440, 81.9105],
      [16.5412, 81.9125]
    ]
  },
  {
    assetId: "ast-02",
    name: "MDP-02 (Delta Ranger)",
    coordinates: [16.5740, 81.8890],
    headingDegrees: 185,
    speedKnots: 3.1,
    geofenceStatus: "Within Boundary",
    activeSwathLengthMeters: 6140,
    trail: [
      [16.5890, 81.8820],
      [16.5820, 81.8850],
      [16.5740, 81.8890]
    ]
  }
];

/* ========================================================
   MODULE 3: MINERAL & DOSING DATA
   ======================================================== */

export const mineralFeedstocksData: MineralFeedstock[] = [
  {
    id: "min-01",
    name: "Calcium Silicate (Wollastonite Micro-powder)",
    chemicalFormula: "CaSiO3",
    stockpileTons: 148.5,
    capacityTons: 250.0,
    dailyConsumptionTons: 6.8,
    grainSizeMicrons: 45,
    purityPct: 98.4,
    reorderLevelTons: 40.0,
    supplier: "Deccan GeoMinerals Ltd",
    batchNumber: "WOL-2026-08",
    dateReceived: "18 Oct 2026",
    qualityStatus: "Approved"
  },
  {
    id: "min-02",
    name: "Magnesium Hydroxide Slurry Feedstock",
    chemicalFormula: "Mg(OH)2",
    stockpileTons: 62.0,
    capacityTons: 100.0,
    dailyConsumptionTons: 1.9,
    grainSizeMicrons: 32,
    purityPct: 99.1,
    reorderLevelTons: 25.0,
    supplier: "Coromandel Coastal Marine Reagents",
    batchNumber: "MGH-2026-03",
    dateReceived: "12 Oct 2026",
    qualityStatus: "Approved"
  },
  {
    id: "min-03",
    name: "Ultrafine Calcium Carbonate (Calcite Reagent)",
    chemicalFormula: "CaCO3",
    stockpileTons: 35.0,
    capacityTons: 80.0,
    dailyConsumptionTons: 0,
    grainSizeMicrons: 28,
    purityPct: 97.8,
    reorderLevelTons: 20.0,
    supplier: "Andhra Mineral Corporation",
    batchNumber: "CAL-2026-01",
    dateReceived: "26 Oct 2026",
    qualityStatus: "Awaiting Approval"
  },
  {
    id: "min-04",
    name: "Wollastonite Reserve (Fine Particle Feed)",
    chemicalFormula: "CaSiO3",
    stockpileTons: 40.0,
    capacityTons: 100.0,
    dailyConsumptionTons: 0,
    grainSizeMicrons: 40,
    purityPct: 98.6,
    reorderLevelTons: 20.0,
    supplier: "Deccan GeoMinerals Ltd",
    batchNumber: "WOL-2026-09",
    dateReceived: "27 Oct 2026",
    qualityStatus: "Under Inspection"
  }
];

export const slurryMixerTanksData: SlurryMixerTank[] = [
  {
    id: "tnk-01",
    tankName: "Mixer Tank 1 (Primary Feed)",
    status: "Mixing",
    volumeLiters: 4800,
    capacityLiters: 6000,
    densityGPerL: 1182,
    viscosityCP: 42,
    motorRpm: 450,
    temperatureC: 28.4
  },
  {
    id: "tnk-02",
    tankName: "Mixer Tank 2 (Auxiliary Standby)",
    status: "Ready",
    volumeLiters: 5800,
    capacityLiters: 6000,
    densityGPerL: 1178,
    viscosityCP: 39,
    motorRpm: 120,
    temperatureC: 27.9
  }
];

export const pumpControllersData: PumpController[] = [
  {
    id: "pmp-01",
    pumpName: "Peristaltic Dosing Pump Alpha (MDP-01)",
    vesselCode: "KSP-MDP-01",
    status: "Running",
    mode: "Auto (Velocity Proportional)",
    speedRpm: 185,
    flowRateLPerMin: 28.5,
    pressureBar: 2.35,
    hoseWearPct: 24
  },
  {
    id: "pmp-02",
    pumpName: "Peristaltic Dosing Pump Beta (MDP-02)",
    vesselCode: "GDV-MDP-02",
    status: "Running",
    mode: "Auto (Velocity Proportional)",
    speedRpm: 142,
    flowRateLPerMin: 22.0,
    pressureBar: 2.18,
    hoseWearPct: 38
  },
  {
    id: "pmp-03",
    pumpName: "Emergency Injection High-Rate Pump",
    vesselCode: "KSP-MDP-01",
    status: "Standby",
    mode: "Manual Fixed",
    speedRpm: 0,
    flowRateLPerMin: 0,
    pressureBar: 0.1,
    hoseWearPct: 5
  }
];

export const slurryBatchesData: SlurryBatchRecord[] = [
  {
    id: "slr-01",
    batchNumber: "SLR-2026-441",
    mineralBatchId: "min-01",
    mineralType: "Calcium Silicate (CaSiO3)",
    mineralMassKg: 1200,
    waterQuantityLiters: 4000,
    totalVolumeLiters: 4428,
    concentrationGPerL: 271,
    densityGPerL: 1182,
    tankId: "tnk-01",
    tankName: "Mixer Tank 1 (Primary Feed)",
    status: "Preparing",
    preparedBy: "Marcus Chen",
    preparationDate: "Today, 09:45 UTC"
  },
  {
    id: "slr-02",
    batchNumber: "SLR-2026-442",
    mineralBatchId: "min-01",
    mineralType: "Calcium Silicate (CaSiO3)",
    mineralMassKg: 1450,
    waterQuantityLiters: 4800,
    totalVolumeLiters: 5318,
    concentrationGPerL: 273,
    densityGPerL: 1178,
    tankId: "tnk-02",
    tankName: "Mixer Tank 2 (Auxiliary Standby)",
    status: "Ready",
    preparedBy: "Dr. Elena Vance",
    preparationDate: "Today, 07:15 UTC"
  },
  {
    id: "slr-03",
    batchNumber: "SLR-2026-440",
    mineralBatchId: "min-02",
    mineralType: "Magnesium Hydroxide (Mg(OH)2)",
    mineralMassKg: 800,
    waterQuantityLiters: 3200,
    totalVolumeLiters: 3533,
    concentrationGPerL: 226,
    densityGPerL: 1165,
    tankId: "tnk-01",
    tankName: "Mixer Tank 1",
    status: "Ready",
    preparedBy: "Dr. Elena Vance",
    preparationDate: "Yesterday, 14:00 UTC"
  }
];

export const dosingPlansData: DosingPlan[] = [
  {
    id: "plan-01",
    planCode: "PLAN-2026-149",
    siteName: "Godavari Mid Reach (Reach B)",
    assetName: "MDP-02 (Delta Ranger)",
    slurryBatchCode: "SLR-2026-441",
    targetRateKgHr: 140,
    targetQuantityKg: 700,
    durationMinutes: 300,
    maxPlumePh: 8.45,
    maxPressureBar: 2.8,
    status: "Approved",
    operator: "Marcus Chen",
    createdDate: "Today, 09:30 UTC"
  },
  {
    id: "plan-02",
    planCode: "PLAN-2026-150",
    siteName: "Kesinapalli Lower Reach",
    assetName: "MDP-01 (Vessel Albatross)",
    slurryBatchCode: "SLR-2026-442",
    targetRateKgHr: 160,
    targetQuantityKg: 640,
    durationMinutes: 240,
    maxPlumePh: 8.40,
    maxPressureBar: 2.5,
    status: "Queued",
    operator: "Dr. Elena Vance",
    createdDate: "Today, 11:00 UTC"
  },
  {
    id: "plan-03",
    planCode: "PLAN-2026-151",
    siteName: "Yanam Estuary Outfall",
    assetName: "MDP-03 (Estuary Sentinel)",
    slurryBatchCode: "SLR-2026-440",
    targetRateKgHr: 120,
    targetQuantityKg: 480,
    durationMinutes: 240,
    maxPlumePh: 8.35,
    maxPressureBar: 2.4,
    status: "Draft",
    operator: "Dr. Elena Vance",
    createdDate: "Today, 14:15 UTC"
  }
];

export const dosingReconciliationData: DosingReconciliationRecord[] = [
  {
    id: "rec-01",
    cycleNumber: 148,
    vesselName: "MDP-01 (Vessel Albatross)",
    siteName: "Kesinapalli Main Drain Reach B",
    slurryBatchCode: "SLR-2026-440",
    plannedQuantityKg: 1080,
    actualQuantityKg: 1083,
    variancePct: 0.28,
    slurryVolumeReconciledL: 3610,
    startTime: "Today, 08:00 UTC",
    endTime: "Today, 14:00 UTC",
    meanPlumePh: 8.28,
    auditStatus: "Audited & Verified",
    auditor: "Sarah Jenkins, PE (DNV)"
  },
  {
    id: "rec-02",
    cycleNumber: 147,
    vesselName: "MDP-02 (Delta Ranger)",
    siteName: "Godavari Upstream Reach A",
    slurryBatchCode: "SLR-2026-439",
    plannedQuantityKg: 950,
    actualQuantityKg: 946,
    variancePct: -0.42,
    slurryVolumeReconciledL: 3150,
    startTime: "Yesterday, 07:30 UTC",
    endTime: "Yesterday, 13:30 UTC",
    meanPlumePh: 8.24,
    auditStatus: "Audited & Verified",
    auditor: "Sarah Jenkins, PE (DNV)"
  },
  {
    id: "rec-03",
    cycleNumber: 146,
    vesselName: "MDP-01 (Vessel Albatross)",
    siteName: "Kesinapalli Mid Channel",
    slurryBatchCode: "SLR-2026-438",
    plannedQuantityKg: 1200,
    actualQuantityKg: 1208,
    variancePct: 0.67,
    slurryVolumeReconciledL: 4020,
    startTime: "26 Oct 2026, 08:00 UTC",
    endTime: "26 Oct 2026, 14:30 UTC",
    meanPlumePh: 8.31,
    auditStatus: "Audited & Verified",
    auditor: "Rajesh Nair"
  }
];

/* ========================================================
   MODULE 4: CARBON REMOVAL DATA
   ======================================================== */

export const carbonateChemistryData: CarbonateChemistryState = {
  catchment: "Godavari Delta Basin Catchment System",
  baselineDicUmolKg: 1920,
  postDosingDicUmolKg: 2115,
  deltaDicUmolKg: 195,
  baselineTotalAlkalinityUeqKg: 2050,
  postDosingTotalAlkalinityUeqKg: 2280,
  deltaTotalAlkalinityUeqKg: 230,
  baselinePco2Ppm: 512,
  postDosingPco2Ppm: 334,
  deltaPco2Ppm: -178,
  calciteSaturationOmega: 1.44, // Safe: < 2.5
  aragoniteSaturationOmega: 1.12
};

export const carbonRemovalAccountingData: CarbonRemovalAccounting = {
  grossRemovedTons: 884.2,
  scope1Scope2DeductionsTons: 41.4,
  netCreditableTons: 842.8,
  confidenceIntervalPct: 95.8,
  durabilityYears: 10000,
  discountBufferReservePct: 5.0
};

export const mrvReportPackagesData: MrvReportPackage[] = [
  {
    id: "rep-01",
    reportBatchCode: "MRV-GDV-2026-Q3-01",
    period: "Q3 2026 (July - September)",
    catchment: "Godavari Delta / Kesinapalli Drain",
    totalNetCo2Tonnes: 524.6,
    verificationStatus: "Audited & Verified",
    sha256Hash: "8a9f24c8b910e14d88e0b234199c09d84f88e109d9431718bc889a712f913d09",
    standardAlignment: "ISO 14064-2 & Gold Standard CDR",
    verifier: "Bureau Veritas Climate Services",
    issuedDate: "2026-10-04"
  },
  {
    id: "rep-02",
    reportBatchCode: "MRV-GDV-2026-M10",
    period: "October 2026 Month-to-Date",
    catchment: "Godavari Delta / Kesinapalli Drain",
    totalNetCo2Tonnes: 318.2,
    verificationStatus: "Pending Third-Party Sign-off",
    sha256Hash: "3f882199b4d89a77c104e8832a90184b9148d88e221190bc7784a9103c847712",
    standardAlignment: "ISO 14064-2 & Frontier CDR",
    verifier: "DNV Energy Systems",
    issuedDate: "2026-10-25"
  }
];

/* ========================================================
   MODULE 5: USER MANAGEMENT DATA
   ======================================================== */

export const userAccountsData: UserAccount[] = [
  {
    id: "usr-01",
    name: "Dr. Elena Vance",
    email: "operator@carbonlantis.com",
    role: "Lead MRV Scientist",
    clearanceLevel: "Level 3: Full Catchment Verification & Dosing Control",
    status: "Active",
    twoFactorEnabled: true,
    lastActive: "Just now",
    assignedCatchment: "Godavari Delta (All Reaches)"
  },
  {
    id: "usr-02",
    name: "Marcus Chen",
    email: "m.chen@carbonlantis.com",
    role: "Field Dosing Engineer",
    clearanceLevel: "Level 2: Platform Telemetry & Pump Modulation",
    status: "Active",
    twoFactorEnabled: true,
    lastActive: "15m ago",
    assignedCatchment: "MDP-02 Delta Ranger"
  },
  {
    id: "usr-03",
    name: "Sarah Jenkins, PE",
    email: "s.jenkins@dnv-verifier.org",
    role: "Accredited Verifier",
    clearanceLevel: "Auditor: Cryptographic Ledger & Raw Telemetry (Read-Only)",
    status: "Active",
    twoFactorEnabled: true,
    lastActive: "2 hours ago",
    assignedCatchment: "Independent Verifier Portal"
  },
  {
    id: "usr-04",
    name: "Rajesh Nair",
    email: "r.nair@carbonlantis.com",
    role: "Enterprise Administrator",
    clearanceLevel: "Level 4: Superuser System Provisioning & Secrets",
    status: "Active",
    twoFactorEnabled: true,
    lastActive: "1 hour ago",
    assignedCatchment: "Global Operations"
  }
];

export const activityLogsData: ActivityLogItem[] = [
  {
    id: "log-01",
    timestamp: "10 mins ago",
    userName: "Dr. Elena Vance",
    action: "Updated Peristaltic Dosing Setpoint to 180.5 kg/hr",
    resource: "MDP-01 (KSP-MDP-01)",
    ipAddress: "192.168.1.104 (Encrypted Gateway VPN)",
    status: "Success"
  },
  {
    id: "log-02",
    timestamp: "45 mins ago",
    userName: "System Watchdog",
    action: "Verified Cryptographic SHA-256 Telemetry Ingest Block #84920",
    resource: "DRF Ingest API",
    ipAddress: "10.0.4.12 (Internal RPC)",
    status: "Success"
  },
  {
    id: "log-03",
    timestamp: "2 hours ago",
    userName: "Sarah Jenkins, PE",
    action: "Exported Certified Baseline MRV Ledger (CSV + Audit Signature)",
    resource: "Report #MRV-GDV-2026-Q3-01",
    ipAddress: "142.250.180.45",
    status: "Success"
  },
  {
    id: "log-04",
    timestamp: "4 hours ago",
    userName: "Marcus Chen",
    action: "Initiated Line Purge Sequence on Slurry Injector Nozzle 2",
    resource: "MDP-02 (GDV-MDP-02)",
    ipAddress: "192.168.1.112",
    status: "Success"
  }
];

/* ========================================================
   MODULE 6: SETTINGS DATA
   ======================================================== */

export const backupHistoryData: BackupHistoryRecord[] = [
  {
    id: "bak-01",
    timestamp: "Today, 14:00 UTC",
    type: "Hourly Telemetry Snapshot",
    sizeMb: 42.4,
    checksum: "sha256:d894e14f88b901...",
    status: "Stored (Encrypted S3/Cloud)"
  },
  {
    id: "bak-02",
    timestamp: "Today, 13:00 UTC",
    type: "Hourly Telemetry Snapshot",
    sizeMb: 41.8,
    checksum: "sha256:77a114f091c842...",
    status: "Stored (Encrypted S3/Cloud)"
  },
  {
    id: "bak-03",
    timestamp: "Yesterday, 23:59 UTC",
    type: "Full Ledger & Calibration Archive",
    sizeMb: 894.2,
    checksum: "sha256:399c44b9148e02...",
    status: "Stored (Encrypted S3/Cloud)"
  }
];

export const assetConfigData: AssetConfigItem[] = [
  {
    id: "cfg-01",
    assetCode: "KSP-MDP-01",
    name: "MDP-01 (Vessel Albatross)",
    type: "Mobile Dosing Vessel",
    maxPhCeiling: 8.50,
    warningPhThreshold: 8.35,
    telemetryIntervalSec: 1
  },
  {
    id: "cfg-02",
    assetCode: "GDV-MDP-02",
    name: "MDP-02 (Delta Ranger)",
    type: "Mobile Dosing Vessel",
    maxPhCeiling: 8.50,
    warningPhThreshold: 8.35,
    telemetryIntervalSec: 1
  },
  {
    id: "cfg-03",
    assetCode: "KSP-MRV-01",
    name: "MRV Station Alpha (Upstream Baseline)",
    type: "Continuous Sonde Array",
    maxPhCeiling: 8.50,
    warningPhThreshold: 8.35,
    telemetryIntervalSec: 5
  }
];
