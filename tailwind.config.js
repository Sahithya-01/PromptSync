/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enables toggling dark mode with a class
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        card: 'var(--color-card)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
      },
    },
  },
  plugins: [],
}
