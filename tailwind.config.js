/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff7ff',
          100: '#dceeff',
          500: '#075bc5',
          600: '#004fc1',
          700: '#003b97',
          900: '#071c4d'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(7, 44, 105, .08)',
        card: '0 3px 12px rgba(7, 44, 105, .09)'
      }
    }
  },
  plugins: []
}