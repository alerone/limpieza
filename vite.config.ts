import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
export default defineConfig({
    base: '/limpieza/',
    plugins: [tailwindcss()],
    build: {
        rollupOptions: {
            input: {
                login: resolve(__dirname, 'index.html'),
                dashboard: resolve(__dirname, 'dashboard.html')
            }
        }
    }
})
