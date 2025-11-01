import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
  // readingTime: true
})

export default withNextra({
  output: 'export',
  images: {
    unoptimized: true,
  },
})
