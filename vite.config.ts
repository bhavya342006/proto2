import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// GitHub Pages project sites live under /<repository-name>/.
// Derive the base path in Actions so this also works if the repo was renamed.
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserOrOrgSite = repository?.endsWith('.github.io') ?? false;
const base = process.env.GITHUB_ACTIONS === 'true' && repository && !isUserOrOrgSite
  ? `/${repository}/`
  : '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
});
