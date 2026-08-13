import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    sourcemap: false,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 2000,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('grapesjs') || id.includes('monaco-editor') || id.includes('codemirror') || id.includes('craftjs')) {
              return 'builder-vendor';
            }
            if (id.includes('antd') || id.includes('@ant-design')) {
              return 'antd-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
});
