/** @type {import('tailwindcss').Config} */
import nested from 'postcss-nesting';
import autoprefixer from 'autoprefixer';

export default {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
        'kanit': ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [
    nested,
    autoprefixer,
  ],
}

