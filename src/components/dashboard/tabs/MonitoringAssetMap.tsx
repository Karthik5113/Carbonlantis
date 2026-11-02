import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ChevronDown } from 'lucide-react';

interface MonitoringAssetMapProps {
  progressRatio: number; // 0 to 1 based on scrubber time
  mapType: 'satellite' | 'street';
  onMapTypeChange: (type: 'satellite' | 'street') => void;
  assetName?: string;
}

interface AssetMapProfile {
  center: [number, number];
  zoom: number;
  label: string;
  type: string;
  route: [number, number][];
  dosingZones: { name: string; bounds: [number, number][] }[];
}

const ASSET_MAP_PROFILES: Record<string, AssetMapProfile> = {
  'AquaDrone_MVP_001': {
    center: [16.5340, 81.9260],
    zoom: 12,
    label: 'AquaDrone_MVP_001 (ADR-MVP-001 • Mobile Dosing Platform)',
    type: 'Mobile Dosing Platform',
    route: [
      [16.5580, 81.8880],
      [16.5510, 81.8960],
      [16.5440, 81.9060],
      [16.5390, 81.9160],
      [16.5340, 81.9250],
      [16.5290, 81.9330],
      [16.5240, 81.9410],
      [16.5190, 81.9490],
      [16.5140, 81.9560],
      [16.5090, 81.9640],
    ],
    dosingZones: [
      {
        name: 'Kesinapalli Dosing Zone 1 (06:00 - 09:00)',
        bounds: [
          [16.5500, 81.8940],
          [16.5430, 81.9040],
          [16.5360, 81.9180],
          [16.5400, 81.9210],
          [16.5470, 81.9070],
          [16.5530, 81.8970],
        ]
      },
      {
        name: 'Kesinapalli Dosing Zone 2 (15:00 - 18:00)',
        bounds: [
          [16.5260, 81.9370],
          [16.5180, 81.9470],
          [16.5120, 81.9560],
          [16.5160, 81.9600],
          [16.5220, 81.9500],
          [16.5290, 81.9400],
        ]
      }
    ]
  },
  'AquaNode_ATV_001': {
    center: [16.5621, 81.8942],
    zoom: 13,
    label: 'AquaNode_ATV_001 (AN-ATV-001 • MRV Station)',
    type: 'MRV Station',
    route: [
      [16.5700, 81.8840],
      [16.5660, 81.8890],
      [16.5621, 81.8942],
      [16.5580, 81.8990],
      [16.5540, 81.9040],
    ],
    dosingZones: [
      {
        name: 'Andaveli Baseline Sonde Transect Reach',
        bounds: [
          [16.5650, 81.8900],
          [16.5600, 81.8980],
          [16.5580, 81.8960],
          [16.5630, 81.8880],
        ]
      }
    ]
  },
  'RiverNode_RJY_001': {
    center: [17.0005, 81.8040],
    zoom: 13,
    label: 'RiverNode_RJY_001 (RN-RJY-001 • MRV Station)',
    type: 'MRV Station',
    route: [
      [17.0120, 81.7920],
      [17.0060, 81.7980],
      [17.0005, 81.8040],
      [16.9950, 81.8100],
      [16.9890, 81.8160],
    ],
    dosingZones: [
      {
        name: 'Rajahmundry Godavari Mainstem Dispersion Reach',
        bounds: [
          [17.0050, 81.8000],
          [16.9960, 81.8090],
          [16.9930, 81.8050],
          [17.0020, 81.7960],
        ]
      }
    ]
  },
  'AquaDrone_DOS_002': {
    center: [16.5184, 81.9318],
    zoom: 13,
    label: 'AquaDrone_DOS_002 (ADR-DOS-002 • Mobile Dosing Platform)',
    type: 'Mobile Dosing Platform',
    route: [
      [16.5300, 81.9210],
      [16.5240, 81.9260],
      [16.5184, 81.9318],
      [16.5120, 81.9370],
      [16.5060, 81.9430],
    ],
    dosingZones: [
      {
        name: 'Nidamanuru Canal Injection Reach (07:00 - 11:00)',
        bounds: [
          [16.5220, 81.9280],
          [16.5150, 81.9350],
          [16.5120, 81.9320],
          [16.5190, 81.9250],
        ]
      }
    ]
  },
  'AquaDrone_DWN_003': {
    center: [16.9380, 81.7725],
    zoom: 13,
    label: 'AquaDrone_DWN_003 (ADR-DWN-003 • Maintenance Platform)',
    type: 'Mobile Dosing Platform (Maintenance)',
    route: [
      [16.9450, 81.7650],
      [16.9410, 81.7690],
      [16.9380, 81.7725],
      [16.9340, 81.7760],
      [16.9300, 81.7800],
    ],
    dosingZones: [
      {
        name: 'Dowleswaram Barrage Mooring Basin & Test Tank',
        bounds: [
          [16.9410, 81.7700],
          [16.9350, 81.7760],
          [16.9330, 81.7730],
          [16.9390, 81.7670],
        ]
      }
    ]
  }
};

export const MonitoringAssetMap: React.FC<MonitoringAssetMapProps> = ({
  progressRatio,
  mapType,
  onMapTypeChange,
  assetName = 'AquaDrone_MVP_001',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const boatMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);

  const activeProfile = ASSET_MAP_PROFILES[assetName] || ASSET_MAP_PROFILES['AquaDrone_MVP_001'];
  const routeCoordinates = activeProfile.route;

  // Calculate interpolated position along route based on progressRatio (0 to 1)
  const getInterpolatedPosition = (ratio: number): [number, number] => {
    const clamped = Math.max(0, Math.min(1, ratio));
    const totalSegments = routeCoordinates.length - 1;
    if (totalSegments <= 0) return routeCoordinates[0] || activeProfile.center;

    const segmentIndex = Math.min(Math.floor(clamped * totalSegments), totalSegments - 1);
    const segmentFraction = (clamped * totalSegments) - segmentIndex;

    const p1 = routeCoordinates[segmentIndex];
    const p2 = routeCoordinates[segmentIndex + 1];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentFraction;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentFraction;

    return [lat, lng];
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: activeProfile.center,
        zoom: activeProfile.zoom,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      const tileUrl =
        mapType === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, { maxZoom: 18 });
      tileLayer.addTo(map);
      tileLayerRef.current = tileLayer;

      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;

      mapInstanceRef.current = map;
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update dynamic layers and center whenever assetName changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    // Clear previous asset markers/polylines
    group.clearLayers();

    // Pan / Fly to active asset position
    map.flyTo(activeProfile.center, activeProfile.zoom, { duration: 0.8 });

    // Draw Route Polyline
    const routePolyline = L.polyline(routeCoordinates, {
      color: '#38BDF8',
      weight: 3.5,
      dashArray: '6, 6',
      opacity: 0.95,
    });
    group.addLayer(routePolyline);

    // Directional arrows
    const arrowIcon = L.divIcon({
      html: `
        <div style="transform: rotate(135deg); color: #38BDF8; font-size: 14px; line-height: 1; text-shadow: 0 0 3px rgba(0,0,0,0.8);">
          ➤
        </div>
      `,
      className: 'custom-arrow-marker',
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    [1, 3].forEach((idx) => {
      if (routeCoordinates[idx]) {
        group.addLayer(L.marker(routeCoordinates[idx], { icon: arrowIcon, interactive: false }));
      }
    });

    // Dosing Zones / Polygons
    activeProfile.dosingZones.forEach((zone) => {
      const polygon = L.polygon(zone.bounds, {
        color: '#0284C7',
        fillColor: '#38BDF8',
        fillOpacity: 0.35,
        weight: 1.5,
        dashArray: '4, 4',
      });
      polygon.bindTooltip(zone.name, { sticky: true });
      group.addLayer(polygon);
    });

    // Start Marker
    if (routeCoordinates.length > 0) {
      const startIcon = L.divIcon({
        html: `
          <div class="flex items-center gap-1.5 font-sans whitespace-nowrap cursor-pointer">
            <div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shadow-lg text-[10px]">
              <span class="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <div class="bg-[#0b192c]/90 text-white px-2 py-1 rounded-md shadow-md border border-slate-700 leading-tight">
              <div class="text-[10px] font-bold text-white">Start Point</div>
              <div class="text-[8.5px] text-slate-300">06:00 AM</div>
            </div>
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconAnchor: [12, 12],
      });
      group.addLayer(L.marker(routeCoordinates[0], { icon: startIcon }));

      // End Marker
      const endIcon = L.divIcon({
        html: `
          <div class="flex items-center gap-1.5 font-sans whitespace-nowrap cursor-pointer">
            <div class="w-6 h-6 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg text-[10px]">
              <span class="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <div class="bg-[#0b192c]/90 text-white px-2 py-1 rounded-md shadow-md border border-slate-700 leading-tight">
              <div class="text-[10px] font-bold text-white">End Reach</div>
              <div class="text-[8.5px] text-slate-300">06:00 PM</div>
            </div>
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconAnchor: [12, 12],
      });
      group.addLayer(L.marker(routeCoordinates[routeCoordinates.length - 1], { icon: endIcon }));
    }

    // Current Vessel / Sonde Marker
    const currentPos = getInterpolatedPosition(progressRatio);
    const boatIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          <div class="absolute -inset-3 rounded-full border-2 border-cyan-400 bg-cyan-400/30 animate-radar pointer-events-none"></div>
          <div class="relative w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
              <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
              <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
              <path d="M12 10v4"/>
              <path d="M12 2v3"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
    const boatMarker = L.marker(currentPos, { icon: boatIcon });
    boatMarker.bindTooltip(`${activeProfile.label} (Current GPS Position)`, { direction: 'top', offset: [0, -18] });
    group.addLayer(boatMarker);
    boatMarkerRef.current = boatMarker;
  }, [assetName]);

  // Handle Map Type change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const tileUrl =
      mapType === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newTileLayer = L.tileLayer(tileUrl, { maxZoom: 18 });
    newTileLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = newTileLayer;
  }, [mapType]);

  // Update Boat Position smoothly based on Scrubber Progress
  useEffect(() => {
    if (!boatMarkerRef.current) return;
    const newPos = getInterpolatedPosition(progressRatio);
    boatMarkerRef.current.setLatLng(newPos);
  }, [progressRatio, assetName]);

  return (
    <div className="relative w-full h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-slate-200 shadow-xs">
      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left Active Asset Label Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm text-xs font-semibold text-slate-800">
        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-1.5 animate-pulse" />
        {activeProfile.label.split('(')[0]}
      </div>

      {/* Top Right Satellite / Street Switcher Dropdown */}
      <div className="absolute top-3 right-3 z-10">
        <div className="relative inline-block text-left">
          <select
            value={mapType}
            onChange={(e) => onMapTypeChange(e.target.value as 'satellite' | 'street')}
            className="appearance-none bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 pr-7 rounded-lg border border-slate-300 shadow-md outline-none cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <option value="satellite">Satellite</option>
            <option value="street">Street Map</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Bottom Right Map Legend Box with reduced opacity matching map background */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/75 backdrop-blur-md p-2.5 rounded-lg border border-slate-200/70 shadow-sm text-[10.5px] space-y-1 font-sans">
        <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">
          Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sky-500 font-bold">➔</span>
          <span className="text-slate-700 font-medium">Reach Route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-sky-200 border border-sky-400"></span>
          <span className="text-slate-700 font-medium">Monitoring / Dosing Reach</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
          <span className="text-slate-700 font-medium">Start</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-200"></span>
          <span className="text-slate-700 font-medium">End</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[8px]">
            ⚓
          </div>
          <span className="text-slate-700 font-medium">{assetName}</span>
        </div>
      </div>

      {/* Bottom Left Scale Indicator */}
      <div className="absolute bottom-3 left-3 z-10 bg-black/60 text-white font-mono text-[9px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
        <span>0</span>
        <div className="w-12 h-0.5 bg-white"></div>
        <span>2 km</span>
      </div>
    </div>
  );
};
