import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The checker asserts that built assets are served from
  // /holbertonschool-web_react/assets/, so the base must stay absolute.
  base: '/holbertonschool-web_react/',
})
