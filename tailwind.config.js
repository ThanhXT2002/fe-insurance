/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';
import twScrollbar from 'tailwind-scrollbar';
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      colors: {
        primary: "#009a5e",
        secondary: "#c0c0c0",
        third: "#ebeff0",
        fourth: "#6f6f6f",
        fifth: "#ffffff33",
        whiteColor: "#ffffff",
        whiteSmoke: "#F5F5F5",
        whiteSmokeLight: "#FAFAFA",
        blackLight: "#2b4055",
        silverColor: "#bfbfbf",
        darkColorLight: "#171717",
        greenDark: "#2a9d8f",
      },
      fontFamily: {
        'sans': ['Open Sans', 'sans-serif'], // Đặt làm font mặc định
        'opensans': ['Open Sans', 'sans-serif'],
      }
    },
  },
  darkMode: ["selector", '[class~="dark"]'],
  plugins: [PrimeUI, twScrollbar],
};

