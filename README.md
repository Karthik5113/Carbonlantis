# Carbonlantis MRV Platform — Public Website Frontend (Pre-Login)

Professional, production-grade public landing page for **Carbonlantis**, a climate-tech enterprise platform focused on Inland Water Alkalinity Enhancement (IWAE) and continuous Monitoring, Reporting, and Verification (MRV) of carbon removal.

---

## 🌊 Architecture & Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM (v6)
- **Mapping**: Leaflet with OpenStreetMap tile engine
- **Backend Readiness**: Prepared for Django REST Framework (DRF) endpoints via `src/services/api.ts`

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```text
src/
├── assets/                  # Brand assets and imagery
├── components/
│   ├── common/              # Reusable UI components
│   ├── home/                # Public landing page components
│   │   ├── HeroSection.tsx        # Landscape hero with atmospheric overlay
│   │   ├── PlatformStats.tsx      # Responsive statistics grid
│   │   ├── StatCard.tsx           # Configurable translucent metric card
│   │   ├── DeploymentMapCard.tsx  # Deployment map card container
│   │   ├── DeploymentMap.tsx      # Interactive Leaflet map with custom markers
│   │   ├── MapLegend.tsx          # Marker legend with interactive filter toggle
│   │   ├── AlertsCard.tsx         # Alerts container with severity filter pills
│   │   └── AlertItem.tsx          # Accessible notification card with semantic badge
│   ├── layout/
│   │   └── PublicFooter.tsx       # Enterprise footer with legal placeholders
│   └── navigation/
│       ├── PublicNavbar.tsx       # Sticky navbar with mobile drawer
│       └── CarbonlantisLogo.tsx   # Custom SVG climate mark and wordmark
├── data/
│   └── publicHome.ts        # Configurable demonstration dataset
├── pages/
│   ├── HomePage.tsx         # Pre-login public landing page
│   ├── MRVPage.tsx          # Public MRV methodology & sensing framework
│   ├── CDRPage.tsx          # Inland water alkalinity enhancement science
│   ├── DeploymentsPage.tsx  # Full-screen deployment sites & station explorer
│   └── LoginPage.tsx        # Enterprise authentication boundary portal
├── routes/
│   └── AppRoutes.tsx        # Client-side router configuration
├── services/
│   └── api.ts               # Django REST Framework API client with fallback
├── types/
│   └── index.ts             # Domain TypeScript interfaces
├── App.tsx                  # Root application layout
└── main.tsx                 # Entrypoint
```

---

## 🔒 Authentication Boundary & Route Protection

The pre-login public domain strictly enforces the security boundary:
- **Public Website Navigation**: The public navigation bar contains only **Home**, **MRV**, **CDR**, **Deployments**, and the **Login** CTA. No authenticated operational dashboards are exposed to public visitors.
- **Route Guard (`ProtectedRoute.tsx`)**: Any attempt to directly access `/dashboard` or any of its sub-modules without an active authenticated session automatically redirects the visitor to `/login` with an **"Authentication Required"** notification.
- **Session Persistence & Logout**: Authenticating on `/login` saves an active operator session in `sessionStorage`. Clicking **"Sign Out"** in the dashboard immediately invalidates the token and locks the platform.

### 🔑 Pre-configured Dummy Credentials
- **Email**: `operator@carbonlantis.com`
- **Password**: `Carbonlantis2026!`
- **Role**: Dr. Elena Vance (Lead MRV Scientist / Fleet Operator)
- The login form is pre-populated with these dummy credentials by default, and includes a one-click **"Auto Fill"** helper.

---

## 📊 Finalized 6-Module Enterprise MRV Platform (`/dashboard`)

When authorized operators log in, the enterprise platform displays a **persistent left navigation sidebar menu** featuring all 6 core modules:

1. **Dashboard** (`/dashboard?tab=dashboard`):
   Overall platform overview, asset deployments table, monitoring statistics, system status, and operational alerts.
2. **Monitoring** (`/dashboard?tab=monitoring`):
   Real-time and historical sensor telemetry matrix (208 nodes), RTK GPS vessel tracking and geofencing, active and past dosing cycles, and one-click certified data export center (CSV/JSON).
3. **Mineral & Dosing** (`/dashboard?tab=mineral-dosing`):
   Mineral feedstock stockpiles (CaSiO₃ Wollastonite & Mg(OH)₂), slurry preparation and continuous mixing tanks, closed-loop PID dosing configurations, and peristaltic pump actuation controls.
4. **Carbon Removal** (`/dashboard?tab=carbon-removal`):
   Carbonate chemistry calculations (DIC, Total Alkalinity, pCO₂ disequilibrium, saturation indices \(\Omega_{\text{calcite}}\)), gross vs net creditable CDR ledger, Monte Carlo uncertainty assessment (±4.2%), and audit-ready ISO 14064-2 MRV report packages.
5. **User Management** (`/dashboard?tab=users`):
   User accounts directory, 4-tier Role-Based Access Control (RBAC) matrix, MFA enforcement status, user provisioning modal, and immutable WORM security audit logs.
6. **Settings** (`/dashboard?tab=settings`):
   Data management and retention policies, automated hourly cloud backup history with SHA-256 checksums, per-asset safety ceiling modifications, and Carbonlantis platform information.

---

## ⚙️ Django REST Framework (DRF) Integration

Configure the backend endpoint in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ENABLE_MOCK_FALLBACK=true
```

The frontend will automatically probe DRF endpoints on load:
- `GET /api/v1/public/stats/`
- `GET /api/v1/public/deployments/`
- `GET /api/v1/public/alerts/`
- `GET /api/v1/health/`

If the backend is not running, the application gracefully displays the configurable demonstration data without error states or layout disruptions.

