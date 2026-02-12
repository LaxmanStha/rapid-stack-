import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    port: 5173,
  },
  colors: { ecoGray: "#F0EFEE" },
  plugins: [tailwindcss()],
});
