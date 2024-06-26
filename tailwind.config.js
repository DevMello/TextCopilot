/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: [require('daisyui')]
};
