import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shree Giriraj brand palette (sampled from the logo)
        brand: {
          red: "#d63d4c",
          blue: "#2f418a",
          indigo: "#1c2450",
          "indigo-deep": "#151b3d",
        },
        brass: {
          DEFAULT: "#c9a24b",
          bright: "#e0bd6a",
        },
        paper: {
          DEFAULT: "#f6f3ec",
          alt: "#efe9dc",
        },
        ink: "#1a1c28",
        muted: "#5c6072",
        whatsapp: "#1c8f4d",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
