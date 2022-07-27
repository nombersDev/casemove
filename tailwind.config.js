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
        'dark-level-one': "#121212",
        'dark-level-two': "#181818",
        'dark-level-three': "#282828",
        'dark-level-four': "#404040",
        'dark-level-five': "#2B303D",
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
