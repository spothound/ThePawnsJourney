/** @type {import('tailwindcss').Config} */
import nested from 'postcss-nesting'
import autoprefixer from 'autoprefixer'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}', './node_modules/@ipaat/vue3-tailwind3-cookie-comply/dist/vue3-tailwind3-cookie-comply.umd.js'],
  theme: {
    screens: {
      xxxs: { max: '280px' },
      xxs: { min: '281px', max: '376px' },
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        kanit: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [nested, autoprefixer],
  important: true,
}
