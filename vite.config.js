import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { manualChunksPlugin } from 'vite-plugin-webpackchunkname';

// const path = import.meta.env.REACT_APP_DASH_PATH;


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), manualChunksPlugin()],
	// base: '.',
	base: '/dash/',
	// base: '/dash/dist/',
  resolve: {
    alias: {
      process: "process/browser"
    }
  },
  build: {
    rollupOptions: {
        treeshake:  false 
    }
  }
})
