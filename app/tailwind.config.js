/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#F59E0B", // Rickshaw yellow
        secondary: "#1F2937",
        background: "#F3F4F6",
      }
    },
  },
  plugins: [],
};
