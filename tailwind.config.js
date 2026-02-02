/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./templates/**/*.html",
    "./scripts/**/*.js",
    "./docs/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        // Metal Editorial Palette
        'metal-black': '#000000',
        'metal-charcoal': '#1a1a1a',
        'metal-steel': '#4a4a4a',
        'metal-silver': '#9ca3af',
        'metal-red': '#dc2626',
      },
      fontFamily: {
        'display': ['ui-sans-serif', 'system-ui', 'sans-serif'],
        'body': ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest': '.25em',
      },
    },
  },
  plugins: [],
}
