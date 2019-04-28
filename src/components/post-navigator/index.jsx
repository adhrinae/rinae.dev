import React, { useMemo } from 'react'
import { Link } from 'gatsby'
import { divideDateAndPath } from '../../utils/frontmatter'

import './index.scss'

export const PostNavigator = ({ pageContext }) => {
  const { previous, next } = pageContext
  const [, previousPath] = useMemo(
    () => (previous ? divideDateAndPath(previous.fields.slug) : []),
    [previous]
  )
  const [, nextPath] = useMemo(
    () => (next ? divideDateAndPath(next.fields.slug) : []),
    [next]
  )

  return (
    <ul className="navigator">
      <li>
        {previous && (
          <Link to={previousPath} rel="prev">
            ← {previous.frontmatter.title}
          </Link>
        )}
      </li>
      <li>
        {next && (
          <Link to={nextPath} rel="next">
            {next.frontmatter.title} →
          </Link>
        )}
      </li>
    </ul>
  )
}
