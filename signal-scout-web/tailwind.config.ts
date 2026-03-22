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
          bg: "#0a0a0a",
          surface: "#141414",
          border: "#222222",
          accent: "#c8ff00",
          "accent-dim": "#c8ff0015",
          text: "#f0f0f0",
          muted: "#888888",
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
