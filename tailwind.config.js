/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B2F8F',
          hover: '#23267A',
          pressed: '#1B1D63',
          soft: '#ECEEFB',
        },
        background: '#F5F6F8',
        surface: '#FFFFFF',
        sunken: '#EEF0F3',
        border: {
          DEFAULT: '#E2E5EA',
          strong: '#C9CED6',
        },
        text: {
          primary: '#12141C',
          secondary: '#4A5060',
          muted: '#6B7180',
        },
        success: {
          DEFAULT: '#127A4B',
          soft: '#E8F5EE',
        },
        warning: {
          DEFAULT: '#A35F00',
          soft: '#FEF6E7',
        },
        error: {
          DEFAULT: '#B42318',
          soft: '#FEE4E2',
        },
        info: {
          DEFAULT: '#1F5FBF',
          soft: '#EFF6FF',
        },
        ink: {
          DEFAULT: '#0E1018',
          2: '#181B26',
          3: '#252937',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'shell': '28px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(18, 20, 28, 0.05)',
        'raised': '0 8px 24px rgba(18, 20, 28, 0.10)',
        'floating': '0 16px 36px rgba(18, 20, 28, 0.16)',
      },
      animation: {
        'fade-up': 'fadeUp 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.2)', opacity: '0.2' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
