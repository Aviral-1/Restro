/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#22C55E', 50: '#F0FDF4', 100: '#DCFCE7', 200: '#BBF7D0', 300: '#86EFAC', 400: '#4ADE80', 500: '#22C55E', 600: '#16A34A', 700: '#15803D', 800: '#166534', 900: '#14532D' },
        surface: { DEFAULT: '#FFFFFF', secondary: '#F9FAFB', border: '#E5E7EB' },
        text: { primary: '#111827', secondary: '#6B7280', muted: '#9CA3AF' },
      },
      borderRadius: { card: '16px' },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: { card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)', elevated: '0 10px 25px rgba(0,0,0,0.08)' },
    },
  },
  plugins: [],
};
