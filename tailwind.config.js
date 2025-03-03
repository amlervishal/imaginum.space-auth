module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)'],
      },
      colors: {
        primary: '#543d27',
        muted: 'rgba(84, 61, 39, 0.7)',
        accent: '#fac9b8',
        background: '#FAF0ED',
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      letterSpacing: {
        tighter: '-0.05em',
      },
      boxShadow: {
        neumorphic: '20px 20px 60px rgba(0, 0, 0, 0.05), -20px -20px 60px rgba(255, 255, 255, 0.8)',
        'neumorphic-inset': 'inset 8px 8px 16px rgba(0, 0, 0, 0.05), inset -8px -8px 16px rgba(255, 255, 255, 0.8)',
        'neumorphic-button': '5px 5px 10px rgba(0, 0, 0, 0.05), -5px -5px 10px rgba(255, 255, 255, 0.8)',
      },
    },
  },
  plugins: [],
}
