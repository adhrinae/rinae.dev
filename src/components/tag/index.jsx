import React from 'react'

import { Item } from './item'
import { rhythm } from '../../utils/typography'

import './index.scss'

export const Tag = React.memo(({ tags, tag, selectTag }) => (
  <ul
    className="tag-container"
    role="tablist"
    id="tag"
    style={{
      margin: `0 -${rhythm(3 / 4)} 1rem`,
    }}
  >
    <Item title={'All'} category={tag} selectTag={selectTag} />
    {tags.map((item, idx) => (
      <Item key={idx} title={item} tag={tag} selectTag={selectTag} />
    ))}
  </ul>
))
