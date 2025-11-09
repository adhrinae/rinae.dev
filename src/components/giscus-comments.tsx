'use client'

import Giscus from '@giscus/react'

const GiscusComments = () => {
  return (
    <Giscus
      id="comments"
      repo="adhrinae/rinae.dev"
      repoId="MDEwOlJlcG9zaXRvcnkyNDg2MzYzMjE="
      category="Giscus Comments"
      categoryId="DIC_kwDODtHjoc4CejDt"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme="preferred_color_scheme"
      lang="ko"
      loading="lazy"
    />
  )
}

export default GiscusComments
