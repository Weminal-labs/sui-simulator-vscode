/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      'sidebar': {'max': '480px'}, // responsive design for sidebar (not working)
    },
  },
  plugins: [],
};

