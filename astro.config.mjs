import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://afrozeamjad.com',
  output: 'static',
  build: {
    format: 'directory',
    assets: '_assets'
  },
  compressHTML: true,
  integrations: [sitemap()]
});
