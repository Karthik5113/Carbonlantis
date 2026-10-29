import React from 'react';
import { StatItem } from '../../types';
import { StatCard } from './StatCard';

interface PlatformStatsProps {
  stats: StatItem[];
  isDemo?: boolean;
}

export const PlatformStats: React.FC<PlatformStatsProps> = ({ stats, isDemo = true }) => {
  return (
    <div
      aria-label="Platform Summary Statistics"
      className="w-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} stat={stat} isDemo={isDemo} />
        ))}
      </div>
    </div>
  );
};
