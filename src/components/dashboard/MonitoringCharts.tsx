import React, { useState } from 'react';
import {
  Activity,
  Droplets,
  AlertTriangle,
  Scale,
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';
import { MonitoringTimeseriesPoint } from '../../types';

interface MonitoringChartsProps {
  timeseries: MonitoringTimeseriesPoint[];
}

export const MonitoringCharts: React.FC<MonitoringChartsProps> = ({ timeseries }) => {
  const [activeMetric, setActiveMetric] = useState<'ph' | 'co2' | 'oxygen'>('ph');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [hoveredPoint, setHoveredPoint] = useState<MonitoringTimeseriesPoint | null>(null);

  // Chart Dimensions
  const width = 640;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 30, left: 45 };

  // Generate SVG path for pH curve
  const minPh = 7.4;
  const maxPh = 8.6;

  const getX = (index: number) => {
    return padding.left + (index / (timeseries.length - 1)) * (width - padding.left - padding.right);
  };

  const getYPh = (val: number) => {
    return padding.top + ((maxPh - val) / (maxPh - minPh)) * (height - padding.top - padding.bottom);
  };

  const phPointsString = timeseries
    .map((d, i) => `${getX(i)},${getYPh(d.ph)}`)
    .join(' ');

  const phAreaString = `${getX(0)},${height - padding.bottom} ` +
    phPointsString +
    ` ${getX(timeseries.length - 1)},${height - padding.bottom}`;

  const ceilingY = getYPh(8.50);
  const baselineY = getYPh(7.70);

  // Generate SVG path for CO2 / Alkalinity
  const maxAlkalinity = 220;
  const getYAlk = (val: number) => {
    return padding.top + ((maxAlkalinity - val) / maxAlkalinity) * (height - padding.top - padding.bottom);
  };

  const alkPointsString = timeseries
    .map((d, i) => `${getX(i)},${getYAlk(d.alkalinityDosedKg)}`)
    .join(' ');

  const co2PointsString = timeseries
    .map((d, i) => `${getX(i)},${getYAlk(d.co2DrawdownKg * 1.3)}`)
    .join(' ');

  return (
    <div className="bg-white rounded-lg border border-carbon-border shadow-card p-4 sm:p-5 flex flex-col justify-between">
      {/* Top Header & Metric Selectors */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-carbon-border pb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-base font-semibold text-carbon-text">
                Real-Time Multi-Parameter Monitoring
              </h2>
              <span className="text-[10px] font-mono bg-slate-100 text-carbon-navy px-2 py-0.5 rounded border border-carbon-border">
                1 Hz Ingest
              </span>
            </div>
            <p className="text-xs text-carbon-muted">
              High-resolution in-situ sensor telemetry & geochemical mass-balance verification
            </p>
          </div>

          {/* Time range selector */}
          <div className="flex items-center bg-slate-50 border border-carbon-border p-0.5 rounded-md text-xs self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setTimeRange('24h')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                timeRange === '24h' ? 'bg-carbon-navy text-white shadow-xs' : 'text-carbon-muted hover:text-carbon-text'
              }`}
            >
              24h
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                timeRange === '7d' ? 'bg-carbon-navy text-white shadow-xs' : 'text-carbon-muted hover:text-carbon-text'
              }`}
            >
              7 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                timeRange === '30d' ? 'bg-carbon-navy text-white shadow-xs' : 'text-carbon-muted hover:text-carbon-text'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Metric Mode Toggle Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button
            type="button"
            onClick={() => setActiveMetric('ph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              activeMetric === 'ph'
                ? 'bg-carbon-navy text-white border-carbon-navy'
                : 'bg-white text-carbon-text border-carbon-border hover:bg-slate-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>pH vs Safety Ceiling (8.50)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('co2')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              activeMetric === 'co2'
                ? 'bg-carbon-navy text-white border-carbon-navy'
                : 'bg-white text-carbon-text border-carbon-border hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Alkalinity vs CO₂ Capture</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMetric('oxygen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              activeMetric === 'oxygen'
                ? 'bg-carbon-navy text-white border-carbon-navy'
                : 'bg-white text-carbon-text border-carbon-border hover:bg-slate-50'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Dissolved Oxygen (DO) & Temp</span>
          </button>
        </div>

        {/* SVG Chart Container */}
        <div className="relative w-full overflow-hidden bg-slate-50/70 rounded-xl p-2 border border-slate-200/80">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 sm:h-64 overflow-visible">
            {/* Gradients */}
            <defs>
              <linearGradient id="phAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="co2AreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[7.6, 7.8, 8.0, 8.2, 8.4, 8.6].map((tick) => (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={getYPh(tick)}
                  x2={width - padding.right}
                  y2={getYPh(tick)}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={getYPh(tick) + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#94A3B8"
                  fontFamily="monospace"
                >
                  {tick.toFixed(1)}
                </text>
              </g>
            ))}

            {activeMetric === 'ph' && (
              <>
                {/* Strict Safety Threshold Ceiling Line: 8.50 pH */}
                <line
                  x1={padding.left}
                  y1={ceilingY}
                  x2={width - padding.right}
                  y2={ceilingY}
                  stroke="#EF4444"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <text
                  x={width - padding.right}
                  y={ceilingY - 5}
                  textAnchor="end"
                  fontSize="9.5"
                  fill="#DC2626"
                  fontWeight="bold"
                  fontFamily="Inter, sans-serif"
                >
                  Safety Ceiling Threshold (8.50 pH)
                </text>

                {/* Upstream Baseline Line: 7.70 pH */}
                <line
                  x1={padding.left}
                  y1={baselineY}
                  x2={width - padding.right}
                  y2={baselineY}
                  stroke="#64748B"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={width - padding.right}
                  y={baselineY + 12}
                  textAnchor="end"
                  fontSize="9"
                  fill="#64748B"
                  fontFamily="Inter, sans-serif"
                >
                  Upstream Reach Baseline (~7.70)
                </text>

                {/* pH Filled Area */}
                <polygon points={phAreaString} fill="url(#phAreaGradient)" />

                {/* pH Main Curve */}
                <polyline
                  points={phPointsString}
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Interactive Points */}
                {timeseries.map((pt, i) => (
                  <circle
                    key={pt.time}
                    cx={getX(i)}
                    cy={getYPh(pt.ph)}
                    r="4"
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </>
            )}

            {activeMetric === 'co2' && (
              <>
                {/* Alkalinity Dosed Curve */}
                <polyline
                  points={alkPointsString}
                  fill="none"
                  stroke="#123B5D"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* CO2 Drawdown Curve */}
                <polyline
                  points={co2PointsString}
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Interactive Points */}
                {timeseries.map((pt, i) => (
                  <circle
                    key={pt.time}
                    cx={getX(i)}
                    cy={getYAlk(pt.co2DrawdownKg * 1.3)}
                    r="4"
                    fill="#059669"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </>
            )}

            {activeMetric === 'oxygen' && (
              <>
                {/* Dissolved Oxygen */}
                <polyline
                  points={timeseries.map((d, i) => `${getX(i)},${padding.top + ((8.0 - d.dissolvedOxygen) / 2.0) * (height - padding.top - padding.bottom)}`).join(' ')}
                  fill="none"
                  stroke="#43C6D9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Interactive Points */}
                {timeseries.map((pt, i) => (
                  <circle
                    key={pt.time}
                    cx={getX(i)}
                    cy={padding.top + ((8.0 - pt.dissolvedOxygen) / 2.0) * (height - padding.top - padding.bottom)}
                    r="4"
                    fill="#43C6D9"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </>
            )}

            {/* X Axis Time Labels */}
            {timeseries.map((pt, i) => (
              <text
                key={pt.time}
                x={getX(i)}
                y={height - 8}
                textAnchor="middle"
                fontSize="9"
                fill="#64748B"
                fontFamily="monospace"
              >
                {pt.time}
              </text>
            ))}
          </svg>

          {/* Hover Point Tooltip Overlay */}
          {hoveredPoint && (
            <div className="absolute top-3 left-14 bg-[#0B192C] text-white p-2.5 rounded-md shadow-popover border border-slate-700 text-[11px] font-mono pointer-events-none z-10 animate-in fade-in duration-100">
              <div className="text-carbon-aqua font-bold mb-1">Time: {hoveredPoint.time}</div>
              <div>Current pH: <strong className="text-white">{hoveredPoint.ph}</strong></div>
              <div>Ceiling Margin: <strong className="text-emerald-400">+{(8.50 - hoveredPoint.ph).toFixed(2)} pH safe</strong></div>
              <div>Alkalinity Feed: <strong>{hoveredPoint.alkalinityDosedKg} kg/hr</strong></div>
              <div>DO: <strong>{hoveredPoint.dissolvedOxygen} mg/L</strong> | Temp: <strong>{hoveredPoint.temp}°C</strong></div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Legend Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600" />
            <span>Measured pH</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-rose-500" />
            <span>Regulatory Limit (8.50)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-400 border-dashed" />
            <span>Baseline Reach</span>
          </span>
        </div>

        <span className="font-mono text-slate-400">
          Optimal buffering envelope maintained
        </span>
      </div>
    </div>
  );
};

