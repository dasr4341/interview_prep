/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      translate: {
        501: '-50%',
      },
      width: {
        13: '3.25rem',
        15: '3.875rem'
      },
      height: {
        26: '6.5rem',
        102: '86vh',
        132: 'calc(100vh - 6.5rem)',
      },
      fontFamily: {
        sans: [
          'Roboto',
          'SF Pro',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'Noto San',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
      },
      margin: {
        4.5: '18px',
      },
      fontSize: {
        lgx: ['18px', '22px'],
      },
      colors: {
        theme: {
          bg: '#efeff0',
          overlay: '#00000052',
          dark: '#3c2929db',
          tag: {
            bg: '#e6e6e6',
            400: '#626262',
          },
          btn: {
            400: '#323c55',
            500: '#252d40',
          },
        },
        gray: {
          200: '#e4e7ef',
          250: '#e3e3e3',
          350: '#999999',
          650: '#cbd1de',
          660: '#ccd1de',
          720: '#edf0f5',
          750: '#413f3f',
        },
      }
    },
  },
  plugins: [require('flowbite/plugin')],
};
