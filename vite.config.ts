import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Marker/',  // Replace 'Marker' with your repository name
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true, // Enable local network access
    port: 3000,
  },
});
