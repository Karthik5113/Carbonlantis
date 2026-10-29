import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  RefreshCw,
  LogOut,
  ExternalLink,
  User,
  Radio,
  Clock,
  ChevronDown,
  Layers,
  Activity,
  Sliders,
  Scale,
  FileCheck2,
  Box
} from 'lucide-react';
import { CarbonlantisLogo } from '../navigation/CarbonlantisLogo';
import { DUMMY_LOGIN_CREDENTIALS } from '../../pages/LoginPage';
import { authService } from '../../services/auth';

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  isRefreshing = false,
  activeTab = 'dashboard',
  onTabChange
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
        ' UTC' + (now.getTimezoneOffset() <= 0 ? '+' : '-') +
        Math.abs(Math.floor(now.getTimezoneOffset() / 60))
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'dashboard', name: '1. Dashboard', icon: Activity, active: true },
    { id: 'telemetry', name: '2. Live Telemetry', icon: Radio, phase: 'Phase 2' },
    { id: 'dosing', name: '3. Dosing Operations', icon: Sliders, phase: 'Phase 2' },
    { id: 'inventory', name: '4. Mineral Inventory', icon: Box, phase: 'Phase 2' },
    { id: 'calculations', name: '5. MRV Calculations', icon: Scale, phase: 'Phase 2' },
    { id: 'audit', name: '6. Verifier Audit', icon: FileCheck2, phase: 'Phase 2' },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'dashboard') {
      if (onTabChange) onTabChange('dashboard');
    } else {
      alert(`The "${tabId}" module is scheduled for Phase 2 integration with the Django REST Framework backend.`);
    }
  };

  const handleSignOut = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A1628] border-b border-slate-800 text-white shadow-lg">
      {/* Top Bar: Brand, Status, Real-time Clock & Operator Profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 border-b border-slate-800/80">
          {/* Left Brand */}
          <div className="flex items-center gap-4">
            <CarbonlantisLogo theme="light" size="sm" />
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                Enterprise MRV
              </span>
              <span className="text-xs text-slate-400 hidden lg:inline">
                Catchment: Godavari Delta Basin
              </span>
            </div>
          </div>

          {/* Right System Bar: Live Clock, Refresh, Operator */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Live Clock */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentTime}</span>
            </div>

            {/* Auto Refresh Trigger */}
            <button
              type="button"
              onClick={onRefresh}
              className={`p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors ${
                isRefreshing ? 'animate-spin text-cyan-400' : ''
              }`}
              title="Manual Telemetry Ingest Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Operator Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 transition-all focus:outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                  EV
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block font-bold leading-tight">{DUMMY_LOGIN_CREDENTIALS.name}</span>
                  <span className="block text-[10px] text-cyan-400 leading-tight">Lead Scientist</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F2036] border border-slate-700 p-3 shadow-2xl text-xs z-50">
                  <div className="border-b border-slate-800 pb-2 mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Signed In As
                    </span>
                    <strong className="text-white block font-sans">{DUMMY_LOGIN_CREDENTIALS.email}</strong>
                    <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">
                      {DUMMY_LOGIN_CREDENTIALS.accessLevel}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <Link
                      to="/"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Public Landing Page</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out (End Session)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar: 6-Tab Navigation Bar */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2.5 text-xs scrollbar-none" aria-label="MRV Dashboard Navigation Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold tracking-wide transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.name}</span>
                {tab.phase && (
                  <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                    {tab.phase}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

