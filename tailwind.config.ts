import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        polar: {
          950: "#030a12",
          900: "#061320",
          850: "#091b2c",
          800: "#0c243b",
          700: "#133555",
          600: "#1e4d79",
        },
        ice: {
          400: "#38bdf8",
          300: "#7dd3fc",
          200: "#bae6fd",
          100: "#e0f2fe",
        },
        aurora: {
          500: "#10b981",
          400: "#34d399",
          300: "#6ee7b7",
          200: "#a7f3d0",
        },
      },
    },
  },
  plugins: [],
};
export default config;