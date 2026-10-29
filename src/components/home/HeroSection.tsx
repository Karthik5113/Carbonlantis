import React from 'react';
import { ArrowRight, BookOpen, Activity, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatItem } from '../../types';
import { PlatformStats } from './PlatformStats';

interface HeroSectionProps {
  eyebrow?: string;
  headingPrefix?: string;
  headingAccent?: string;
  supportingHeadline?: string;
  description?: string;
  heroImage?: string;
  stats: StatItem[];
  isDemo?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  eyebrow = "INLAND WATER ALKALINITY ENHANCEMENT (IWAE)",
  headingPrefix = "Carbonlantis ",
  headingAccent = "MRV Platform",
  description = "A data-driven MRV platform for precision alkalinity dosing in inland waters to enhance durable carbon removal and support healthier freshwater ecosystems.",
  heroImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=80",
  stats,
  isDemo = true
}) => {
  return (
    <section className="relative w-full bg-[#0B192C] text-white overflow-hidden border-b border-slate-800">
      {/* Background Aerial with Ambient Aquatic Luminous Gradient */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img
          src={heroImage}
          alt="Inland waterway catchment"
          className="w-full h-full object-cover object-center opacity-25 filter saturate-100"
          loading="eager"
        />

        {/* Ambient Luminous Aqua Glow Floating Blob */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-carbon-aqua/10 blur-[100px] animate-ambient-flow" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 rounded-full bg-carbon-navy/30 blur-[120px] animate-ambient-flow" style={{ animationDelay: '4s' }} />

        {/* Navy Depth Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B192C]/75 via-[#0B192C]/90 to-[#0B192C]" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-10 sm:pb-12">
        <div className="max-w-3xl mb-8 sm:mb-10">
          {/* Live Telemetry Heartbeat Pill */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#071322]/85 border border-slate-700/80 text-xs font-mono text-slate-300 mb-4 shadow-sm backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-soft-pulse" />
            <span className="text-slate-300 font-medium">LIVE TELEMETRY STREAM</span>
            <span className="text-slate-500">•</span>
            <span className="text-carbon-aqua font-semibold">1 Hz Sonde Array</span>
          </div>

          {/* Main Heading: 28-34px semibold with subtle aqua shimmer */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3.5 font-sans leading-tight">
            <span>{headingPrefix}</span>
            <span className="text-carbon-aqua">{headingAccent}</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mb-6 font-normal">
            {description}
          </p>

          {/* Interactive CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/deployments"
              className="btn-press inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-white bg-carbon-navy hover:bg-[#1A4E78] border border-slate-700/80 transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-carbon-aqua"
            >
              <span>Explore Deployment Sites</span>
              <ArrowRight className="w-4 h-4 text-carbon-aqua transition-transform group-hover:translate-x-0.5" />
            </Link>

            <Link
              to="/mrv"
              className="btn-press inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/70 transition-all focus-visible:ring-2 focus-visible:ring-carbon-aqua"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>MRV Methodology</span>
            </Link>
          </div>
        </div>

        {/* Subordinate Platform Statistics */}
        <div className="pt-1">
          <PlatformStats stats={stats} isDemo={isDemo} />
        </div>
      </div>
    </section>
  );
};
