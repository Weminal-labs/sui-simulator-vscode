/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'sidebar': { 'max': '700px' },
      'mini': { 'max': '450px' },


    },
  },
  plugins: [],
};

