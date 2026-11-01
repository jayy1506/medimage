import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        adani: {
          cyan: "#0077B6",
          purple: "#662D91",
          magenta: "#B82662",
          pink: "#B82662",
          white: "#FFFFFF",
          navy: "#0B2545",
          dark: "#07192F"
        },
        clinical: {
          cyan: "#0077B6",
          teal: "#0D9488",
          darkBg: "#090D16",
          darkSurface: "#131B2E",
          darkBorder: "#1E293B"
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
