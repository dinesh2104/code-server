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
        scaler: {
          bg: '#0e1117',
          surface: '#161b22',
          card: '#1e2430',
          border: '#30363d',
          primary: '#2563eb',
          'primary-hover': '#1d4ed8',
          accent: '#ed5565',
          gold: '#f59e0b',
          green: '#10b981',
          red: '#ef4444',
          muted: '#8b949e',
          text: '#e6edf3',
          header: '#131720'
        }
      }
    },
  },
  plugins: [],
}

