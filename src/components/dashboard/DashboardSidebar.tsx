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
  X,
  FlaskConical,
  Navigation,
  Menu
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

  // Clean Tab Navigation Modules (no numbers, no subtext, no prefixes)
  const navModules: {
    id: DashboardTabId;
    title: string;
    icon: React.ElementType;
  }[] = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'monitoring',
      title: 'Monitoring',
      icon: Activity
    },
    {
      id: 'slurry-preparation',
      title: 'Mineral & Dosing',
      icon: FlaskConical
    },
    {
      id: 'dosing',
      title: 'Dosing',
      icon: Navigation
    },
    {
      id: 'carbon-removal',
      title: 'Carbon Removal',
      icon: Sparkles
    },
    {
      id: 'users',
      title: 'User Management',
      icon: Users
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: Settings
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
          isMobileOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0'
        } ${isEffectiveCollapsed ? 'lg:w-20' : 'lg:w-80'}`}
        aria-label="Platform Sidebar"
      >
        {/* Top Header & Modules List */}
        <div className="overflow-y-auto overflow-x-hidden flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Header Brand Bar */}
          {isEffectiveCollapsed ? (
            <div className="py-3.5 px-2 border-b border-slate-800/80 flex flex-col items-center gap-3">
              <div
                onClick={onToggleCollapse}
                className="cursor-pointer group flex flex-col items-center transition-transform hover:scale-105"
                title="Expand sidebar"
              >
                <CarbonlantisLogo theme="light" size="sm" showText={false} />
              </div>
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white bg-[#0e2440] hover:bg-slate-800 border border-slate-700/60 transition-colors focus:outline-none cursor-pointer"
                  title="Expand sidebar"
                  aria-label="Expand sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : (
            <div className="px-4 py-3.5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CarbonlantisLogo theme="light" size="sm" />
              </div>
              <div className="flex items-center gap-1.5">
                {/* Single Hamburger Menu Icon to Toggle Sidebar */}
                {onToggleCollapse && (
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
                    title="Toggle sidebar"
                    aria-label="Toggle sidebar"
                  >
                    <Menu className="w-5 h-5" />
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

          {/* Navigation Modules Menu List */}
          {isEffectiveCollapsed ? (
            <nav className="p-2 space-y-1.5 flex flex-col items-center mt-3" aria-label="Platform Modules">
              {navModules.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'slurry-preparation' && activeTab === 'mineral-dosing');

                return (
                  <div key={item.id} className="relative group flex justify-center w-full">
                    <button
                      type="button"
                      onClick={() => handleModuleClick(item.id)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                      }`}
                      title={item.title}
                      aria-label={item.title}
                    >
                      <Icon className="w-4 h-4" />
                    </button>

                    {/* Floating Tooltip Card */}
                    <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none">
                      <div className="bg-[#071322] text-white px-3 py-1.5 rounded-xl shadow-xl border border-slate-700 whitespace-nowrap text-xs font-semibold">
                        {item.title}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          ) : (
            <nav className="p-3 space-y-1 mt-2" aria-label="Platform Modules">
              {navModules.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeTab === item.id ||
                  (item.id === 'slurry-preparation' && activeTab === 'mineral-dosing');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleModuleClick(item.id)}
                    className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-150 group text-left cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/25'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800/80 text-cyan-400 group-hover:text-cyan-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className="text-xs font-semibold truncate text-white">
                      {item.title}
                    </span>
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
          <div className="p-2.5 border-t border-slate-800/80 bg-[#050e18] space-y-2">
            {/* Operator Profile Card */}
            <div className="p-2 rounded-xl bg-[#08182b] border border-slate-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full border border-cyan-500/40 text-cyan-400 bg-[#0c223c] flex items-center justify-center font-bold text-[11px] shrink-0">
                EV
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white block truncate leading-tight">
                  {DUMMY_LOGIN_CREDENTIALS.name}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono block truncate mt-0.5">
                  {DUMMY_LOGIN_CREDENTIALS.role}
                </span>
              </div>
            </div>

            {/* Quick Actions (Two Pill Buttons) */}
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <Link
                to="/"
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#0b192c] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors text-center text-[11px] font-medium cursor-pointer"
                title="Return to public landing page"
              >
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>Public Site</span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#0b192c] hover:bg-rose-950/40 text-rose-300 hover:text-white border border-rose-900/40 transition-colors text-center text-[11px] font-medium cursor-pointer"
                title="Sign out of MRV session"
              >
                <LogOut className="w-3 h-3 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
