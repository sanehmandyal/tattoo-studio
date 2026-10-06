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
          wood: '#131720',
          woodHeader: '#0d1117',
          bronze: '#d4af37',
          bronzeLight: '#e6c86e',
          bronzeHover: '#f5d77f',
          bronzeDark: '#a1801d',
          gold: '#e6c86e',
          textMain: 'var(--studio-text-main)',
          textMuted: 'var(--studio-text-muted)',
          border: 'var(--studio-border)',
          borderHover: 'var(--studio-border-hover)',
          glowCyan: '#38bdf8',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        gothic: ['"Inter"', 'sans-serif'],
        condensed: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 10px 30px -4px rgba(0, 0, 0, 0.35)',
        'gold': '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
}
