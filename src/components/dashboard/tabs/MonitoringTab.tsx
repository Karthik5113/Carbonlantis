import React, { useState, useEffect } from 'react';
import {
  Waves,
  Calendar,
  ChevronDown,
  Download,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  AlertTriangle,
  Info,
  CheckCircle2,
  Droplets,
  Wind,
  Thermometer,
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { MonitoringAssetMap } from './MonitoringAssetMap';

export const MonitoringTab: React.FC = () => {
  // Top Filter Controls
  const [selectedAsset, setSelectedAsset] = useState('AquaNode_ATV_001');
  const [selectedDate, setSelectedDate] = useState('16 Oct 2026');
  const [visualizationMode, setVisualizationMode] = useState<'standard' | 'realtime' | 'timeseries'>('timeseries');
  const [exportFormat, setExportFormat] = useState('PDF');
  const [exportToast, setExportToast] = useState<string | null>(null);

  // Available Parameters Toggle
  const [params, setParams] = useState({
    ph: true,
    pco2: true,
    do: true,
    temperature: true,
    ec: false,
    turbidity: false,
  });

  // Timeline Scrubber & Playback
  const [isPlaying, setIsPlaying] = useState(false);
  // Scrubber progress: 0 to 1 (default ~0.47 representing 10:15:30 am on a 22-hour timeline)
  const [scrubberProgress, setScrubberProgress] = useState(0.466);
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

  // Playback timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setScrubberProgress((prev) => {
          if (prev >= 1) return 0;
          return Math.min(1, prev + 0.005);
        });
      }, 200);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Handle Export Trigger
  const handleExport = () => {
    setExportToast(`Generating ${exportFormat} export for ${selectedAsset} (${selectedDate})...`);
    setTimeout(() => {
      setExportToast(null);
    }, 2500);
  };

  // Toggle Parameter Visibility
  const toggleParam = (key: keyof typeof params) => {
    setParams((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Chart Dimensions & Coordinate Mapping
  const chartWidth = 650;
  const chartHeight = 260;
  const padding = { top: 35, right: 55, bottom: 35, left: 45 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // 22-Hour Telemetry Dataset (00:00 to 22:00)
  const timeseriesData = [
    { hour: '00:00', ph: 7.5, pco2: 2450, do: 4.5, temp: 2.1 },
    { hour: '01:00', ph: 7.7, pco2: 2460, do: 4.6, temp: 2.1 },
    { hour: '02:00', ph: 8.0, pco2: 2480, do: 4.8, temp: 2.1 },
    { hour: '03:00', ph: 8.2, pco2: 2470, do: 5.2, temp: 2.2 },
    { hour: '04:00', ph: 8.5, pco2: 2500, do: 5.4, temp: 2.2 },
    { hour: '05:00', ph: 8.8, pco2: 2520, do: 5.6, temp: 2.2 },
    { hour: '06:00', ph: 7.9, pco2: 2500, do: 4.6, temp: 2.2 }, // Dosing Cycle 1 Start
    { hour: '07:00', ph: 8.0, pco2: 2600, do: 4.4, temp: 2.3 },
    { hour: '08:00', ph: 9.1, pco2: 2950, do: 4.1, temp: 2.3 },
    { hour: '09:00', ph: 9.8, pco2: 2700, do: 4.3, temp: 2.3 }, // Dosing Cycle 1 End
    { hour: '10:00', ph: 10.3, pco2: 2300, do: 5.1, temp: 2.3 },
    { hour: '11:00', ph: 9.7, pco2: 2150, do: 4.5, temp: 2.3 },
    { hour: '12:00', ph: 8.4, pco2: 1980, do: 4.1, temp: 2.2 },
    { hour: '13:00', ph: 8.2, pco2: 2020, do: 4.1, temp: 2.2 },
    { hour: '14:00', ph: 8.2, pco2: 2050, do: 4.1, temp: 2.2 },
    { hour: '15:00', ph: 8.6, pco2: 2100, do: 3.9, temp: 2.2 }, // Dosing Cycle 2 Start
    { hour: '16:00', ph: 10.2, pco2: 2450, do: 4.3, temp: 2.3 },
    { hour: '17:00', ph: 11.1, pco2: 3000, do: 4.7, temp: 2.5 },
    { hour: '18:00', ph: 10.9, pco2: 2900, do: 5.2, temp: 2.8 }, // Dosing Cycle 2 End
    { hour: '19:00', ph: 10.1, pco2: 2450, do: 5.3, temp: 2.8 },
    { hour: '20:00', ph: 9.3, pco2: 2800, do: 4.9, temp: 2.7 },
    { hour: '21:00', ph: 9.4, pco2: 2750, do: 5.1, temp: 2.7 },
    { hour: '22:00', ph: 9.5, pco2: 2650, do: 5.0, temp: 2.6 },
  ];

  const totalPoints = timeseriesData.length;

  // Scale mapping functions
  const getX = (index: number) => padding.left + (index / (totalPoints - 1)) * innerWidth;
  // Left axis: 0 to 14
  const getYLeft = (val: number) => padding.top + ((14 - val) / 14) * innerHeight;
  // Right axis: 0 to 5000 µatm
  const getYRight = (val: number) => padding.top + ((5000 - val) / 5000) * innerHeight;

  // Dosing Bands pixel coordinates
  const cycle1StartX = getX(6); // 06:00
  const cycle1EndX = getX(9);   // 09:00
  const cycle2StartX = getX(15); // 15:00
  const cycle2EndX = getX(18);  // 18:00

  // SVG Polyline paths
  const phPointsStr = timeseriesData.map((d, i) => `${getX(i)},${getYLeft(d.ph)}`).join(' ');
  const pco2PointsStr = timeseriesData.map((d, i) => `${getX(i)},${getYRight(d.pco2)}`).join(' ');
  const doPointsStr = timeseriesData.map((d, i) => `${getX(i)},${getYLeft(d.do)}`).join(' ');
  const tempPointsStr = timeseriesData.map((d, i) => `${getX(i)},${getYLeft(d.temp)}`).join(' ');

  // Current Scrubber X
  const scrubberX = padding.left + scrubberProgress * innerWidth;

  // Interpolated Sensor Readings based on current scrubber progress
  const currentIdxFloat = scrubberProgress * (totalPoints - 1);
  const baseIdx = Math.floor(currentIdxFloat);
  const nextIdx = Math.min(baseIdx + 1, totalPoints - 1);
  const frac = currentIdxFloat - baseIdx;

  const currentPh = (timeseriesData[baseIdx].ph + (timeseriesData[nextIdx].ph - timeseriesData[baseIdx].ph) * frac).toFixed(1);
  const currentPco2 = Math.round(timeseriesData[baseIdx].pco2 + (timeseriesData[nextIdx].pco2 - timeseriesData[baseIdx].pco2) * frac);
  const currentDo = (timeseriesData[baseIdx].do + (timeseriesData[nextIdx].do - timeseriesData[baseIdx].do) * frac).toFixed(1);
  const currentTemp = (26.0 + parseFloat((timeseriesData[baseIdx].temp * 1.1).toFixed(1))).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Toast feedback */}
      {exportToast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          {exportToast}
        </div>
      )}

      {/* 1. Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-[#0A1628] tracking-tight">
          Real-time Monitoring
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Live sensor data, dosing cycle, and asset location
        </p>
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
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full appearance-none bg-transparent text-xs font-semibold text-slate-800 pr-6 outline-none cursor-pointer"
            >
              <option value="AquaNode_ATV_001">AquaNode_ATV_001</option>
              <option value="Delta_Ranger_002">Delta_Ranger_002</option>
              <option value="Station_MRV_Alpha">Station_MRV_Alpha</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Card 2: Date Selector */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs">
          <label className="block text-[11px] text-slate-500 font-medium mb-1">
            Date
          </label>
          <div className="relative">
            <div className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedDate}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Card 3: Visualization Radio Group */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs">
          <label className="block text-[11px] text-slate-500 font-medium mb-1">
            Visualization
          </label>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="radio"
                name="vis-mode"
                checked={visualizationMode === 'standard'}
                onChange={() => setVisualizationMode('standard')}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[11.5px]">Standard</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-900 font-medium">
              <input
                type="radio"
                name="vis-mode"
                checked={visualizationMode === 'timeseries'}
                onChange={() => setVisualizationMode('timeseries')}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[11.5px]">Time-series</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 col-span-2">
              <input
                type="radio"
                name="vis-mode"
                checked={visualizationMode === 'realtime'}
                onChange={() => setVisualizationMode('realtime')}
                className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-[11.5px]">Real-time</span>
            </label>
          </div>
        </div>

        {/* Card 4: Export Format & Button */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-xs">
          <label className="block text-[11px] text-slate-500 font-medium mb-1">
            Export
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 pr-7 outline-none cursor-pointer"
              >
                <option value="PDF">PDF</option>
                <option value="CSV">CSV</option>
                <option value="JSON">JSON</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="btn-press px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer shrink-0"
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {/* 3. Available Parameters Selection Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 px-4 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="font-bold text-[#0A1628] text-xs">
            Available Parameters
          </span>

          {/* pH Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.ph}
              onChange={() => toggleParam('ph')}
              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="font-semibold text-blue-700">pH</span>
          </label>

          {/* pCO2 Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.pco2}
              onChange={() => toggleParam('pco2')}
              className="w-3.5 h-3.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
            <span className="font-semibold text-emerald-700">pCO₂</span>
          </label>

          {/* DO Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.do}
              onChange={() => toggleParam('do')}
              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="font-semibold text-indigo-700">DO</span>
          </label>

          {/* Temperature Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.temperature}
              onChange={() => toggleParam('temperature')}
              className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <span className="font-semibold text-amber-700">Temperature</span>
          </label>

          {/* EC Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.ec}
              onChange={() => toggleParam('ec')}
              className="w-3.5 h-3.5 rounded text-cyan-600 focus:ring-cyan-500 cursor-pointer"
            />
            <span className="text-slate-600">EC</span>
          </label>

          {/* Turbidity Checkbox */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={params.turbidity}
              onChange={() => toggleParam('turbidity')}
              className="w-3.5 h-3.5 rounded text-amber-800 focus:ring-amber-700 cursor-pointer"
            />
            <span className="text-slate-600">Turbidity</span>
          </label>
        </div>

        <ChevronDown className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600" />
      </div>

      {/* 4. Middle Section: Chart (Left) + Asset Map (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Live Parameter Trends Chart */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Title & Inline Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-bold text-[#0A1628]">
                Live Parameter Trends
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium">
                {params.ph && (
                  <div className="flex items-center gap-1.5 text-blue-600">
                    <span className="w-2.5 h-0.5 bg-blue-600"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 -ml-2"></span>
                    <span>pH</span>
                  </div>
                )}
                {params.pco2 && (
                  <div className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2.5 h-0.5 bg-emerald-600"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 -ml-2"></span>
                    <span>pCO₂ (µatm)</span>
                  </div>
                )}
                {params.do && (
                  <div className="flex items-center gap-1.5 text-indigo-600">
                    <span className="w-2.5 h-0.5 bg-indigo-600"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 -ml-2"></span>
                    <span>DO (mg/L)</span>
                  </div>
                )}
                {params.temperature && (
                  <div className="flex items-center gap-1.5 text-amber-600">
                    <span className="w-2.5 h-0.5 bg-amber-600"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 -ml-2"></span>
                    <span>Temperature (°C)</span>
                  </div>
                )}
              </div>
            </div>

            {/* SVG Interactive Chart with Dual Axes & Dosing Shaded Columns */}
            <div className="relative w-full overflow-hidden bg-white rounded-lg select-none">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64 sm:h-72 overflow-visible">
                {/* Horizontal Gridlines for Left Axis (0, 2, 4, 6, 8, 10, 12, 14) */}
                {[0, 2, 4, 6, 8, 10, 12, 14].map((tick) => (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={getYLeft(tick)}
                      x2={chartWidth - padding.right}
                      y2={getYLeft(tick)}
                      stroke="#F1F5F9"
                      strokeWidth="1"
                    />
                    <text
                      x={padding.left - 8}
                      y={getYLeft(tick) + 3}
                      textAnchor="end"
                      fontSize="9.5"
                      fill="#64748B"
                      fontFamily="Inter, sans-serif"
                    >
                      {tick}
                    </text>
                  </g>
                ))}

                {/* Right Axis Labels: pCO2 (0, 1000, 2000, 3000, 4000, 5000) */}
                {[0, 1000, 2000, 3000, 4000, 5000].map((tick) => (
                  <text
                    key={`right-${tick}`}
                    x={chartWidth - padding.right + 8}
                    y={getYRight(tick) + 3}
                    textAnchor="start"
                    fontSize="9.5"
                    fill="#64748B"
                    fontFamily="Inter, sans-serif"
                  >
                    {tick}
                  </text>
                ))}

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
                  pH / DO / Temp (°C)
                </text>

                {/* Right Axis Title */}
                <text
                  x={chartWidth - 10}
                  y={chartHeight / 2}
                  textAnchor="middle"
                  fontSize="9.5"
                  fill="#64748B"
                  transform={`rotate(90 ${chartWidth - 10} ${chartHeight / 2})`}
                  fontFamily="Inter, sans-serif"
                >
                  pCO₂ (µatm)
                </text>

                {/* Dosing Cycle 1 Highlighted Shaded Column (06:00 to 09:00) */}
                <rect
                  x={cycle1StartX}
                  y={padding.top}
                  width={cycle1EndX - cycle1StartX}
                  height={innerHeight}
                  fill="#E0F2FE"
                  fillOpacity="0.45"
                  stroke="#7DD3FC"
                  strokeDasharray="4,4"
                  strokeWidth="1"
                />
                <g transform={`translate(${(cycle1StartX + cycle1EndX) / 2}, ${padding.top - 8})`}>
                  <rect
                    x="-42"
                    y="-14"
                    width="84"
                    height="22"
                    rx="3"
                    fill="#E0F2FE"
                    stroke="#7DD3FC"
                    strokeWidth="1"
                  />
                  <text textAnchor="middle" y="-2" fontSize="9" fontWeight="bold" fill="#0369A1">
                    Dosing Cycle 1
                  </text>
                  <text textAnchor="middle" y="6" fontSize="7.5" fill="#0284C7">
                    06:00 - 09:00
                  </text>
                </g>

                {/* Dosing Cycle 2 Highlighted Shaded Column (15:00 to 18:00) */}
                <rect
                  x={cycle2StartX}
                  y={padding.top}
                  width={cycle2EndX - cycle2StartX}
                  height={innerHeight}
                  fill="#E0F2FE"
                  fillOpacity="0.45"
                  stroke="#7DD3FC"
                  strokeDasharray="4,4"
                  strokeWidth="1"
                />
                <g transform={`translate(${(cycle2StartX + cycle2EndX) / 2}, ${padding.top - 8})`}>
                  <rect
                    x="-42"
                    y="-14"
                    width="84"
                    height="22"
                    rx="3"
                    fill="#E0F2FE"
                    stroke="#7DD3FC"
                    strokeWidth="1"
                  />
                  <text textAnchor="middle" y="-2" fontSize="9" fontWeight="bold" fill="#0369A1">
                    Dosing Cycle 2
                  </text>
                  <text textAnchor="middle" y="6" fontSize="7.5" fill="#0284C7">
                    15:00 - 18:00
                  </text>
                </g>

                {/* X Axis Time Labels: 00:00, 03:00, 06:00, 09:00, 12:00, 15:00, 18:00, 21:00 */}
                {[0, 3, 6, 9, 12, 15, 18, 21].map((hourIdx) => (
                  <text
                    key={hourIdx}
                    x={getX(hourIdx)}
                    y={chartHeight - 12}
                    textAnchor="middle"
                    fontSize="9.5"
                    fill="#64748B"
                    fontFamily="Inter, sans-serif"
                  >
                    {timeseriesData[hourIdx].hour}
                  </text>
                ))}

                {/* Dynamic Curves */}
                {/* 1. Temperature Curve (Orange) */}
                {params.temperature && (
                  <g>
                    <polyline
                      points={tempPointsStr}
                      fill="none"
                      stroke="#F97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {timeseriesData.map((d, i) => (
                      <circle
                        key={`temp-${i}`}
                        cx={getX(i)}
                        cy={getYLeft(d.temp)}
                        r="3"
                        fill="#F97316"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    ))}
                  </g>
                )}

                {/* 2. DO Curve (Purple) */}
                {params.do && (
                  <g>
                    <polyline
                      points={doPointsStr}
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {timeseriesData.map((d, i) => (
                      <circle
                        key={`do-${i}`}
                        cx={getX(i)}
                        cy={getYLeft(d.do)}
                        r="3"
                        fill="#8B5CF6"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    ))}
                  </g>
                )}

                {/* 3. pCO2 Curve (Green) */}
                {params.pco2 && (
                  <g>
                    <polyline
                      points={pco2PointsStr}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    {timeseriesData.map((d, i) => (
                      <circle
                        key={`pco2-${i}`}
                        cx={getX(i)}
                        cy={getYRight(d.pco2)}
                        r="3"
                        fill="#10B981"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    ))}
                  </g>
                )}

                {/* 4. pH Curve (Blue) */}
                {params.ph && (
                  <g>
                    <polyline
                      points={phPointsStr}
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {timeseriesData.map((d, i) => (
                      <circle
                        key={`ph-${i}`}
                        cx={getX(i)}
                        cy={getYLeft(d.ph)}
                        r="3.5"
                        fill="#0284C7"
                        stroke="#FFFFFF"
                        strokeWidth="1.5"
                      />
                    ))}
                  </g>
                )}

                {/* Active Scrubber Vertical Cursor Line */}
                <line
                  x1={scrubberX}
                  y1={padding.top}
                  x2={scrubberX}
                  y2={chartHeight - padding.bottom}
                  stroke="#0284C7"
                  strokeWidth="1.5"
                  strokeDasharray="3,3"
                />
              </svg>
            </div>
          </div>

          {/* Interactive Playback Scrubber Bar matching screenshot */}
          <div className="mt-2 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Play/Pause & Step Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-7 h-7 rounded bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                title={isPlaying ? "Pause Timeline" : "Play Timeline"}
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setScrubberProgress((p) => Math.max(0, p - 0.05))}
                className="w-6 h-6 rounded hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                title="Previous step"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setScrubberProgress((p) => Math.min(1, p + 0.05))}
                className="w-6 h-6 rounded hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                title="Next step"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Slider Scrubber Track */}
            <div className="flex-1 min-w-[140px] max-w-sm flex items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.002"
                value={scrubberProgress}
                onChange={(e) => setScrubberProgress(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                aria-label="Timeline Scrubber"
              />
            </div>

            {/* Selected Timestamp Pill */}
            <div className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
              {currentTimeString}
            </div>

            {/* View Time Dropdown */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">View Time</span>
              <div className="relative">
                <select className="appearance-none bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-700 pr-5 outline-none cursor-pointer">
                  <option>10:00 - 10:30</option>
                  <option>06:00 - 09:00</option>
                  <option>15:00 - 18:00</option>
                  <option>All Day</option>
                </select>
                <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Asset Map / Location (24 hrs) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-[#0A1628]">
                Asset Map / Location (24 hrs)
              </h2>
            </div>

            {/* Live Synchronized Asset Satellite Map */}
            <MonitoringAssetMap
              progressRatio={scrubberProgress}
              mapType={mapType}
              onMapTypeChange={setMapType}
            />
          </div>
        </div>
      </div>

      {/* 5. Bottom Section: Sensor Readings (Left) + Notifications & Alerts (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Sensor Readings (Selected Time) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Title & Selected Timestamp */}
            <div className="mb-3">
              <h2 className="text-sm font-bold text-[#0A1628]">
                Sensor Readings (Selected Time)
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
                    3150
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
                    12
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
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            {/* 4 Alert Items matching screenshot */}
            <div className="space-y-2.5">
              {/* Alert 1: High pH Alert (Red) */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-rose-600 truncate">High pH Alert</h3>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">10:24 AM</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    pH higher than threshold (8.5)
                  </p>
                </div>
              </div>

              {/* Alert 2: DO Drop (Amber) */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-amber-600 truncate">DO Drop</h3>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">09:15 AM</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Dissolved oxygen below threshold (3.0 mg/L)
                  </p>
                </div>
              </div>

              {/* Alert 3: Dosing Cycle Started (Blue) */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-blue-600 truncate">Dosing Cycle Started</h3>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">06:00 AM</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Dosing rate: 8.5 L/hr
                  </p>
                </div>
              </div>

              {/* Alert 4: Sensor Calibration (Green) */}
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-emerald-600 truncate">Sensor Calibration</h3>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">05:30 AM</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    pH sensor calibration completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
