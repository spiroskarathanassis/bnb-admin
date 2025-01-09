// tailwind.config.js
/** @type {import('tailwindcss').Config} */

const appTheme = require('./src/constants/appTheme');

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [],
  prefix: 'tw-',
  theme: {
    extend: {
      colors: {
        ...appTheme.appThemeConfig,

        platform: appTheme.platformColors,
      },
    },
  },
};
