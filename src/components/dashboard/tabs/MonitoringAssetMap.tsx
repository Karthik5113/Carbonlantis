import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ChevronDown } from 'lucide-react';

interface MonitoringAssetMapProps {
  progressRatio: number; // 0 to 1 based on scrubber time
  mapType: 'satellite' | 'street';
  onMapTypeChange: (type: 'satellite' | 'street') => void;
}

export const MonitoringAssetMap: React.FC<MonitoringAssetMapProps> = ({
  progressRatio,
  mapType,
  onMapTypeChange,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const boatMarkerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // River reach route coordinates (Kesinapalli / Godavari Delta estuary)
  const routeCoordinates: [number, number][] = [
    [16.5580, 81.8880], // 00:00 - 06:00 Start Anchor
    [16.5510, 81.8960], // 07:00
    [16.5440, 81.9060], // 08:00 (Dosing Zone 1)
    [16.5390, 81.9160], // 09:00
    [16.5340, 81.9250], // 10:15
    [16.5290, 81.9330], // 12:00
    [16.5240, 81.9410], // 14:00
    [16.5190, 81.9490], // 16:00 (Dosing Zone 2)
    [16.5140, 81.9560], // 17:00
    [16.5090, 81.9640], // 18:00 End
  ];

  // Calculate interpolated position along route based on progressRatio (0 to 1)
  const getInterpolatedPosition = (ratio: number): [number, number] => {
    const clamped = Math.max(0, Math.min(1, ratio));
    const totalSegments = routeCoordinates.length - 1;
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
      const centerPos: [number, number] = [16.5340, 81.9260];
      const map = L.map(mapContainerRef.current, {
        center: centerPos,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // Custom Zoom Control position
      L.control.zoom({ position: 'bottomleft' }).addTo(map);

      // Default imagery
      const tileUrl =
        mapType === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, { maxZoom: 18 });
      tileLayer.addTo(map);
      tileLayerRef.current = tileLayer;

      // Draw Route Polyline with clean dash pattern
      const routePolyline = L.polyline(routeCoordinates, {
        color: '#38BDF8',
        weight: 3.5,
        dashArray: '6, 6',
        opacity: 0.95,
      });
      routePolyline.addTo(map);

      // Directional arrow markers along route
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

      // Add arrow markers at segment midpoints
      [1, 3, 5, 7].forEach((idx) => {
        if (routeCoordinates[idx]) {
          L.marker(routeCoordinates[idx], { icon: arrowIcon, interactive: false }).addTo(map);
        }
      });

      // Dosing Location Polygon/Bands on water
      const dosingZone1 = L.polygon([
        [16.5500, 81.8940],
        [16.5430, 81.9040],
        [16.5360, 81.9180],
        [16.5400, 81.9210],
        [16.5470, 81.9070],
        [16.5530, 81.8970],
      ], {
        color: '#0284C7',
        fillColor: '#38BDF8',
        fillOpacity: 0.35,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);
      dosingZone1.bindTooltip('Dosing Location 1 (06:00 - 09:00)', { sticky: true });

      const dosingZone2 = L.polygon([
        [16.5260, 81.9370],
        [16.5180, 81.9470],
        [16.5120, 81.9560],
        [16.5160, 81.9600],
        [16.5220, 81.9500],
        [16.5290, 81.9400],
      ], {
        color: '#0284C7',
        fillColor: '#38BDF8',
        fillOpacity: 0.35,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);
      dosingZone2.bindTooltip('Dosing Location 2 (15:00 - 18:00)', { sticky: true });

      // Start Marker (Green Pin + Dark Info Card)
      const startIcon = L.divIcon({
        html: `
          <div class="flex items-center gap-1.5 font-sans whitespace-nowrap cursor-pointer">
            <div class="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center shadow-lg text-[10px]">
              <span class="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <div class="bg-[#0b192c]/90 text-white px-2 py-1 rounded-md shadow-md border border-slate-700 leading-tight">
              <div class="text-[10px] font-bold text-white">Start</div>
              <div class="text-[8.5px] text-slate-300">06:00 AM</div>
            </div>
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconAnchor: [12, 12],
      });
      L.marker(routeCoordinates[0], { icon: startIcon }).addTo(map);

      // End Marker (Red Pin + Dark Info Card)
      const endIcon = L.divIcon({
        html: `
          <div class="flex items-center gap-1.5 font-sans whitespace-nowrap cursor-pointer">
            <div class="w-6 h-6 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg text-[10px]">
              <span class="w-2 h-2 rounded-full bg-white"></span>
            </div>
            <div class="bg-[#0b192c]/90 text-white px-2 py-1 rounded-md shadow-md border border-slate-700 leading-tight">
              <div class="text-[10px] font-bold text-white">End</div>
              <div class="text-[8.5px] text-slate-300">06:00 PM</div>
            </div>
          </div>
        `,
        className: 'custom-leaflet-marker',
        iconAnchor: [12, 12],
      });
      L.marker(routeCoordinates[routeCoordinates.length - 1], { icon: endIcon }).addTo(map);

      // Current Vessel Marker (Blue boat icon with live pulsing radar ring)
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
      const boatMarker = L.marker(currentPos, { icon: boatIcon }).addTo(map);
      boatMarker.bindTooltip('AquaNode_ATV_001 (Active Dosing Vessel)', { direction: 'top', offset: [0, -18] });
      boatMarkerRef.current = boatMarker;

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

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
  }, [progressRatio]);

  return (
    <div className="relative w-full h-[360px] sm:h-[400px] rounded-xl overflow-hidden border border-slate-200 shadow-xs">
      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

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

      {/* Bottom Left Scale Indicator */}
      <div className="absolute bottom-3 left-14 z-10 bg-black/70 text-white font-mono text-[9px] px-2 py-0.5 rounded backdrop-blur-xs flex items-center gap-1.5 shadow-md">
        <span>0</span>
        <div className="w-12 h-0.5 bg-white"></div>
        <span>2 km</span>
      </div>

      {/* Bottom Right Map Legend Box */}
      <div className="absolute bottom-3 right-3 z-10 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg border border-slate-200/90 shadow-lg text-[10.5px] space-y-1 font-sans">
        <div className="flex items-center gap-2">
          <span className="text-sky-500 font-bold">➔</span>
          <span className="text-slate-700 font-medium">Asset Route</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-xs bg-sky-200 border border-sky-400"></span>
          <span className="text-slate-700 font-medium">Dosing Location</span>
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
          <span className="text-slate-700 font-medium">Current Location</span>
        </div>
      </div>
    </div>
  );
};
