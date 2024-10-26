/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        maroon: '#800000',
        lightblue: '#add8e6',
        lightsalmon: '#fa8072',
        lightcoral: '#f08080',
        lightgreen: '#90ee90',
        dark: '#333333',
        dark_background: '#1a1a1a', // Custom dark background color
        dark_hover: '#333333',       // Custom hover color
      },
    },
  },
  plugins: [],
}
