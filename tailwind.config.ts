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
        /**
         * Hairline rules and card edges.
         *
         * `border-line` and `divide-line` were already used in 21 places on a
         * single page and this token never existed, so every one of them was
         * silently falling back to Tailwind's default border grey, #e5e7eb.
         * That grey is cool and the rest of this palette is warm, which is why
         * the rules always looked slightly foreign against the paper.
         *
         * Sampled to sit between paper and paper-alt so a border reads as the
         * edge of the sheet rather than a drawn line.
         */
        line: "#e3ddcd",
        whatsapp: "#1c8f4d",
      },
      fontFamily: {
        // Geist across the board. `display` is kept as a separate token so
        // headings can be given their own face again later without touching
        // every component that uses font-display.
        display: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
    },
  },
  plugins: [],
};

export default config;
