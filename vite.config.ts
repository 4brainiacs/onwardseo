import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';
  
  return {
    plugins: [react()],
    base: './',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    build: {
      sourcemap: false,
      minify: 'terser',
      assetsDir: 'assets',
      outDir: 'dist',
      emptyOutDir: true,
      cssCodeSplit: false,
      modulePreload: {
        polyfill: false,
        resolveDependencies: (filename: string, deps: string[], { hostId, hostType }: any) => {
          return deps;
        }
      },
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            icons: ['lucide-react']
          },
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      },
      target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
      reportCompressedSize: false
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