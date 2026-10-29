export type DeploymentType = 'mobile-dosing' | 'mrv-station' | 'planned';
export type DeploymentStatus = 'Active' | 'Calibrating' | 'Planned' | 'Maintenance' | 'Standby';

export interface StatItem {
  id: string;
  metric: string;
  label: string;
  supportingText: string;
  iconName: 'chart' | 'layers' | 'sensor';
  accentColor: 'blue' | 'green' | 'violet';
  note?: string;
}

export interface DeploymentSite {
  id: string;
  name: string;
  siteCode: string;
  region: string;
  type: DeploymentType;
  status: DeploymentStatus;
  coordinates: [number, number]; // [latitude, longitude]
  waterBody: string;
  lastReading?: {
    ph: number;
    do: number; // mg/L
    temp: number; // °C
    ec: number; // µS/cm
    turbidity?: number; // NTU
    timestamp: string;
  };
  description: string;
}

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'healthy';
export type AlertCategory = 'pH' | 'Turbidity' | 'Data Sync' | 'System' | 'Pump';

export interface AlertItemData {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  severity: AlertSeverity;
  category: AlertCategory;
  stationName?: string;
  acknowledged?: boolean;
}

export interface PublicHomeData {
  hero: {
    eyebrow: string;
    headingPrefix: string;
    headingAccent: string;
    supportingHeadline: string;
    description: string;
    heroImage: string;
  };
  stats: StatItem[];
  deployments: DeploymentSite[];
  alerts: AlertItemData[];
  isDemonstrationData: boolean;
  demoDisclaimer: string;
}

/* ========================================================
   AUTHENTICATED MRV DASHBOARD DOMAIN TYPES
   ======================================================== */

export type DashboardTabId =
  | 'dashboard'
  | 'monitoring'
  | 'mineral-dosing'
  | 'carbon-removal'
  | 'users'
  | 'settings';

export interface OperationalAsset {
  id: string;
  name: string;
  code: string;
  type: 'mobile-dosing' | 'mrv-station' | 'buoy-gateway';
  status: DeploymentStatus;
  catchment: string;
  coordinates: [number, number];
  batteryPct: number;
  solarWatts: number;
  signalStrengthDbm: number;
  dosingRateKgHr?: number;
  slurryDensityGPerL?: number;
  waterDischargeM3s?: number;
  lastPing: string;
  firmwareVersion: string;
  operatorInCharge: string;
  healthScore: number;
}

export interface MonitoringTimeseriesPoint {
  time: string;
  ph: number;
  phCeiling: number;
  phBaseline: number;
  dissolvedOxygen: number; // mg/L
  temp: number; // °C
  turbidity: number; // NTU
  alkalinityDosedKg: number;
  co2DrawdownKg: number;
}

export interface SubsystemHealth {
  id: string;
  name: string;
  category: 'IoT Telemetry' | 'Sensors & Sondes' | 'Dosing Actuation' | 'Power & Energy';
  status: 'nominal' | 'warning' | 'degraded';
  metric: string;
  target: string;
  lastChecked: string;
  details: string;
}

export interface DashboardOverviewKpis {
  cumulativeCo2RemovedTonnes: number;
  netAlkalinityInjectedTons: number;
  activeDeploymentsCount: number;
  totalDeploymentsCount: number;
  averageDeltaPh: number;
  realtimeSensorsCount: number;
  telemetryIngestRatePps: number;
  systemReliabilityPct: number;
  criticalAlertsCount: number;
  warningAlertsCount: number;
}

/* --- 2. Monitoring Domain Types --- */
export interface SensorNode {
  id: string;
  code: string;
  stationName: string;
  parameter: 'pH' | 'Dissolved Oxygen' | 'Conductivity (EC)' | 'Temperature' | 'Turbidity' | 'pCO2';
  unit: string;
  currentValue: number;
  min24h: number;
  max24h: number;
  baselineVariance: string;
  status: 'nominal' | 'calibrating' | 'warning';
  lastPing: string;
  depthMeters: number;
}

export interface DosingCycle {
  id: string;
  cycleNumber: number;
  vesselName: string;
  catchment: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  targetRateKgHr: number;
  totalReagentKg: number;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Aborted';
  meanPlumePh: number;
  operator: string;
}

export interface GpsAssetTrack {
  assetId: string;
  name: string;
  coordinates: [number, number];
  headingDegrees: number;
  speedKnots: number;
  geofenceStatus: 'Within Boundary' | 'Approaching Edge' | 'Outside Boundary';
  activeSwathLengthMeters: number;
  trail: [number, number][];
}

export type DosingSubmoduleTab =
  | 'inventory'
  | 'preparation'
  | 'setup'
  | 'operations'
  | 'history';

export interface DosingPlan {
  id: string;
  planCode: string;
  siteName: string;
  assetName: string;
  slurryBatchCode: string;
  targetRateKgHr: number;
  targetQuantityKg: number;
  durationMinutes: number;
  maxPlumePh: number;
  maxPressureBar: number;
  status: 'Draft' | 'Validated' | 'Approved' | 'Queued';
  operator: string;
  createdDate: string;
}

export interface SlurryBatchRecord {
  id: string;
  batchNumber: string;
  mineralBatchId: string;
  mineralType: string;
  mineralMassKg: number;
  waterQuantityLiters: number;
  totalVolumeLiters: number;
  concentrationGPerL: number;
  densityGPerL: number;
  tankId: string;
  tankName: string;
  status: 'Draft' | 'Preparing' | 'Ready' | 'Rejected';
  preparedBy: string;
  preparationDate: string;
}

export interface DosingReconciliationRecord {
  id: string;
  cycleNumber: number;
  vesselName: string;
  siteName: string;
  slurryBatchCode: string;
  plannedQuantityKg: number;
  actualQuantityKg: number;
  variancePct: number;
  slurryVolumeReconciledL: number;
  startTime: string;
  endTime: string;
  meanPlumePh: number;
  auditStatus: 'Audited & Verified' | 'Requires Review' | 'Flagged Deviation';
  auditor: string;
}

/* --- 3. Mineral & Dosing Domain Types --- */
export interface MineralFeedstock {
  id: string;
  name: string;
  chemicalFormula: string;
  stockpileTons: number;
  capacityTons: number;
  dailyConsumptionTons: number;
  grainSizeMicrons: number;
  purityPct: number;
  reorderLevelTons: number;
  supplier: string;
  batchNumber: string;
  dateReceived?: string;
  qualityStatus?: 'Approved' | 'Awaiting Approval' | 'Under Inspection' | 'Quarantine';
}

export interface SlurryMixerTank {
  id: string;
  tankName: string;
  status: 'Mixing' | 'Ready' | 'Filling' | 'Maintenance';
  volumeLiters: number;
  capacityLiters: number;
  densityGPerL: number;
  viscosityCP: number;
  motorRpm: number;
  temperatureC: number;
}

export interface PumpController {
  id: string;
  pumpName: string;
  vesselCode: string;
  status: 'Running' | 'Standby' | 'Purging' | 'Fault';
  mode: 'Auto (Velocity Proportional)' | 'Manual Fixed' | 'Tidal Modulated';
  speedRpm: number;
  flowRateLPerMin: number;
  pressureBar: number;
  hoseWearPct: number;
}

/* --- 4. Carbon Removal Domain Types --- */
export interface CarbonateChemistryState {
  catchment: string;
  baselineDicUmolKg: number;
  postDosingDicUmolKg: number;
  deltaDicUmolKg: number;
  baselineTotalAlkalinityUeqKg: number;
  postDosingTotalAlkalinityUeqKg: number;
  deltaTotalAlkalinityUeqKg: number;
  baselinePco2Ppm: number;
  postDosingPco2Ppm: number;
  deltaPco2Ppm: number;
  calciteSaturationOmega: number;
  aragoniteSaturationOmega: number;
}

export interface CarbonRemovalAccounting {
  grossRemovedTons: number;
  scope1Scope2DeductionsTons: number;
  netCreditableTons: number;
  confidenceIntervalPct: number;
  durabilityYears: number;
  discountBufferReservePct: number;
}

export interface MrvReportPackage {
  id: string;
  reportBatchCode: string;
  period: string;
  catchment: string;
  totalNetCo2Tonnes: number;
  verificationStatus: 'Audited & Verified' | 'Pending Third-Party Sign-off' | 'Draft Generation';
  sha256Hash: string;
  standardAlignment: string;
  verifier: string;
  issuedDate: string;
}

/* --- 5. User Management Domain Types --- */
export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Enterprise Administrator' | 'Lead MRV Scientist' | 'Field Dosing Engineer' | 'Accredited Verifier';
  clearanceLevel: string;
  status: 'Active' | 'Invited' | 'Suspended';
  twoFactorEnabled: boolean;
  lastActive: string;
  assignedCatchment: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Auth Failure';
}

/* --- 6. Settings Domain Types --- */
export interface BackupHistoryRecord {
  id: string;
  timestamp: string;
  type: 'Hourly Telemetry Snapshot' | 'Full Ledger & Calibration Archive';
  sizeMb: number;
  checksum: string;
  status: 'Stored (Encrypted S3/Cloud)' | 'Verifying';
}

export interface AssetConfigItem {
  id: string;
  assetCode: string;
  name: string;
  type: string;
  maxPhCeiling: number;
  warningPhThreshold: number;
  telemetryIntervalSec: number;
}
