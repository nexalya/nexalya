import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta oficial de Nexalya: verde de acento (#00DD6E) y petróleo
        // oscuro (#004042), tomados del logo. "brand" es el petróleo (se usa
        // en botones, enlaces, focus rings y bordes activos en toda la app;
        // brand-600 es el color exacto del logo). "accent" es el verde, para
        // detalles puntuales.
        brand: {
          50: "#f5f7f7",
          100: "#e8eeee",
          200: "#c7d5d5",
          300: "#94afb0",
          400: "#578182",
          500: "#245b5c",
          600: "#004042",
          700: "#003436",
          800: "#002a2c",
          900: "#002122",
        },
        accent: {
          50: "#e6fdf1",
          100: "#c0fadd",
          200: "#80f4bb",
          300: "#40ee99",
          400: "#12e57e",
          500: "#00dd6e",
          600: "#00b45a",
          700: "#008c46",
          800: "#006533",
          900: "#004321",
        },
      },
    },
  },
  plugins: [],
};

export default config;
