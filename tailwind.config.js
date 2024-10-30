/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(158.72deg, #F2DDA6 3.01%, #887A55 103.3%)",
      },
      colors: {
        primary: "bg-gradient-to-br from-[#F2DDA6] to-[#887A55]",
        brand: {
          black: "#171718",
          gold: {
            light: "#F2DDA6",
            dark: "#887A55",
          },
          white: "#AFAFAF",
        },
      },
      fontFamily: {
        trap: "var(--font-trap)",
        manrope: "var(--font-manrope)",
        inter: "var(--font-inter)",
      },
      screens: {
        xsm: { max: "500px" },
        sm: { min: "501px", max: "999px" },
        md: { min: "1000px", max: "1200px" },
        lg: { min: "1201px", max: "1650px" },
      },
    },
  },
  plugins: [],
};
