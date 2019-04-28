import React, { useMemo } from 'react'

import { ThumbnailContainer } from '../thumbnail-container'
import { ThumbnailItem } from '../thumbnail-item'
import { CATEGORY_TYPE } from '../../constants'

export const Contents = ({ posts, countOfInitialPost, count, tag }) => {
  const refinedPosts = useMemo(
    () =>
      posts
        .filter(
          ({ node }) =>
            tag === CATEGORY_TYPE.ALL ||
            node.frontmatter.tags.find(postTag => postTag === tag)
        )
        .slice(0, count * countOfInitialPost),
    [posts, tag, count, countOfInitialPost]
  )

  return (
    <ThumbnailContainer>
      {refinedPosts.map(({ node }, index) => (
        <ThumbnailItem node={node} key={`item_${index}`} />
      ))}
    </ThumbnailContainer>
  )
}
