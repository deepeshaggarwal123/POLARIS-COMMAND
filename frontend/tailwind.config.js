/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        polarBlue: {
          50: '#e6f7ff',
          100: '#bae7ff',
          500: '#1890ff',
          700: '#0050b3',
          900: '#002766',
        },
        polarGreen: {
          50: '#f6ffed',
          100: '#d9f7be',
          500: '#52c41a',
          700: '#237804',
          900: '#092b00',
        },
      }
    },
  },
  plugins: [],
}
