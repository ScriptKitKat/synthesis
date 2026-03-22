import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        scout: {
          bg: "#0a0b0f",
          surface: "#12141c",
          border: "#1e2130",
          accent: "#00e5a0",
          "accent-dim": "#00e5a020",
          text: "#e4e6ef",
          muted: "#6b7094",
          danger: "#ff4d6a",
          warning: "#ffb224",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Satoshi", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
