import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { cssConf } from './viteConf'

export default (params => {
  // 配置文件中加载环境变量
  const env = loadEnv(params.mode, __dirname)
  const { mode } = params
  return defineConfig({
    root: './',
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@api': path.resolve(__dirname, 'src/api'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@common': path.resolve(__dirname, 'src/common'),
        '@utils': path.resolve(__dirname, 'src/utils'),
        '@pages': path.resolve(__dirname, 'src/pages'),
        '@store': path.resolve(__dirname, 'src/store'),
        '@router': path.resolve(__dirname, 'src/router'),
      }
    },
    plugins: [vue()],
    css: cssConf,
    build: {
      target: 'es2020',
      outDir: path.resolve(__dirname, './admin-user'),
    },
    optimizedeps: {
      esbuildoptions: {
        target: 'es2020'
      }
    },
    server: {
      host: '0.0.0.0',
      port: env.VITE_PORT,
      open: true,
      proxy: {
        '/admin': {
          target: env.VITE_HOST_URL,
          changeOrigin: true
        },
      }
    },
  })
})
