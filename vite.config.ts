import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { seo } from './seo'

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
})
