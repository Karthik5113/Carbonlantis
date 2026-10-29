import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';
import { CarbonlantisLogo } from '../navigation/CarbonlantisLogo';

export const PublicFooter: React.FC = () => {
  const [legalModalContent, setLegalModalContent] = useState<{ title: string; content: string } | null>(null);

  const openLegalModal = (title: string, content: string) => {
    setLegalModalContent({ title, content });
  };

  return (
    <>
      <footer className="w-full bg-[#0B192C] text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Column 1: Logo & Mission */}
            <div className="md:col-span-2 space-y-3 pr-0 md:pr-8">
              <CarbonlantisLogo theme="light" size="md" />
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
                Precision Inland Water Alkalinity Enhancement (IWAE) and continuous Monitoring, Reporting, and Verification (MRV) platform engineered for measurable, durable carbon removal and freshwater ecosystem restoration.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Public Telemetry Gateway: <strong>Operational</strong></span>
              </div>
            </div>

            {/* Column 2: Public Navigation */}
            <div>
              <h3 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3 font-mono">
                Platform
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/mrv" className="text-slate-400 hover:text-white transition-colors">
                    MRV Framework & Sensors
                  </Link>
                </li>
                <li>
                  <Link to="/cdr" className="text-slate-400 hover:text-white transition-colors">
                    CDR Geochemical Pathway
                  </Link>
                </li>
                <li>
                  <Link to="/deployments" className="text-slate-400 hover:text-white transition-colors">
                    Deployment Sites Register
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Access & Portals */}
            <div>
              <h3 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-3 font-mono">
                Operations
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-carbon-aqua hover:text-cyan-300 font-medium transition-colors"
                  >
                    <span>Operator / Verifier Login</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      openLegalModal(
                        'Public Baseline Documentation',
                        'Public documentation provides high-level overviews of IWAE methodology, delta water quality baseline parameters, and standard monitoring sonde calibration intervals. Full MRV calculation ledgers, pump telemetry, and credit issuance audits remain restricted to certified verifiers.'
                      )
                    }
                    className="text-slate-400 hover:text-white transition-colors text-left"
                  >
                    Documentation Baseline
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() =>
                      openLegalModal(
                        'Carbon Removal Standards Alignment',
                        'Carbonlantis aligns with emerging freshwater alkalinity enhancement verification protocols, combining real-time optical sensing with conservative geochemical equilibrium modeling (CO2SYS / geochemical transport equations).'
                      )
                    }
                    className="text-slate-400 hover:text-white transition-colors text-left"
                  >
                    Methodology Standards
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright and Legal */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} Carbonlantis Technologies. All rights reserved.
            </div>

            <div className="flex items-center space-x-4 text-xs">
              <button
                type="button"
                onClick={() =>
                  openLegalModal(
                    'Privacy Notice',
                    'Carbonlantis is committed to data privacy. This public website collects aggregate analytics without persistent profiling cookies. For enterprise users with portal credentials, authentication logs are maintained for verification audit trails.'
                  )
                }
                className="hover:text-slate-200 transition-colors"
              >
                Privacy Notice
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() =>
                  openLegalModal(
                    'Terms of Demonstration',
                    'All public data, illustrative metrics, and deployment map coordinates provided on this pre-login interface are for demonstration and informational purposes only. Commercial reliance requires signed data-access agreements and enterprise authorization.'
                  )
                }
                className="hover:text-slate-200 transition-colors"
              >
                Terms of Use
              </button>
              <span>•</span>
              <span className="font-mono text-slate-400">v0.1.0-prelogin</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Accessible Policy Modal */}
      {legalModalContent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
        >
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-popover border border-carbon-border">
            <div className="flex items-center justify-between mb-3 border-b border-carbon-border pb-2.5">
              <h3 id="modal-title" className="text-base font-semibold text-carbon-text">
                {legalModalContent.title}
              </h3>
              <button
                type="button"
                onClick={() => setLegalModalContent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-carbon-muted leading-relaxed mb-5">
              {legalModalContent.content}
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModalContent(null)}
                className="px-3.5 py-1.5 bg-carbon-navy text-white rounded-md text-xs font-medium hover:bg-[#1A4E78] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
