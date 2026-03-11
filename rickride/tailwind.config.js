/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#099f9f',
        backgroundTitle: '#f5f8f8', // "background-light" from theme
        backgroundDark: '#102222',
        surfaceDark: '#182c2c',
        surfaceLight: '#ffffff',
      },
    },
  },
  plugins: [],
};
