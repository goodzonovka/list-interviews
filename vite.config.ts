import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        },
    },
    server: {
        host: process.env.HOST || '127.0.0.1',
        port: process.env.PORT ? Number(process.env.PORT) : 3000,
        strictPort: true,
        allowedHosts: ['interviews.goodzonovka.com'],
    },
    preview: {
        host: '127.0.0.1', // Обязательно указываем хост
        port: 3000, // Используем порт 3000
        strictPort: true,
    }
});
