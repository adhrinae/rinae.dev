import nextra from 'nextra'
import { join } from 'node:path'

const withNextra = nextra({
  defaultShowCopyCode: true,
  // readingTime: true
})

export default withNextra({
  output: 'export',
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: join(import.meta.dirname, '..'),
  },
})
