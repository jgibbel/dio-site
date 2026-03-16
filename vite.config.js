import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set VITE_BASE_PATH to your GitHub repo name when deploying, e.g.:
//   VITE_BASE_PATH=/diovanna-manuscript/ npm run build
// Leave unset for local dev or custom domain deployments.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})
