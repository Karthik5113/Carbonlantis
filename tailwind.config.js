/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        carbon: {
          navy: '#123B5D',        // Primary navy
          'deep-navy': '#0B192C',   // Deep navy
          aqua: '#43C6D9',        // Aqua accent
          'aqua-dark': '#2BB0C4',  // Aqua hover
          bg: '#F4F7FA',          // Page background
          surface: '#FFFFFF',     // Surface
          text: '#172B3A',        // Primary text
          muted: '#64748B',       // Secondary text
          border: '#E2E8F0',      // Border
        },
        semantic: {
          critical: '#DC2626',
          warning: '#D97706',
          healthy: '#059669',
          info: '#2563EB',
        }
      },
      fontFamily: {
        sans: [
          'Poppins',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(11, 25, 44, 0.05), 0 1px 2px -1px rgba(11, 25, 44, 0.05)',
        'card-hover': '0 4px 12px 0 rgba(11, 25, 44, 0.08)',
        'popover': '0 10px 25px -5px rgba(11, 25, 44, 0.15), 0 8px 10px -6px rgba(11, 25, 44, 0.1)',
      }
    },
  },
  plugins: [],
}
