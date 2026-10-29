import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn } from 'lucide-react';
import { CarbonlantisLogo } from './CarbonlantisLogo';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Primary navigation according to design guidelines: Home, MRV, CDR, Login
  const primaryLinks = [
    { name: 'Home', path: '/' },
    { name: 'MRV Framework', path: '/mrv' },
    { name: 'CDR Science', path: '/cdr' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B192C] border-b border-slate-800 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8">
          <CarbonlantisLogo theme="light" size="md" />

          {/* Desktop Primary Navigation */}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Main Navigation">
            {primaryLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors py-1 ${
                    isActive
                      ? 'text-white border-b-2 border-carbon-aqua'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right: Secondary Action / Operator Login */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/deployments"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors py-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-soft-pulse" />
            <span>Deployments Register</span>
          </Link>

          <Link
            to="/login"
            className="btn-press inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-carbon-navy hover:bg-[#1A4E78] border border-slate-700/80 transition-all focus-visible:ring-2 focus-visible:ring-carbon-aqua shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-carbon-aqua" />
            <span>Operator Login</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-carbon-aqua"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071322] border-b border-slate-800 px-4 pt-2 pb-5 space-y-1.5">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to="/deployments"
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`
            }
          >
            Deployments Register
          </NavLink>
          <div className="pt-3 mt-2 border-t border-slate-800">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-md text-sm font-medium text-white bg-carbon-navy hover:bg-[#1A4E78] transition-colors"
            >
              <LogIn className="w-4 h-4 text-carbon-aqua" />
              <span>Operator Login</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
