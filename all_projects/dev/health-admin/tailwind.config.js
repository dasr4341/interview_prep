const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/scss/*', './public/index.html'],
  preflight: true,
  theme: {
    maxWidth: {
      '1/2': '50%',
      '600': '600px',
    },
    minWidth: {
      '5': '5rem',
      '300': '300px',
      '240': '240px',
      '900': '900px'
    },
    minHeight: {
      '70': '70vh',
      '80': '80vh',
    },
    borderColor: (theme) => ({
      ...theme('colors'),
      DEFAULT: theme('colors.border', 'currentColor'),
    }),
    colors: {
      
      overlay: 'rgba(0, 0, 0, 0.25)',
      black: '#000',
      'black-500': '#363646',
      border: '#EEEEF1',
      'border-dark': '#979797',
      orange: '#ED6513',
      gray: {
        50: '#F8F8FA',
        100: '#F1F1F5',
        150: '#515151', // PT Gray
        200: '#EEEEF1',
        300: '#E5E5EF',
        350: '#D8D8D8',
        400: '#C5C5D8',
        450: '#E0E0E0',
        500: '#B0B0C6',
        600: '#8585A1',
        650: '#828282',
        700: '#525262',
        750: '#4B4C4E',
        800: '#363646',
        850: '#161616',
        900: '#202030',
        950: '#4F4F4F',
      },
      yellow: {
        500: '#FFCC00',
        550: '#ffcc01',
        600: '#fecb01',
        800: '#ebae05',
        900: '#D8A31A',
      },
      green: '#64D269',
      primary: '#23265B',
      'primary-light': '#3B7AF7',
      'primary-100': '#E5E5EF',
      white: '#fff',
      pt: {
        primary: '#23265B', // blue.900
        secondary: '#3B7AF7', // blue.300
        alt: '#ED6513',

        green: {
          150: '#b1fcb3',
          300: '#64D269',
          500: '#00992a',
          600: '#00B0B9',
        },
        yellow: {
          500: '#FFCC00',
        },

        blue: {
          300: '#3B7AF7',
          600: '#03BFFB',
          900: '#23265B',
        },

        red: {
          300: 'ff54a4',
          800: '#D33503',
          900: '#ED6513',
        },
        gray: {
          600: '#4B4C4E',
        },
      },
      red: colors.red,
      amber: colors.amber,
      indigo: colors.indigo,
    },
    fontSize: {
      xxs: ['10px', '12px'],
      xss:['12px', '14px'],
      xs: ['13px', '22px'],
      sm: ['14px', '22px'],
      xsm: ['16px', '14px'],
      base: ['17px', '24px'],
      xsmd: ['18px', '23px'],
      xmd: ['21px', '14px'],
      smd: ['24px', '20px'],
      md: ['26px', '32px'],
      lmd: ['27px', '32px'],
      lg: ['34px', '41px'],
      more: ['15px', '22px'],
      xxxl: ['30px', '40px'],
    },
    fontFamily: {
      sans: [
        'SF Pro',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
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
    boxShadow: {
      outer: '0px 1px 40px rgba(0, 0, 0, 0.04);',
      none: 'none',
      top: '1px 0px 40px rgba(0, 0, 0, 0.04);',
    },
    extend: {
      spacing: {
        'custom': 'calc(100vh - 250px)',
      },
      width: {
        '5.5': '1.4rem',
        'fit': 'fit-content'
      }
    }
  },
  variants: {
    extend: {
      borderWidth: ['first', 'last'],
      padding: ['first', 'last'],
      backgroundColor: ['hover', 'focus', 'checked', 'odd', 'even'],
      borderColor: ['checked'],
      borderRadius: ['first', 'last'],
      outer: '0px 1px 40px rgba(0, 0, 0, 0.04);',
      none: 'none'
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
