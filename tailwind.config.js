import colors from 'tailwindcss/colors';

module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fill: {
      current: 'currentColor',
    },
    extend: {
      colors: {
        'dark-level-one': "#181a1b",
        'dark-level-two': "#1E2022",
        'dark-white': "#d6d3cd",
        'regal-blue': '#243c5a',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
