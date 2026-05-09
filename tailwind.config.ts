import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        pastel: {
          purple: "#e6e6fa",
          lavender: "#f3e8ff",
          ivory: "#fffff0",
          blue: "#dbeafe",
          pink: "#fce7f3",
          mint: "#d1fae5",
          softpurple: "#d8b4e2"
        }
      },
    },
  },
  plugins: [],
};
export default config;
