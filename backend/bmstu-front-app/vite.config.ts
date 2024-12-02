import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: "/BMSTU-Sport-Frontend",
    server: {
      host: "192.168.0.125",
      port: 3000,
      proxy: {
        "/api": {
          target: "http://192.168.0.125:8000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/"),
        },
      },
    },
  });