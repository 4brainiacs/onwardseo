import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  
  return {
    plugins: [react()],
    base: './', // Ensure relative paths
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      sourcemap: isDev,
      minify: 'terser',
      assetsDir: 'assets',
      outDir: 'dist',
      emptyOutDir: true,
      cssCodeSplit: false,
      modulePreload: {
        polyfill: true
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            icons: ['lucide-react']
          },
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]',
          inlineDynamicImports: false
        }
      },
      terserOptions: {
        compress: {
          drop_console: !isDev,
          drop_debugger: !isDev
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'lucide-react']
    },
    server: {
      host: true,
      port: 5173,
      strictPort: true
    },
    preview: {
      port: 4173,
      strictPort: true,
      host: true
    }
  };
});