import React from 'react'

export const PostContainer = ({ html }) => (
  <div className="post-container" dangerouslySetInnerHTML={{ __html: html }} />
)
