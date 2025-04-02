/** @type {import('tailwindcss').Config} */
module.exports = {
 content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      translate : {
        '501': '-50%',
      },
      colors: {
      'inputC': '#959595',
      'hColor': '#6f4b40',
      // 'orange': '#ff7849',
      // 'green': '#13ce66',
      // 'gray-dark': '#273444',
      // 'gray': '#8492a6',
      // 'gray-light': '#d3dce6',
      },
       
    },
    
  },
  plugins: [],
}
