import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  resolve: {
    alias: {
      '@': '/src/'
    }
  },
  server: {
    proxy: {
      '/v1/api': {
        target: 'http://3.1.50.253', // 接口的域名
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        // rewrite: (path) => path.replace(/^\/v1\//, '/')
      }
    }
  }
})
