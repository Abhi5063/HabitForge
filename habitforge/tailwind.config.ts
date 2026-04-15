import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF6B00',
          'orange-light': '#FF8C38',
          'orange-dark': '#CC5500',
          yellow: '#FFD700',
          'yellow-light': '#FFE566',
          green: '#22C55E',
          'green-dark': '#16A34A',
        },
        bg: {
          base: '#0A0A0A',
          card: '#141414',
          surface: '#1E1E1E',
          elevated: '#252525',
        },
        border: { DEFAULT: '#2A2A2A', light: '#3A3A3A' },
        text: { primary: '#FFFFFF', secondary: '#A3A3A3', muted: '#6B6B6B' },
      },
      fontFamily: {
        display: ['Bebas Neue', 'cursive'],
        heading: ['Outfit', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'flame-flicker': 'flicker 1.5s ease-in-out infinite alternate',
        'xp-pulse': 'xpPulse 0.6s ease-out forwards',
        'badge-pop': 'badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        'level-up': 'levelUp 1s ease-out forwards',
        'streak-glow': 'streakGlow 2s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%': { transform: 'scaleY(1) scaleX(1)', opacity: '1' },
          '50%': { transform: 'scaleY(1.05) scaleX(0.98)', opacity: '0.95' },
          '100%': { transform: 'scaleY(0.97) scaleX(1.02)', opacity: '1' },
        },
        xpPulse: {
          '0%': { transform: 'scale(1)', color: '#FFD700' },
          '50%': { transform: 'scale(1.4)', color: '#FF6B00' },
          '100%': { transform: 'scale(1)', color: '#FFD700' },
        },
        badgePop: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        levelUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-60px)', opacity: '0' },
        },
        streakGlow: {
          '0%,100%': { boxShadow: '0 0 8px #FF6B00' },
          '50%': { boxShadow: '0 0 24px #FFD700, 0 0 40px #FF6B00' },
        },
      },
    },
  },
  plugins: [],
}

export default config
