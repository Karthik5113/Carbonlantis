import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface TankBatchConstituent {
  batchId: string;
  mineralType: string;
  mineralMassKg: number;
  waterQuantityLiters: number;
  slurryVolumeLiters: number;
  supplier: string;
  origin: string;
  dateAdded: string;
  status: string;
}

export interface TankStorageData {
  id: 'T001' | 'T002';
  name: string;
  capacityLiters: number; // strictly 1,000 Litres
  currentVolumeLiters: number;
  densityKgPerL: number;
  ph: number;
  motorRpm: number;
  status: 'Ready' | 'Mixing' | 'Standby' | 'Low';
  batches: TankBatchConstituent[];
}

export interface SlurryHistoryEvent {
  id: string;
  timestamp: string;
  type: 'BATCH_CREATED' | 'TRIP_DISPATCH' | 'TANK_FLUSH';
  title: string;
  description: string;
  tankId: 'T001' | 'T002';
  volumeDeltaLiters: number; // e.g. +380 or -250
  batchId?: string;
  assetName?: string;
}

export interface DosingTripRecord {
  id: string;
  tripCode: string;
  assetName: string;
  tankId: 'T001' | 'T002';
  batchId: string;
  mineralType: string;
  quantityLiters: number;
  catchmentReach: string;
  dosingRateLPerHr: number;
  scheduledDate: string;
  scheduledTime: string;
  status: 'In Transit' | 'Active Dosing' | 'Scheduled' | 'Completed';
  operator: string;
  notes?: string;
  createdAt: string;
}

interface SlurryDosingContextType {
  tanks: TankStorageData[];
  slurryEventsHistory: SlurryHistoryEvent[];
  dosingTrips: DosingTripRecord[];
  createSlurryBatch: (batchData: TankBatchConstituent, tankId: 'T001' | 'T002') => void;
  createDosingTrip: (tripInput: Omit<DosingTripRecord, 'id' | 'tripCode' | 'createdAt'>) => DosingTripRecord;
  flushTank: (tankId: 'T001' | 'T002') => void;
}

const INITIAL_TANKS: TankStorageData[] = [
  {
    id: 'T001',
    name: 'Mixer Tank T001',
    capacityLiters: 1000,
    currentVolumeLiters: 650,
    densityKgPerL: 1.36,
    ph: 9.6,
    motorRpm: 120,
    status: 'Ready',
    batches: [
      {
        batchId: 'MB-2026-001',
        mineralType: 'Olivine (Mg₂SiO₄)',
        mineralMassKg: 240,
        waterQuantityLiters: 290,
        slurryVolumeLiters: 380,
        supplier: 'Deccan Minerals Corp',
        origin: 'Salem Ultramafic Reach, TN',
        dateAdded: '28 Oct 2026, 09:15',
        status: 'MRV Certified'
      },
      {
        batchId: 'MB-2026-002',
        mineralType: 'Calcium Silicate (CaSiO₃)',
        mineralMassKg: 170,
        waterQuantityLiters: 205,
        slurryVolumeLiters: 270,
        supplier: 'AP Silicates Pvt Ltd',
        origin: 'Kadapa Sourcing Mine, AP',
        dateAdded: '30 Oct 2026, 14:40',
        status: 'MRV Certified'
      }
    ]
  },
  {
    id: 'T002',
    name: 'Mixer Tank T002',
    capacityLiters: 1000,
    currentVolumeLiters: 300,
    densityKgPerL: 1.32,
    ph: 9.4,
    motorRpm: 120,
    status: 'Ready',
    batches: [
      {
        batchId: 'MB-2026-003',
        mineralType: 'Basalt Mineral Dust (< 35µm)',
        mineralMassKg: 190,
        waterQuantityLiters: 230,
        slurryVolumeLiters: 300,
        supplier: 'Eastern Ghats Mining Hub',
        origin: 'Visakhapatnam Quarry Reach, AP',
        dateAdded: '31 Oct 2026, 11:20',
        status: 'MRV Certified'
      }
    ]
  }
];

const INITIAL_SLURRY_EVENTS: SlurryHistoryEvent[] = [
  {
    id: 'evt-1',
    timestamp: 'Today, 05:45 AM',
    type: 'TRIP_DISPATCH',
    title: 'Dispatched 220 L to AquaDrone_MVP_001',
    description: 'Transferred from Tank T001 (MB-2026-001) for active dosing trip TRIP-2026-012',
    tankId: 'T001',
    volumeDeltaLiters: -220,
    batchId: 'MB-2026-001',
    assetName: 'AquaDrone_MVP_001'
  },
  {
    id: 'evt-2',
    timestamp: '30 Oct 2026, 14:40',
    type: 'BATCH_CREATED',
    title: 'Slurry Batch MB-2026-002 Loaded',
    description: 'Prepared 270 L Calcium Silicate slurry loaded into Tank T001',
    tankId: 'T001',
    volumeDeltaLiters: 270,
    batchId: 'MB-2026-002'
  },
  {
    id: 'evt-3',
    timestamp: '28 Oct 2026, 09:15',
    type: 'BATCH_CREATED',
    title: 'Slurry Batch MB-2026-001 Loaded',
    description: 'Prepared 380 L Olivine slurry loaded into Tank T001',
    tankId: 'T001',
    volumeDeltaLiters: 380,
    batchId: 'MB-2026-001'
  },
  {
    id: 'evt-4',
    timestamp: '27 Oct 2026, 16:30',
    type: 'BATCH_CREATED',
    title: 'Slurry Batch MB-2026-003 Loaded',
    description: 'Prepared 300 L Basalt mineral slurry loaded into Tank T002',
    tankId: 'T002',
    volumeDeltaLiters: 300,
    batchId: 'MB-2026-003'
  }
];

const INITIAL_DOSING_TRIPS: DosingTripRecord[] = [
  {
    id: 'trip-1',
    tripCode: 'TRIP-2026-012',
    assetName: 'AquaDrone_MVP_001',
    tankId: 'T001',
    batchId: 'MB-2026-001',
    mineralType: 'Olivine (Mg₂SiO₄)',
    quantityLiters: 220,
    catchmentReach: 'Kesinapalli Canal Reach 1 (Godavari Delta)',
    dosingRateLPerHr: 8.5,
    scheduledDate: '2026-11-01',
    scheduledTime: '06:00 AM',
    status: 'Active Dosing',
    operator: 'Dr. Elena Vance (Lead Operator)',
    notes: 'Low-shear dispersion along tidal ebb flow corridor',
    createdAt: 'Today, 05:45 AM'
  },
  {
    id: 'trip-2',
    tripCode: 'TRIP-2026-011',
    assetName: 'AquaDrone_DOS_002',
    tankId: 'T002',
    batchId: 'MB-2026-003',
    mineralType: 'Basalt Mineral Dust (< 35µm)',
    quantityLiters: 180,
    catchmentReach: 'Nidamanuru Reach 2 (Mid-river transect)',
    dosingRateLPerHr: 9.2,
    scheduledDate: '2026-10-31',
    scheduledTime: '15:00 PM',
    status: 'Completed',
    operator: 'K. Ramanathan',
    notes: 'Alkaline baseline enhancement verified with RTK GPS',
    createdAt: 'Yesterday, 14:30 PM'
  },
  {
    id: 'trip-3',
    tripCode: 'TRIP-2026-010',
    assetName: 'AquaDrone_DWN_003',
    tankId: 'T001',
    batchId: 'MB-2026-002',
    mineralType: 'Calcium Silicate (CaSiO₃)',
    quantityLiters: 200,
    catchmentReach: 'Dowleswaram Barrage Outfall Reach',
    dosingRateLPerHr: 7.8,
    scheduledDate: '2026-10-29',
    scheduledTime: '08:30 AM',
    status: 'Completed',
    operator: 'P. Vijay Kumar',
    notes: 'MRV sensor check pre- and post-dosing completed',
    createdAt: '29 Oct 2026, 08:00 AM'
  }
];

const SlurryDosingContext = createContext<SlurryDosingContextType | undefined>(undefined);

export const SlurryDosingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tanks, setTanks] = useState<TankStorageData[]>(INITIAL_TANKS);
  const [slurryEventsHistory, setSlurryEventsHistory] = useState<SlurryHistoryEvent[]>(INITIAL_SLURRY_EVENTS);
  const [dosingTrips, setDosingTrips] = useState<DosingTripRecord[]>(INITIAL_DOSING_TRIPS);

  // 1. Create a slurry batch and load it into selected tank
  const createSlurryBatch = (batchData: TankBatchConstituent, tankId: 'T001' | 'T002') => {
    setTanks((prevTanks) =>
      prevTanks.map((tank) => {
        if (tank.id === tankId) {
          const newVol = Math.min(tank.capacityLiters, tank.currentVolumeLiters + batchData.slurryVolumeLiters);
          return {
            ...tank,
            currentVolumeLiters: newVol,
            status: 'Ready',
            motorRpm: 120,
            batches: [batchData, ...tank.batches]
          };
        }
        return tank;
      })
    );

    const newEvent: SlurryHistoryEvent = {
      id: `evt-${Date.now()}`,
      timestamp: 'Today, Just now',
      type: 'BATCH_CREATED',
      title: `Slurry Batch ${batchData.batchId} Created`,
      description: `Loaded ${batchData.slurryVolumeLiters} L of ${batchData.mineralType} into ${tankId}`,
      tankId: tankId,
      volumeDeltaLiters: batchData.slurryVolumeLiters,
      batchId: batchData.batchId
    };
    setSlurryEventsHistory((prev) => [newEvent, ...prev]);
  };

  // 2. Create a dosing trip: deducts quantity from that tank and batch, adds trip and logs event
  const createDosingTrip = (tripInput: Omit<DosingTripRecord, 'id' | 'tripCode' | 'createdAt'>): DosingTripRecord => {
    const newTripCode = `TRIP-2026-${String(Math.floor(13 + Math.random() * 80)).padStart(3, '0')}`;
    const newTrip: DosingTripRecord = {
      ...tripInput,
      id: `trip-${Date.now()}`,
      tripCode: newTripCode,
      createdAt: 'Today, Just now'
    };

    // Deduct quantity from the target tank and that specific batch
    setTanks((prevTanks) =>
      prevTanks.map((tank) => {
        if (tank.id === tripInput.tankId) {
          const newVol = Math.max(0, tank.currentVolumeLiters - tripInput.quantityLiters);
          const updatedBatches = tank.batches
            .map((b) => {
              if (b.batchId === tripInput.batchId) {
                const remaining = Math.max(0, b.slurryVolumeLiters - tripInput.quantityLiters);
                return { ...b, slurryVolumeLiters: remaining };
              }
              return b;
            })
            .filter((b) => b.slurryVolumeLiters > 0); // Keep batch if it has volume, or remove if fully depleted

          return {
            ...tank,
            currentVolumeLiters: newVol,
            batches: updatedBatches,
            status: newVol > 0 ? tank.status : 'Standby'
          };
        }
        return tank;
      })
    );

    // Add to Dosing Trips history
    setDosingTrips((prev) => [newTrip, ...prev]);

    // Add dispatch event to Slurry Preparation History
    const newEvent: SlurryHistoryEvent = {
      id: `evt-${Date.now()}`,
      timestamp: 'Today, Just now',
      type: 'TRIP_DISPATCH',
      title: `Dispatched ${tripInput.quantityLiters} L to ${tripInput.assetName}`,
      description: `Transferred from Tank ${tripInput.tankId} (Batch ${tripInput.batchId}) for Trip ${newTripCode}`,
      tankId: tripInput.tankId,
      volumeDeltaLiters: -tripInput.quantityLiters,
      batchId: tripInput.batchId,
      assetName: tripInput.assetName
    };
    setSlurryEventsHistory((prev) => [newEvent, ...prev]);

    return newTrip;
  };

  // 3. Flush tank to 0 L
  const flushTank = (tankId: 'T001' | 'T002') => {
    setTanks((prev) =>
      prev.map((t) => {
        if (t.id === tankId) {
          return {
            ...t,
            currentVolumeLiters: 0,
            status: 'Standby',
            batches: []
          };
        }
        return t;
      })
    );

    const newEvent: SlurryHistoryEvent = {
      id: `evt-${Date.now()}`,
      timestamp: 'Today, Just now',
      type: 'TANK_FLUSH',
      title: `Tank ${tankId} Flushed & Drained`,
      description: `Tank drained to 0 L for cleaning/maintenance`,
      tankId: tankId,
      volumeDeltaLiters: 0
    };
    setSlurryEventsHistory((prev) => [newEvent, ...prev]);
  };

  return (
    <SlurryDosingContext.Provider
      value={{
        tanks,
        slurryEventsHistory,
        dosingTrips,
        createSlurryBatch,
        createDosingTrip,
        flushTank
      }}
    >
      {children}
    </SlurryDosingContext.Provider>
  );
};

export const useSlurryDosing = (): SlurryDosingContextType => {
  const context = useContext(SlurryDosingContext);
  if (!context) {
    throw new Error('useSlurryDosing must be used within a SlurryDosingProvider');
  }
  return context;
};
