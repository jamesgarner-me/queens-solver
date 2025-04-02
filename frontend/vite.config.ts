import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react()],
        base: env.VITE_BASE_PATH || '/',
        server: {
            // Configure CORS for local development
            cors: true,
        },
        build: {
            // Generate manifest for better asset handling
            manifest: true,
            // Ensure correct MIME types in output
            rollupOptions: {
                output: {
                    manualChunks: undefined,
                },
            },
        },
    };
});
