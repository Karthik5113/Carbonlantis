import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LayoutDashboard,
  ShieldAlert
} from 'lucide-react';
import { CarbonlantisLogo } from '../components/navigation/CarbonlantisLogo';
import { authService } from '../services/auth';

// Configurable dummy credentials for review and testing
export const DUMMY_LOGIN_CREDENTIALS = {
  email: 'operator@carbonlantis.com',
  password: 'Carbonlantis2026!',
  name: 'Dr. Elena Vance',
  role: 'Lead MRV Scientist / Fleet Operator',
  accessLevel: 'Level 3: Full Catchment Verification & Dosing Control'
};

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState(DUMMY_LOGIN_CREDENTIALS.email);
  const [password, setPassword] = useState(DUMMY_LOGIN_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { from?: string; requiredAuth?: boolean } | null;
  const destination = locationState?.from || '/dashboard';
  const wasRedirected = locationState?.requiredAuth;

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = authService.login(email, password);

    if (res.success) {
      setIsAuthenticated(true);
      navigate(destination);
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleFillDummyCredentials = () => {
    setEmail(DUMMY_LOGIN_CREDENTIALS.email);
    setPassword(DUMMY_LOGIN_CREDENTIALS.password);
    setErrorMessage(null);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  return (
    <div className="flex-1 bg-carbon-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        {/* Return Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-carbon-muted hover:text-carbon-navy transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Home</span>
          </Link>

          <span className="text-[11px] font-mono text-carbon-muted bg-white border border-carbon-border px-2 py-0.5 rounded">
            Demo Portal
          </span>
        </div>

        {/* Auth Card Container */}
        <div className="bg-white border border-carbon-border rounded-lg p-6 sm:p-8 shadow-card">
          {/* Logo & Heading */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <CarbonlantisLogo theme="dark" size="md" />
            </div>
            <h1 className="text-xl font-semibold text-carbon-text">
              Operator Portal Access
            </h1>
            <p className="text-xs text-carbon-muted mt-1">
              Field fleet telemetry, mineral dosing controls & MRV ledgers
            </p>
          </div>

          {/* Redirection Notice */}
          {wasRedirected && !isAuthenticated && (
            <div className="mb-4 p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Authentication Required</strong>
                Please sign in to access the operational MRV platform modules.
              </div>
            </div>
          )}

          {/* Explicit Demo Environment Disclaimer & Auto-fill */}
          <div className="mb-5 p-3 rounded-md bg-slate-50 border border-carbon-border text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-carbon-text flex items-center gap-1 text-[11px] uppercase tracking-wider font-mono">
                <KeyRound className="w-3 h-3 text-carbon-navy" />
                <span>Evaluation Credentials</span>
              </span>
              <button
                type="button"
                onClick={handleFillDummyCredentials}
                className="text-[11px] font-medium text-carbon-navy hover:underline flex items-center gap-1"
                title="Fill demo credentials"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Auto Fill</span>
              </button>
            </div>
            <div className="space-y-0.5 font-mono text-[11px] text-carbon-muted bg-white p-2 rounded border border-slate-200">
              <div>Email: <strong className="text-carbon-text">{DUMMY_LOGIN_CREDENTIALS.email}</strong></div>
              <div>Password: <strong className="text-carbon-text">{DUMMY_LOGIN_CREDENTIALS.password}</strong></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
              Notice: This is a client-side prototype demonstration environment for stakeholder review.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!isAuthenticated ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-carbon-text mb-1">
                  Work Email or Station ID
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@carbonlantis.com"
                  className="w-full px-3 py-2 rounded-md border border-carbon-border text-sm text-carbon-text focus:border-carbon-navy focus:ring-1 focus:ring-carbon-navy outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-carbon-text mb-1">
                  Portal Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2 rounded-md border border-carbon-border text-sm text-carbon-text focus:border-carbon-navy focus:ring-1 focus:ring-carbon-navy outline-none transition-colors pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 rounded-md text-sm font-medium text-white bg-carbon-navy hover:bg-[#1A4E78] transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-carbon-aqua" />
                <span>Sign In to Dashboard</span>
              </button>
            </form>
          ) : (
            /* Authenticated Simulation State */
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-950">
                <div className="flex items-center gap-2 font-semibold text-sm mb-1 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Authenticated Session Active</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed mb-3">
                  Signed in as {authService.getSession()?.name || DUMMY_LOGIN_CREDENTIALS.name}.
                </p>

                <div className="bg-white p-2.5 rounded border border-emerald-100 text-xs space-y-1 font-mono text-slate-700">
                  <div>User: <strong>{authService.getSession()?.name || DUMMY_LOGIN_CREDENTIALS.name}</strong></div>
                  <div>Role: <strong>{authService.getSession()?.role || DUMMY_LOGIN_CREDENTIALS.role}</strong></div>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/dashboard"
                  className="w-full py-2 px-4 bg-carbon-navy hover:bg-[#1A4E78] text-white rounded-md text-xs font-medium text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Open Operational Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2 px-4 bg-white hover:bg-slate-50 text-carbon-muted border border-carbon-border rounded-md text-xs font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
