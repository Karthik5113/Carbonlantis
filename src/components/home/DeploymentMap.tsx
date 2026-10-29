import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RefreshCw, Activity, Compass, MapPin } from 'lucide-react';
import { DeploymentSite } from '../../types';

interface DeploymentMapProps {
  deployments: DeploymentSite[];
  selectedFilter?: string;
  className?: string;
  height?: string;
  interactive?: boolean;
}

export const DeploymentMap: React.FC<DeploymentMapProps> = ({
  deployments,
  selectedFilter = 'all',
  className = '',
  height = 'h-[380px]',
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [selectedSite, setSelectedSite] = useState<DeploymentSite | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Center coordinate: Godavari Delta (Kesinapalli Drain region: ~16.53 N, 81.91 E)
  const defaultCenter: [number, number] = [16.5350, 81.9150];
  const defaultZoom = 12;

  // Create clean, alive scientific marker icons with marine radar pulse for active vessels
  const createCustomIcon = (site: DeploymentSite) => {
    let colorClass = 'bg-[#123B5D] text-white';
    let label = 'MDP';
    const isActive = site.status === 'Active';

    if (site.type === 'mrv-station') {
      colorClass = 'bg-[#059669] text-white';
      label = 'MRV';
    } else if (site.type === 'planned') {
      colorClass = 'bg-[#7C3AED] text-white';
      label = 'PLN';
    }

    const html = `
      <div class="relative flex items-center justify-center cursor-pointer group">
        ${isActive ? '<div class="absolute -inset-1.5 rounded-full border border-cyan-400/70 bg-cyan-400/20 animate-radar pointer-events-none"></div>' : ''}
        <div class="relative w-7 h-7 rounded-full ${colorClass} flex items-center justify-center shadow-md font-semibold text-[10px] tracking-tight border-2 border-white ring-1 ring-slate-900/10 group-hover:scale-110 transition-transform">
          ${label}
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'custom-leaflet-marker',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: interactive,
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // High-clarity cartographic tile layer
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors'
      });

      streetLayer.addTo(map);
      mapInstanceRef.current = map;
      setIsMapLoaded(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when deployments or filter changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    const filtered = deployments.filter((site) => {
      if (selectedFilter === 'all') return true;
      return site.type === selectedFilter;
    });

    filtered.forEach((site) => {
      const icon = createCustomIcon(site);
      const marker = L.marker(site.coordinates, { icon });

      const popupHtml = `
        <div class="p-2.5 min-w-[210px] font-sans">
          <div class="flex items-center justify-between border-b border-slate-200 pb-1.5 mb-2">
            <span class="text-xs font-semibold text-slate-900">${site.name}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
              site.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
            }">${site.status}</span>
          </div>
          <p class="text-[11px] text-slate-600 mb-1.5"><strong>Waterbody:</strong> ${site.waterBody}</p>
          ${
            site.lastReading
              ? `<div class="grid grid-cols-2 gap-1.5 text-[10px] bg-slate-50 p-2 rounded border border-slate-200 my-1.5 font-mono text-slate-700">
                  <div>pH: <strong class="text-blue-700">${site.lastReading.ph}</strong></div>
                  <div>DO: <strong>${site.lastReading.do} mg/L</strong></div>
                  <div>Temp: <strong>${site.lastReading.temp} °C</strong></div>
                  <div>EC: <strong>${site.lastReading.ec} µS</strong></div>
                </div>`
              : ''
          }
          <p class="text-[10.5px] text-slate-500 mt-1 leading-normal">${site.description}</p>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });
      marker.on('click', () => {
        setSelectedSite(site);
      });

      marker.addTo(map);
      markersRef.current[site.id] = marker;
    });
  }, [deployments, selectedFilter, isMapLoaded]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(defaultCenter, defaultZoom, { duration: 0.8 });
      setSelectedSite(null);
    }
  };

  return (
    <div className={`relative w-full rounded-md overflow-hidden border border-carbon-border bg-slate-100 ${className}`}>
      {/* Map Element */}
      <div ref={mapContainerRef} className={`w-full ${height} z-0`} />

      {/* Floating Alive Status Indicator */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-white/95 border border-carbon-border shadow-xs text-xs font-medium text-carbon-text pointer-events-auto backdrop-blur-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-soft-pulse" />
          <span>Live Basin Telemetry: Kesinapalli Drain</span>
          <span className="text-[10px] bg-slate-100 text-carbon-muted px-1.5 py-0.2 rounded font-mono">
            Active GPS
          </span>
        </div>
      </div>

      {/* Center Map Control Button */}
      <div className="absolute bottom-3 right-3 z-10">
        <button
          type="button"
          onClick={handleResetView}
          className="btn-press p-1.5 rounded bg-white text-carbon-text border border-carbon-border shadow-xs hover:bg-slate-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
          title="Reset map view to Godavari Delta"
        >
          <RefreshCw className="w-3.5 h-3.5 text-carbon-muted" />
          <span className="hidden sm:inline">Recenter</span>
        </button>
      </div>

      {/* Selected Site Drawer Preview */}
      {selectedSite && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-20 bg-white border border-carbon-border rounded-lg p-3.5 shadow-popover animate-in fade-in duration-150">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <span className="text-[10px] font-mono text-carbon-muted uppercase">{selectedSite.siteCode}</span>
              <h4 className="text-xs font-semibold text-carbon-text">{selectedSite.name}</h4>
            </div>
            <button
              onClick={() => setSelectedSite(null)}
              className="text-slate-400 hover:text-slate-600 text-xs p-1 cursor-pointer"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-carbon-muted mb-2">{selectedSite.description}</p>
          {selectedSite.lastReading && (
            <div className="flex items-center gap-3 text-[11px] font-mono bg-slate-50 px-2.5 py-1 rounded text-slate-700 border border-slate-200">
              <span>pH: <strong className="text-carbon-navy">{selectedSite.lastReading.ph}</strong></span>
              <span>DO: <strong>{selectedSite.lastReading.do} mg/L</strong></span>
              <span>Temp: <strong>{selectedSite.lastReading.temp}°C</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
