/** @type {import('tailwindcss').Types.Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          library: {
            primary: '#2c5530',
            secondary: '#4a7c59',
            accent: '#8fb996',
            light: '#f8f9fa',
            dark: '#1a1a1a'
          }
        },
        fontFamily: {
          serif: ['Georgia', 'serif'],
          sans: ['Inter', 'system-ui', 'sans-serif']
        }
      },
    },
    plugins: [],
  }