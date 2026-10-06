import mdx from '@astrojs/mdx'
import { transformerMetaHighlight } from '@shikijs/transformers'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  publicDir: '../public',
  outDir: '../dist',
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
    build: {
      rollupOptions: {
        // Astro marks MDX content-render entries with its internal `use astro:head-inject`
        // directive so assets reach <head>. Rollup cannot know that directive and emits a
        // benign `MODULE_LEVEL_DIRECTIVE` warning for every entry. Keep hiding only that
        // specific warning; revisit and drop this filter once Astro stops emitting it.
        onwarn(warning, warn) {
          if (
            warning?.code === 'MODULE_LEVEL_DIRECTIVE' &&
            String(warning.message).includes('astro:head-inject')
          ) {
            return
          }
          warn(warning)
        },
      },
    },
    css: {
      postcss: { plugins: [] },
    },
  },
  integrations: [mdx()],
})
