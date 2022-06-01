import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { cssConf } from './viteConf'

export default defineConfig({
  plugins: [vue()],
  base: "./",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@api': path.resolve(__dirname, 'src/api'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@router': path.resolve(__dirname, 'src/router'),
    }
  },
  css: cssConf,
  server: {
    port: 8888,
    open: true,
    proxy: {
      '/test': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      },
    }
  },
})