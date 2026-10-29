import React, { useEffect, useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { DeploymentMapCard } from '../components/home/DeploymentMapCard';
import { AlertsCard } from '../components/home/AlertsCard';
import { publicHomeData } from '../data/publicHome';
import { publicApiService } from '../services/api';
import { AlertItemData, DeploymentSite, StatItem } from '../types';
import { Info, Database } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>(publicHomeData.stats);
  const [deployments, setDeployments] = useState<DeploymentSite[]>(publicHomeData.deployments);
  const [alerts, setAlerts] = useState<AlertItemData[]>(publicHomeData.alerts);
  const [dataSource, setDataSource] = useState<'demo-cache' | 'api'>('demo-cache');
  const [apiNotice, setApiNotice] = useState<string | null>(null);

  // Attempt DRF API fetch on mount with seamless fallback
  useEffect(() => {
    let isMounted = true;

    async function loadPublicData() {
      try {
        const [statsRes, depRes, alertRes] = await Promise.all([
          publicApiService.getPublicStats(),
          publicApiService.getPublicDeployments(),
          publicApiService.getPublicAlerts()
        ]);

        if (isMounted) {
          if (statsRes.isLive) {
            setStats(statsRes.data);
            setDataSource('api');
          }
          if (depRes.isLive) {
            setDeployments(depRes.data);
          }
          if (alertRes.isLive) {
            setAlerts(alertRes.data);
          }
          if (statsRes.error) {
            setApiNotice(statsRes.error);
          }
        }
      } catch (err) {
        console.info('DRF backend offline, rendered demo data successfully.');
      }
    }

    loadPublicData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col w-full bg-carbon-bg">
      {/* 1. Hero Section: Focused headline, concise description, subordinate stats */}
      <HeroSection
        eyebrow={publicHomeData.hero.eyebrow}
        headingPrefix={publicHomeData.hero.headingPrefix}
        headingAccent={publicHomeData.hero.headingAccent}
        supportingHeadline={publicHomeData.hero.supportingHeadline}
        description={publicHomeData.hero.description}
        heroImage={publicHomeData.hero.heroImage}
        stats={stats}
        isDemo={dataSource === 'demo-cache'}
      />

      {/* 2. System Status Ribbon: Live enterprise telemetry strip */}
      <section className="bg-white border-b border-carbon-border py-2 px-4 sm:px-6 lg:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-carbon-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-soft-pulse shrink-0" />
            <span className="font-semibold text-carbon-text">Godavari Delta Pilot Reach:</span>
            <span className="text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded text-[11px]">
              Online & Streaming
            </span>
            <span className="text-slate-300 hidden md:inline">•</span>
            <span className="hidden md:inline text-carbon-text">
              Reach pH: <strong className="text-carbon-navy font-semibold">8.24</strong> <span className="text-emerald-600 text-[11px]">(+0.26 safe margin)</span>
            </span>
            <span className="text-slate-300 hidden lg:inline">•</span>
            <span className="hidden lg:inline text-carbon-text">
              Dosing Rate: <strong className="text-carbon-navy font-semibold">142.8 kg/hr</strong>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-50 border border-carbon-border text-slate-700">
              <Database className="w-3 h-3 text-carbon-navy" />
              <span>Ingest: 42.6 pps (Stream Active)</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3. Primary Content Grid: Deployment Map & Notifications */}
      <section className="w-full py-8 sm:py-10 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left Card: Deployment Map */}
            <div className="h-full">
              <DeploymentMapCard
                deployments={deployments}
                isDemo={dataSource === 'demo-cache'}
              />
            </div>

            {/* Right Card: Telemetry Alerts */}
            <div className="h-full">
              <AlertsCard
                alerts={alerts}
                isDemo={dataSource === 'demo-cache'}
              />
            </div>
          </div>

          {/* Demonstration Notice */}
          <div className="mt-6 p-4 rounded-lg bg-white border border-carbon-border text-xs text-carbon-muted flex items-start gap-3">
            <Info className="w-4 h-4 text-carbon-navy shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-carbon-text">Demonstration Notice: </span>
              {publicHomeData.demoDisclaimer}
              {apiNotice && (
                <div className="mt-1 font-mono text-[11px] text-slate-400">
                  Integration note: {apiNotice}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
