import { PublicHomeData } from '../types';

export const publicHomeData: PublicHomeData = {
  hero: {
    eyebrow: "INLAND WATER ALKALINITY ENHANCEMENT (IWAE)",
    headingPrefix: "CARBONLANTIS ",
    headingAccent: "MRV",
    supportingHeadline: "Monitoring. Measuring. Verifying. Real-world Carbon Removal.",
    description: "Data-driven MRV platform for precision alkalinity dosing in inland waters to enhance carbon removal and support healthier waterways.",
    // High-resolution realistic environmental photography of an inland waterway / river delta
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80"
  },
  stats: [
    {
      id: "stat-parameters",
      metric: "1.2M+",
      label: "Data Parameters",
      supportingText: "Water quality, dosing flow, GPS and system data.",
      iconName: "chart",
      accentColor: "blue",
      note: "Sample demonstration metric; live telemetry stream requires enterprise authorization."
    },
    {
      id: "stat-deployments",
      metric: "12+",
      label: "Asset Deployments",
      supportingText: "Mobile dosing platforms, MRV stations and pilot sites.",
      iconName: "layers",
      accentColor: "green",
      note: "Configurable demo count across active pilot catchments."
    },
    {
      id: "stat-sensors",
      metric: "200+",
      label: "Real-time Sensor Nodes",
      supportingText: "pH, EC, CO₂, DO, turbidity, temperature and more.",
      iconName: "sensor",
      accentColor: "violet",
      note: "Continuous optical and electrochemical sensing nodes."
    }
  ],
  deployments: [
    {
      id: "dep-1",
      name: "MDP-01: Mobile Dosing Platform",
      siteCode: "KSP-MDP-01",
      region: "Godavari Delta, Andhra Pradesh",
      type: "mobile-dosing",
      status: "Active",
      coordinates: [16.5412, 81.9125], // Kesinapalli Drain region
      waterBody: "Kesinapalli Main Drain",
      lastReading: {
        ph: 8.24,
        do: 7.35,
        temp: 26.8,
        ec: 512,
        turbidity: 8.4,
        timestamp: "10 mins ago"
      },
      description: "Autonomous solar-assisted vessel equipped with slurry mixing chamber and variable-rate peristaltic dosing injection."
    },
    {
      id: "dep-2",
      name: "MRV Station Alpha (Upstream Baseline)",
      siteCode: "KSP-MRV-01",
      region: "Godavari Delta, Andhra Pradesh",
      type: "mrv-station",
      status: "Active",
      coordinates: [16.5621, 81.8942],
      waterBody: "Kesinapalli Drain Reach A",
      lastReading: {
        ph: 7.78,
        do: 6.90,
        temp: 26.4,
        ec: 480,
        turbidity: 6.2,
        timestamp: "5 mins ago"
      },
      description: "Fixed multiparameter monitoring sonde establishing background alkalinity, baseline pCO2, and discharge velocity."
    },
    {
      id: "dep-3",
      name: "MRV Station Beta (Downstream Verification)",
      siteCode: "KSP-MRV-02",
      region: "Godavari Delta, Andhra Pradesh",
      type: "mrv-station",
      status: "Active",
      coordinates: [16.5184, 81.9318],
      waterBody: "Delta Confluence Reach B",
      lastReading: {
        ph: 8.18,
        do: 7.42,
        temp: 27.1,
        ec: 524,
        turbidity: 9.1,
        timestamp: "8 mins ago"
      },
      description: "Downstream sensor station measuring alkalinity propagation, dissolution efficiency, and net atmospheric CO2 drawdown."
    },
    {
      id: "dep-4",
      name: "Estuary Confluence Node (Planned)",
      siteCode: "GDV-PLN-01",
      region: "Godavari Delta, Andhra Pradesh",
      type: "planned",
      status: "Planned",
      coordinates: [16.4820, 81.9650],
      waterBody: "Godavari Estuary Outfall",
      description: "Scheduled Phase 2 deployment to evaluate marine transition kinetics and durable ocean bicarbonate storage."
    }
  ],
  alerts: [
    {
      id: "alt-1",
      title: "High pH Alert",
      description: "Dosing station pH at 8.38 approaching configured threshold ceiling (8.50 pH).",
      timestamp: "12 mins ago",
      severity: "warning",
      category: "pH",
      stationName: "KSP-MDP-01"
    },
    {
      id: "alt-2",
      title: "Turbidity Warning",
      description: "Increased turbidity (14.2 NTU) detected following upstream precipitation event.",
      timestamp: "45 mins ago",
      severity: "warning",
      category: "Turbidity",
      stationName: "KSP-MRV-01"
    },
    {
      id: "alt-3",
      title: "Data Sync Completed",
      description: "Telemetry batch verified: 3,420 multi-parameter records ingested from Delta nodes.",
      timestamp: "1 hour ago",
      severity: "info",
      category: "Data Sync",
      stationName: "Gateway-Delta-01"
    },
    {
      id: "alt-4",
      title: "System Healthy",
      description: "All optical dissolved oxygen and glass pH sensors reporting within ±0.01 calibration limits.",
      timestamp: "3 hours ago",
      severity: "healthy",
      category: "System",
      stationName: "Fleet Wide"
    },
    {
      id: "alt-5",
      title: "Pump Status: Cycle Concluded",
      description: "Dosing cycle #248 completed successfully: 180 kg mineral feed injected at target flow.",
      timestamp: "5 hours ago",
      severity: "info",
      category: "Pump",
      stationName: "KSP-MDP-01"
    }
  ],
  isDemonstrationData: true,
  demoDisclaimer: "Demonstration Data: Figures, coordinates, and alerts shown are reference demonstration assets based on pilot feasibility studies in the Godavari Delta. Operational telemetry, real-time dosing actuation, and certified carbon removal certificates require authenticated access."
};

