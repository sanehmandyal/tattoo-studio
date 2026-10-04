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
        studio: {
          bg: 'var(--studio-bg)',
          darker: 'var(--studio-darker)',
          secondary: 'var(--studio-secondary)',
          card: 'var(--studio-card)',
          cardHover: 'var(--studio-card-hover)',
          wood: 'var(--studio-wood)',
          woodHeader: 'var(--studio-wood-header)',
          bronze: 'var(--studio-bronze)',
          bronzeLight: 'var(--studio-bronze-light)',
          bronzeHover: 'var(--studio-bronze-hover)',
          bronzeDark: 'var(--studio-bronze-dark)',
          gold: 'var(--studio-gold)',
          textMain: 'var(--studio-text-main)',
          textMuted: 'var(--studio-text-muted)',
          border: 'var(--studio-border)',
          borderHover: 'var(--studio-border-hover)',
          glowCyan: 'var(--studio-glow-cyan)',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        gothic: ['"UnifrakturMaguntia"', '"Cinzel Decorative"', 'serif'],
        condensed: ['"Oswald"', '"Bebas Neue"', 'sans-serif'],
      },
      boxShadow: {
        'bronze': '0 4px 20px -2px rgba(150, 111, 67, 0.25)',
        'bronze-lg': '0 8px 30px -4px rgba(150, 111, 67, 0.35)',
        'cyan-glow': '0 0 20px rgba(2, 132, 199, 0.35)',
        'card': 'var(--studio-card-shadow)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)'
      },
      backgroundImage: {
        'wood-pattern': "radial-gradient(ellipse at center, rgba(37,26,20,0.6) 0%, rgba(16,20,21,0.95) 100%)",
        'bronze-gradient': "linear-gradient(135deg, var(--studio-bronze-light) 0%, var(--studio-bronze) 50%, var(--studio-bronze-dark) 100%)",
      }
    },
  },
  plugins: [],
}
