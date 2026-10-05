import mdx from '@astrojs/mdx'
import { transformerMetaHighlight } from '@shikijs/transformers'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  publicDir: '../public',
  outDir: '../astro-dist',
  build: {
    format: 'file',
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      transformers: [transformerMetaHighlight()],
    },
  },
  vite: {
    css: {
      postcss: { plugins: [] },
    },
  },
  integrations: [mdx()],
})
