/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'leaflet-container', 
    'leaflet-popup', 
    'leaflet-marker-icon', 
    'leaflet-zoom-control'
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'),
],
}