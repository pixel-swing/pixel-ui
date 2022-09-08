import path from 'path'
import { defineConfig } from 'vite'
import { vuePlugin, transformIndexHtmlPlugin, transformMdPlugin } from './build/vite-plugins/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [transformIndexHtmlPlugin(), transformMdPlugin(), vuePlugin],
  resolve: {
    alias: { '@packages': path.resolve(__dirname, 'packages') }
  },
  optimizeDeps: {
    exclude: ['__DOCSMAIN__'] // 从预构建中排除 
  },
})
