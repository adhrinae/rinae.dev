import React from 'react'

export const Item = ({ title, tag, selectTag }) => (
  <li
    className="item"
    role="tab"
    aria-selected={tag === title ? 'true' : 'false'}
  >
    <div onClick={() => selectTag(title)}>{title}</div>
  </li>
)
