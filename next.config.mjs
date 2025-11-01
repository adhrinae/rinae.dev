import fs from 'node:fs'
import path from 'node:path'
import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  // readingTime: true
})

const postsDir = path.join(process.cwd(), 'content/posts')

// Map front-matter slugs (or filename fallbacks) back to the dated MDX paths so
// `/posts/<slug>` stays stable even if the physical filename encodes the date.
function getPostSlugRewrites() {
  let entries = []
  try {
    entries = fs.readdirSync(postsDir).sort()
  } catch (error) {
    return []
  }

  const seen = new Set()

  return entries.flatMap((fileName) => {
    if (!fileName.endsWith('.mdx') || fileName === 'index.mdx') {
      return []
    }

    const filePath = path.join(postsDir, fileName)
    let slug = ''

    try {
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const match = fileContent.match(/^slug:\s*["']?(.+?)["']?\s*$/m)
      if (match) {
        slug = match[1].trim()
      }
    } catch (error) {
      return []
    }

    if (!slug) {
      slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.mdx$/, '')
    }

    const canonicalSlug = slug.replace(/\/+$/, '')
    const destination = `/posts/${fileName.replace(/\.mdx$/, '')}`
    const rewrites = []

    const baseSource = `/posts/${canonicalSlug}`
    if (!seen.has(baseSource)) {
      rewrites.push({ source: baseSource, destination })
      seen.add(baseSource)
    }

    const trailingSource = `${baseSource}/`
    if (!seen.has(trailingSource)) {
      rewrites.push({ source: trailingSource, destination })
      seen.add(trailingSource)
    }

    return rewrites
  })
}

export default withNextra({
  async rewrites() {
    return getPostSlugRewrites()
  },
})
