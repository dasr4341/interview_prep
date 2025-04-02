/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          color: '#1876d1',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
