import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds a fully static bundle. `dist/` is what gets deployed to
// Zoho Catalyst client hosting (see catalyst.json).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, host: true },
  build: { outDir: 'dist', assetsDir: 'assets', sourcemap: false },
})
