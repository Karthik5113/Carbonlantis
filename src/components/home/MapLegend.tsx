import React from 'react';

interface MapLegendProps {
  className?: string;
  selectedFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  className = '',
  selectedFilter = 'all',
  onFilterChange
}) => {
  const items = [
    {
      type: 'mobile-dosing',
      label: 'Mobile Dosing Platform (MDP)',
      dotColor: 'bg-blue-600',
    },
    {
      type: 'mrv-station',
      label: 'Continuous MRV Station',
      dotColor: 'bg-emerald-600',
    },
    {
      type: 'planned',
      label: 'Planned Station',
      dotColor: 'bg-purple-600',
    }
  ];

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-xs ${className}`}
      aria-label="Map Marker Legend and Filters"
    >
      <button
        type="button"
        onClick={() => onFilterChange && onFilterChange('all')}
        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
          selectedFilter === 'all'
            ? 'bg-carbon-navy text-white border-carbon-navy'
            : 'bg-white text-carbon-muted border-carbon-border hover:bg-slate-50'
        }`}
        aria-pressed={selectedFilter === 'all'}
      >
        All Sites
      </button>

      {items.map((item) => {
        const isSelected = selectedFilter === item.type;
        return (
          <button
            key={item.type}
            type="button"
            onClick={() => onFilterChange && onFilterChange(isSelected ? 'all' : item.type)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
              isSelected
                ? 'bg-carbon-navy text-white border-carbon-navy'
                : 'bg-white text-carbon-text border-carbon-border hover:bg-slate-50'
            }`}
            aria-pressed={isSelected}
          >
            <span className={`w-2 h-2 rounded-full ${item.dotColor} shrink-0`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
