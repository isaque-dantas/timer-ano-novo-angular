/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'Arial', 'Helvetica', 'sans-serif'],
        'mono': ['"IBM Plex Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}

