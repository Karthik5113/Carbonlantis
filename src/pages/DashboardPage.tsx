import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { Menu } from 'lucide-react';
import { DashboardOverviewTab } from '../components/dashboard/tabs/DashboardOverviewTab';
import { MonitoringTab } from '../components/dashboard/tabs/MonitoringTab';
import { MineralDosingTab } from '../components/dashboard/tabs/MineralDosingTab';
import { DosingTab } from '../components/dashboard/tabs/DosingTab';
import { CarbonRemovalTab } from '../components/dashboard/tabs/CarbonRemovalTab';
import { UserManagementTab } from '../components/dashboard/tabs/UserManagementTab';
import { SettingsTab } from '../components/dashboard/tabs/SettingsTab';
import { DashboardTabId } from '../types';
import { SlurryDosingProvider } from '../context/SlurryDosingContext';

export const DashboardPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get('tab');
  const initialTab: DashboardTabId =
    rawTab === 'monitoring' ||
    rawTab === 'slurry-preparation' ||
    rawTab === 'mineral-dosing' ||
    rawTab === 'dosing' ||
    rawTab === 'carbon-removal' ||
    rawTab === 'users' ||
    rawTab === 'settings'
      ? (rawTab as DashboardTabId)
      : 'dashboard';

  const [activeTab, setActiveTab] = useState<DashboardTabId>(initialTab);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Persistent sidebar collapsed/expanded state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('carbonlantis_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('carbonlantis_sidebar_collapsed', String(next));
      } catch {}
      return next;
    });
  };

  // Sync tab with URL search parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab') as DashboardTabId;
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: DashboardTabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverviewTab />;
      case 'monitoring':
        return <MonitoringTab />;
      case 'slurry-preparation':
      case 'mineral-dosing':
        return <MineralDosingTab />;
      case 'dosing':
        return <DosingTab />;
      case 'carbon-removal':
        return <CarbonRemovalTab />;
      case 'users':
        return <UserManagementTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardOverviewTab />;
    }
  };

  return (
    <SlurryDosingProvider>
      <div className="flex min-h-screen bg-carbon-bg text-carbon-text font-sans">
        {/* 1. Left Menu Bar (Sidebar) with collapsible / expandable functionality */}
      <DashboardSidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
      />

      {/* 2. Main Content Area (Dynamic desktop offset matching collapsed/expanded sidebar) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-80'
        }`}
      >
        {/* Mobile Header Bar (Only visible on small screens < lg) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-white border-b border-carbon-border">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-slate-800">Carbonlantis MRV</span>
        </div>

        {/* Dynamic Tab Content Area */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  </SlurryDosingProvider>
  );
};

