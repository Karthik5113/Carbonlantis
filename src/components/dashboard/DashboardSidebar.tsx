import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Droplets,
  Sparkles,
  Users,
  Settings,
  ExternalLink,
  LogOut,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CarbonlantisLogo } from '../navigation/CarbonlantisLogo';
import { DUMMY_LOGIN_CREDENTIALS } from '../../pages/LoginPage';
import { DashboardTabId } from '../../types';
import { authService } from '../../services/auth';

interface DashboardSidebarProps {
  activeTab: DashboardTabId;
  onTabChange: (tabId: DashboardTabId) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  isMobileOpen = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const navigate = useNavigate();
  const isEffectiveCollapsed = isCollapsed && !isMobileOpen;

  // The 6 Finalized Dashboard Navigation Modules
  const navModules: {
    id: DashboardTabId;
    title: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      title: '1. Dashboard',
      description: 'Platform overview, assets & status',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      id: 'monitoring',
      title: '2. Monitoring',
      description: 'Sensors, graphs & GPS tracking',
      icon: Activity,
      badge: '1 Hz'
    },
    {
      id: 'mineral-dosing',
      title: '3. Mineral & Dosing',
      description: 'Feedstock, slurry & pumps',
      icon: Droplets,
    },
    {
      id: 'carbon-removal',
      title: '4. Carbon Removal',
      description: 'Chemistry, DIC & MRV reports',
      icon: Sparkles,
      badge: 'MRV'
    },
    {
      id: 'users',
      title: '5. User Management',
      description: 'Accounts, roles & access logs',
      icon: Users,
    },
    {
      id: 'settings',
      title: '6. Settings',
      description: 'Backups, assets & platform config',
      icon: Settings,
    }
  ];

  const handleModuleClick = (tabId: DashboardTabId) => {
    onTabChange(tabId);
    if (onCloseMobile) onCloseMobile();
  };

  const handleSignOut = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Left Menu Bar Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#071322] border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isEffectiveCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
        aria-label="Enterprise MRV Platform Sidebar"
      >
        {/* Floating Toggle Pill on Desktop Sidebar Edge */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-16 z-50 w-6 h-6 rounded-full bg-[#0a1e38] border border-cyan-500/50 text-cyan-300 shadow-md hover:bg-cyan-500 hover:text-white items-center justify-center transition-all duration-200 cursor-pointer focus:outline-none"
            title={isEffectiveCollapsed ? 'Expand sidebar (show full menu)' : 'Shrink sidebar (show only icons)'}
            aria-label={isEffectiveCollapsed ? 'Expand sidebar' : 'Shrink sidebar'}
          >
            {isEffectiveCollapsed ? (
              <ChevronRight className="w-3.5 h-3.5" />
            ) : (
              <ChevronLeft className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* Top Header & Modules List */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-none">
          {/* Header Brand Bar */}
          {isEffectiveCollapsed ? (
            <div className="py-4 px-2 border-b border-slate-800/80 flex flex-col items-center gap-3">
              <div
                onClick={onToggleCollapse}
                className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-105"
                title="Expand sidebar (click to expand)"
              >
                <CarbonlantisLogo theme="light" size="sm" showText={false} />
              </div>
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-cyan-400 hover:text-white bg-[#0e2440] hover:bg-cyan-600/80 border border-cyan-800/50 transition-colors focus:outline-none cursor-pointer"
                  title="Expand sidebar (show full menu)"
                  aria-label="Expand sidebar"
                >
                  <PanelLeftOpen className="w-4 h-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CarbonlantisLogo theme="light" size="md" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase bg-[#0c223c] text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded font-semibold tracking-wider">
                  MRV V2.4
                </span>
                {/* Desktop Collapse Toggle */}
                {onToggleCollapse && (
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
                    title="Shrink sidebar (show only icons)"
                    aria-label="Shrink sidebar"
                  >
                    <PanelLeftClose className="w-4 h-4 text-cyan-400" />
                  </button>
                )}
                {/* Mobile Close Button */}
                {onCloseMobile && (
                  <button
                    type="button"
                    onClick={onCloseMobile}
                    className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
                    title="Close sidebar"
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Catchment Scope Bar (Godavari Delta Basin / Active Fleet) */}
          {isEffectiveCollapsed ? (
            <div
              onClick={onToggleCollapse}
              className="py-2.5 flex items-center justify-center bg-[#050e18] border-b border-slate-800/80 relative group cursor-pointer hover:bg-slate-800/40 transition-colors"
              title="Godavari Delta Basin • Active Fleet (Click to expand)"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#071322] text-slate-200 border border-slate-700 rounded-md text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-popover flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-white">Godavari Delta Reach</span>
                <span className="text-cyan-400 font-mono text-[10px]">Active Fleet</span>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2.5 bg-[#050e18] border-b border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-white font-medium truncate text-xs">
                  Godavari Delta Basin
                </span>
              </div>
              <span className="text-[11px] font-mono font-medium text-cyan-400">
                Active Fleet
              </span>
            </div>
          )}

          {/* 6 Navigation Modules Menu List */}
          {isEffectiveCollapsed ? (
            <nav className="p-2 space-y-2 flex flex-col items-center mt-2" aria-label="MRV Platform Modules">
              {navModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <div key={item.id} className="relative group flex justify-center w-full">
                    <button
                      type="button"
                      onClick={() => handleModuleClick(item.id)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                          : 'bg-[#0d223c] text-cyan-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/60'
                      }`}
                      title={`${item.title}: ${item.description}`}
                      aria-label={item.title}
                    >
                      <Icon className="w-5 h-5" />
                      {item.badge && !isActive && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5" />
                      )}
                    </button>

                    {/* Floating Tooltip Card */}
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                      <div className="bg-[#071322] text-white px-3 py-2 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap min-w-[190px] flex flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-white">{item.title}</span>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-mono font-medium bg-[#132c54] text-cyan-300 border border-cyan-800/60">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          ) : (
            <nav className="p-3 space-y-1.5" aria-label="MRV Platform Modules">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                MRV PLATFORM MODULES
              </div>

              {navModules.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleModuleClick(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 group text-left cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-300 hover:bg-[#0c2038]/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon Container */}
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-[#0d223c] text-cyan-400 group-hover:text-cyan-300'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Title & Description */}
                      <div className="truncate">
                        <div className="text-sm font-bold leading-tight truncate text-white">
                          {item.title}
                        </div>
                        <div
                          className={`text-xs truncate font-normal mt-0.5 ${
                            isActive ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {/* Badge & Chevron */}
                    <div className="flex items-center gap-1.5 shrink-0 pl-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                            isActive
                              ? 'bg-[#0e2752] text-white border border-blue-400/30'
                              : 'bg-[#132c54]/80 text-cyan-300 border border-cyan-800/50'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isActive
                            ? 'text-white translate-x-0.5'
                            : 'text-slate-600 group-hover:text-slate-400'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </nav>
          )}
        </div>

        {/* Bottom Section: Operator Profile & Quick Actions */}
        {isEffectiveCollapsed ? (
          <div className="p-2 border-t border-slate-800/80 bg-[#050e18] flex flex-col items-center gap-2">
            {/* Operator Avatar */}
            <div className="relative group flex justify-center">
              <div
                className="w-10 h-10 rounded-full border border-cyan-500/40 text-cyan-400 bg-[#0c223c] flex items-center justify-center font-bold text-xs cursor-default"
                title={`${DUMMY_LOGIN_CREDENTIALS.name} (${DUMMY_LOGIN_CREDENTIALS.role})`}
              >
                EV
              </div>
              <div className="absolute left-full ml-3 bottom-0 hidden group-hover:flex items-center z-50 pointer-events-none">
                <div className="bg-[#071322] text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap">
                  <div className="text-xs font-bold text-white">{DUMMY_LOGIN_CREDENTIALS.name}</div>
                  <div className="text-[10px] text-cyan-400 font-mono">{DUMMY_LOGIN_CREDENTIALS.role}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions (Icons) */}
            <div className="relative group flex justify-center">
              <Link
                to="/"
                className="w-9 h-9 rounded-xl bg-[#0b192c] hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                title="Return to Public Site"
                aria-label="Public Site"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                <div className="bg-[#071322] text-white px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap text-xs">
                  Public Site
                </div>
              </div>
            </div>

            <div className="relative group flex justify-center">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-9 h-9 rounded-xl bg-[#0b192c] hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-900/40 flex items-center justify-center transition-colors cursor-pointer"
                title="Sign out and lock session"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                <div className="bg-[#071322] text-rose-300 px-2.5 py-1 rounded-lg shadow-xl border border-slate-700 whitespace-nowrap text-xs">
                  Sign Out
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 border-t border-slate-800/80 bg-[#050e18] space-y-2.5">
            {/* Operator Profile Card */}
            <div className="p-3 rounded-2xl bg-[#08182b] border border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-cyan-500/40 text-cyan-400 bg-[#0c223c] flex items-center justify-center font-bold text-xs shrink-0">
                EV
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-bold text-white block truncate leading-tight">
                  {DUMMY_LOGIN_CREDENTIALS.name}
                </span>
                <span className="text-xs text-cyan-400 block truncate mt-0.5">
                  {DUMMY_LOGIN_CREDENTIALS.role}
                </span>
              </div>
            </div>

            {/* Quick Actions (Two Pill Buttons) */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/"
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0b192c] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-center text-xs font-medium cursor-pointer"
                title="Return to public landing page"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Public Site</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0b192c] hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-900/40 transition-colors text-center text-xs font-medium cursor-pointer"
                title="Sign out and lock session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
