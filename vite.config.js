import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  //Cho phép Vite sử dụng process.env
  define: {
    "process.env": process.env,
  },
  plugins: [react()],
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
});
