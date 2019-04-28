import React, { useMemo } from 'react'
import { Link } from 'gatsby'
import { TARGET_CLASS } from '../../utils/visible'
import { divideDateAndPath } from '../../utils/frontmatter'

import './index.scss'

export const ThumbnailItem = ({ node }) => {
  const [date, path] = useMemo(() => divideDateAndPath(node.fields.slug), [
    node,
  ])

  return (
    <Link className={`thumbnail ${TARGET_CLASS}`} to={path}>
      <div key={path}>
        <h3>
          {node.frontmatter.title}
          <time className="thumbnail-date" dateTime={date}>{date}</time>
        </h3>
        <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
      </div>
    </Link>
  )
}
