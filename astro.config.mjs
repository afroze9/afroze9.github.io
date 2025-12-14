import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://afroze9.github.io',
  output: 'static',
  build: {
    format: 'directory',
    assets: '_assets'
  },
  compressHTML: true
});
