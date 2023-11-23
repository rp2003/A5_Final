
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.ejs'],
  theme: {
    extend: {},
    daisyui: {
      themes: ['bumblebee'],
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}
