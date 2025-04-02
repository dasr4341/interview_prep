/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: {
          semiTransparent: "#0000006e",
          base1: "#300032",
          base2: "#100063",
          base3: "#560160",
          base4: "#040216",
        },
      },
    },
  },
  plugins: [],
};
