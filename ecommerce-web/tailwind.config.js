      /** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightGreen: "#7ff589",
        white2: "#fffbf2",
        darkGreen: "#05ab54",
        dark: "#1e1e1e",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], 
        league: ["League Gothic", "sans-serif"],
      },
      container: { 
        center: true, 
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem", "2xl": "6rem",
        }
      },
      boxShadow: {
        "custom-inset":
          "3px 3px 4px rgba(0, 0, 0, 0.25) ,inset 2px 5px 6px rgba(255, 255, 255, 0.37),inset 0px -5px 6px rgba(0, 0, 0, 0.37)",
      },
    },
  },
  plugins: [],
}

