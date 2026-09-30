import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// host: true 让局域网内手机可以直接访问 dev 地址
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
  },
})
