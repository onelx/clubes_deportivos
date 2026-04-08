import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores dinámicos del club se aplican via CSS variables
        club: {
          primary: "var(--club-primary, #3b82f6)",
          secondary: "var(--club-secondary, #1e40af)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
