import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// The build is one self-contained HTML file (dist/index.html) with all code,
// styles and images inlined, so it opens by double-clicking — no server needed.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  server: { port: 5173 },
});
