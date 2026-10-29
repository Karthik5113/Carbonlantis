import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const CarbonlantisLogo: React.FC<LogoProps> = ({
  className = '',
  theme = 'dark',
  size = 'md',
  showText = true
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9'
  };

  const textSizes = {
    sm: 'text-sm font-semibold tracking-tight',
    md: 'text-base font-semibold tracking-tight',
    lg: 'text-xl font-semibold tracking-tight'
  };

  const isLight = theme === 'light';

  return (
    <Link
      to="/"
      className={`group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-carbon-aqua rounded-md transition-opacity hover:opacity-90 ${className}`}
      aria-label="Carbonlantis MRV Platform Home"
    >
      {/* Precision Brand Mark */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Outer circle */}
          <circle
            cx="16"
            cy="16"
            r="15"
            stroke={isLight ? "#FFFFFF" : "#172B3A"}
            strokeWidth="1.25"
            strokeOpacity={isLight ? 0.35 : 0.25}
          />
          {/* Geochemical Alkalinity Octagon */}
          <polygon
            points="16,4 25,8 28,17 23,26 16,28 9,26 4,17 7,8"
            fill={isLight ? "rgba(67, 198, 217, 0.12)" : "rgba(18, 59, 93, 0.08)"}
            stroke={isLight ? "#43C6D9" : "#123B5D"}
            strokeWidth="1.25"
          />
          {/* Riverine wave */}
          <path
            d="M8 18C11 15 14 21 17 18C20 15 23 20 25 17"
            stroke={isLight ? "#FFFFFF" : "#123B5D"}
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          {/* Carbon node */}
          <circle cx="16" cy="11" r="2.25" fill="#43C6D9" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-semibold ${textSizes[size]} ${
              isLight ? 'text-white' : 'text-carbon-text'
            }`}
          >
            Carbon<span className={isLight ? "text-carbon-aqua" : "text-carbon-navy"}>lantis</span>
          </span>
          <span
            className={`text-[9px] uppercase tracking-widest font-mono font-medium mt-0.5 ${
              isLight ? 'text-slate-400' : 'text-carbon-muted'
            }`}
          >
            MRV Platform
          </span>
        </div>
      )}
    </Link>
  );
};
