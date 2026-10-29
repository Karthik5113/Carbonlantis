import React, { useState, useEffect } from 'react';
import {
  Menu,
  Clock,
  RefreshCw,
  PanelLeftClose,
  PanelLeftOpen,
  Activity
} from 'lucide-react';
import { DashboardTabId } from '../../types';

interface DashboardTopBarProps {
  activeTab: DashboardTabId;
  onOpenMobileSidebar: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onRefresh,
  isRefreshing = false,
  isSidebarCollapsed = false,
  onToggleSidebar
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getModuleTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return '1. Dashboard — Operational Overview & Feedstock';
      case 'monitoring':
        return '2. Monitoring — Real-Time Sonde Telemetry';
      case 'mineral-dosing':
        return '3. Mineral & Dosing — Feedstock, Slurry & Pumps';
      case 'carbon-removal':
        return '4. Carbon Removal — Chemistry & MRV Accounting';
      case 'users':
        return '5. User Management — Access Controls & Audit';
      case 'settings':
        return '6. Settings — Platform Telemetry & Config';
      default:
        return 'Carbonlantis MRV Platform';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-carbon-border px-4 sm:px-6 lg:px-8 py-3 transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle, Desktop Sidebar Toggle & Active Module Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="p-1.5 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 lg:hidden focus:outline-none cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Left Bar Expand/Shrink Toggle */}
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="hidden lg:flex items-center justify-center p-1.5 rounded-md text-carbon-muted hover:text-carbon-text hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
              title={isSidebarCollapsed ? "Expand sidebar (show full titles)" : "Shrink sidebar (show only icons)"}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Shrink sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          <div>
            <h1 className="text-base sm:text-lg font-semibold text-carbon-text tracking-tight font-sans">
              {getModuleTitle()}
            </h1>
            <p className="text-xs text-carbon-muted hidden sm:block">
              Inland Water Alkalinity Enhancement MRV Platform • Godavari Pilot Catchment
            </p>
          </div>
        </div>

        {/* Right: Telemetry Live Status, Clock & Manual Refresh */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Telemetry Ingest Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 border border-carbon-border text-carbon-text text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ingest: 42.6 pps</span>
          </div>

          {/* Clock */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-50 text-carbon-text text-xs font-mono border border-carbon-border">
            <Clock className="w-3.5 h-3.5 text-carbon-muted" />
            <span>{currentTime}</span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            className={`p-1.5 rounded bg-white hover:bg-slate-50 text-carbon-muted hover:text-carbon-text border border-carbon-border transition-colors ${
              isRefreshing ? 'animate-spin text-carbon-navy' : ''
            }`}
            title="Refresh Ingest Stream"
            aria-label="Refresh telemetry stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
