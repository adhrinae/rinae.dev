import mdx from '@astrojs/mdx'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  publicDir: '../public',
  outDir: '../astro-dist',
  build: {
    format: 'file',
  },
  vite: {
    css: {
      postcss: { plugins: [] },
    },
  },
  integrations: [mdx()],
})
