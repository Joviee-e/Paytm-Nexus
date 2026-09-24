/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          navy: '#10245C',
          blue: '#0066FF',
          lightblue: '#EAF3FF',
          bg: '#F7F9FC',
          card: '#FFFFFF',
          border: '#E3EAF3',
          borderLight: '#EDF2F7',
          green: '#16B981',
          amber: '#F59E0B',
          red: '#EF4444',
          purple: '#7C5CFC',
          muted: '#64748B',
          subtle: '#94A3B8',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'nexus-sm': '10px',
        'nexus': '14px',
        'nexus-lg': '18px',
        'nexus-xl': '24px',
      },
      boxShadow: {
        'nexus-subtle': '0 1px 3px 0 rgba(16, 36, 92, 0.04), 0 1px 2px 0 rgba(16, 36, 92, 0.02)',
        'nexus-card': '0 4px 12px 0 rgba(16, 36, 92, 0.05), 0 1px 3px 0 rgba(16, 36, 92, 0.03)',
        'nexus-hover': '0 10px 25px -3px rgba(16, 36, 92, 0.08), 0 4px 6px -2px rgba(16, 36, 92, 0.03)',
        'nexus-dropdown': '0 20px 30px -10px rgba(16, 36, 92, 0.12), 0 1px 3px 0 rgba(16, 36, 92, 0.05)',
        'nexus-glow': '0 0 20px -3px rgba(0, 102, 255, 0.25)',
      }
    },
  },
  plugins: [],
}
