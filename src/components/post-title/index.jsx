import React from 'react'

export const PostTitle = ({ title, date }) => (
  <h1 className="post-title">
    {title}
    <time dateTime={date}>{date}</time>
  </h1>
)
