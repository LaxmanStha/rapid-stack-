import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  colors: { ecoGray: "#F0EFEE" }, // custom name for your color },
  plugins: [tailwindcss()],
});
