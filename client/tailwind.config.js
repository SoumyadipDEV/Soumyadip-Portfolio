import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          light: '#112240',
          lighter: '#1D3461',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E2C06A',
          dark: '#A07830',
        },
      },
    },
  },
  plugins: [typography],
}
