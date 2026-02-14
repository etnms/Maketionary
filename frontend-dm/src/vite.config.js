import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    base: '/Maketionary/',
    plugins: [react()],
    build: {
        outDir: 'build', // CRA's default build output
    },
});