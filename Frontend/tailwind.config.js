/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vault: {
          bg: '#0B0F19',
          sidebar: '#0F1626',
          card: '#151D30',
          'card-hover': '#1B253D',
          border: '#212D45',
          'border-light': '#2E3D5C',
          muted: '#94A3B8',
          subtle: '#64748B'
        },
        purple: {
          brand: '#8B5CF6',
          'brand-hover': '#7C3AED',
          'brand-light': '#A78BFA',
          'brand-dark': '#6D28D9'
        },
        blue: {
          brand: '#3B82F6',
          'brand-hover': '#2563EB',
          'brand-light': '#60A5FA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.3)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.45)'
      }
    },
  },
  plugins: [],
}

