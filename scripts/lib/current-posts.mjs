import { readdir, readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { repositoryRoot } from './astro-test-helpers.mjs'

// Astro already installs this YAML parser for content frontmatter.
const require = createRequire(import.meta.url)
const { parse } = require('../../node_modules/.pnpm/yaml@2.9.1/node_modules/yaml')

export const currentPosts = async () => {
  const directory = path.join(repositoryRoot, 'content/posts')
  const files = (await readdir(directory)).filter(
    (file) => /\.mdx?$/.test(file) && file !== 'index.mdx'
  )
  const posts = await Promise.all(
    files.map(async (file) => {
      const source = await readFile(path.join(directory, file), 'utf8')
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      if (!frontmatter) throw new Error(`Missing frontmatter: ${file}`)
      const data = parse(frontmatter[1])
      const id = file.replace(/\.mdx?$/, '')
      return { ...data, id, slug: data.slug || id }
    })
  )
  return posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.id.localeCompare(b.id))
}
