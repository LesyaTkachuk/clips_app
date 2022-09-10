/** @type {import('tailwindcss').Config} */
// We should add dynamic classes to safelist array, otherwise they will be removed from a final bundle, as they are not presented in initial template
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  safelist: ["bg-blue-400", "bg-green-400", "bg-red-400"],
  theme: {
    extend: {},
  },
  plugins: [],
};
