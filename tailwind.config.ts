import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Cores primárias 
        'bege-principal': '#e3d5b8',
        'bege-escuro': '#d4c4a8',
        'bege-claro': '#f2ead8',
        'bege-muito-claro': '#faf7f0',
        // Cores secundárias
        'marrom-papel': '#8b7355',
        'marrom-escuro': '#6b5b47',
        'dourado': '#c9a96e',
        'dourado-escuro': '#b8941f',
      },
    },
  },
  plugins: [],
};

export default config;

