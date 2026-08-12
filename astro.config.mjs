// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  ""
);

import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://nismara.web.id',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['sanity', 'styled-components'],
      include: ['react/compiler-runtime']
    }
  },

  integrations: [
    react(),
    sitemap(), sanity({
    projectId: PUBLIC_SANITY_PROJECT_ID || 'yi1d1k89',
    dataset: PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-03-15',
    useCdn: false
  })]
});