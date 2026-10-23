import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2B7CC0",
          "blue-hover": "#22639B",
          "blue-light": "#EBF3FA",
          "blue-dark": "#1D5584",
          dark: "#231F20",
          "dark-surface": "#1A1718",
          "dark-card": "#2C2728",
          "dark-border": "#3A3436",
          gray: {
            50: "#F8FAFC",
            100: "#F1F5F9",
            200: "#E2E8F0",
            300: "#CBD5E1",
            400: "#94A3B8",
            500: "#64748B",
            600: "#475569",
            700: "#334155",
            800: "#1E293B",
            900: "#0F172A",
          },
          border: "#E4E7EC",
          muted: "#667085",
          bg: "#F5F7FA",
        },
      },
      fontFamily: {
        heading: ["var(--font-bebas)", "sans-serif"],
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(35, 31, 32, 0.08)",
        "card-hover": "0 12px 30px -4px rgba(43, 124, 192, 0.16)",
        glow: "0 0 25px rgba(43, 124, 192, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
