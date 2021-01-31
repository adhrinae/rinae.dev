import React, { useState, useEffect, useRef, useMemo } from 'react'
import { graphql } from 'gatsby'
import _ from 'lodash/fp'

import { Layout } from '../layout'
import { Bio } from '../components/bio'
import { Head } from '../components/head'
import { Tag } from '../components/tag'
import { Contents } from '../components/contents'

import * as ScrollManager from '../utils/scroll'
import * as Storage from '../utils/storage'
import * as IOManager from '../utils/visible'
import * as EventManager from '../utils/event-manager'
import * as Dom from '../utils/dom'

import { HOME_TITLE, CATEGORY_TYPE } from '../constants'
import { rhythm } from '../utils/typography'
import { getBody } from '../utils/dom'

const DEST_POS = 316
const BASE_LINE = 80

function getDistance(currentPos) {
  return Dom.getDocumentHeight() - currentPos
}

function convertRemToPx(rem) {
  return (
    rem.substr(0, rem.length - 3) *
    window.parseFloat(getComputedStyle(getBody()).fontSize)
  )
}

const Index = ({ data, location }) => {
  const initialCount = Storage.getCount(1)
  const initialTag = Storage.getTag(CATEGORY_TYPE.ALL)
  const [count, setCount] = useState(initialCount)
  const countRef = useRef(count)
  const [tag, setTag] = useState(initialTag)
  const [destScrollPos, setDestScrollPos] = useState(DEST_POS)

  const { siteMetadata } = data.site
  const { countOfInitialPost } = siteMetadata.configs
  const posts = data.allMarkdownRemark.edges
  // Sort tags by frequency
  const tags = useMemo(
    () =>
      _.flow(
        _.reduce((tags, post) => tags.concat(post.node.frontmatter.tags), []),
        _.groupBy(_.identity),
        _.sortBy((tag) => tag.length),
        _.reverse,
        _.flatten,
        _.uniq
      )(posts),
    [posts]
  )

  useEffect(() => {
    window.addEventListener(`scroll`, onScroll, { passive: false })
    IOManager.init()
    ScrollManager.init()

    return () => {
      window.removeEventListener(`scroll`, onScroll, { passive: false })
      IOManager.destroy()
      ScrollManager.destroy()
    }
  }, [])

  useEffect(() => {
    countRef.current = count
    IOManager.refreshObserver()
    Storage.setCount(count)
    Storage.setTag(tag)
    setDestScrollPos(DEST_POS + convertRemToPx(rhythm(1)))
  })

  const selectTag = (tag) => {
    setTag(tag)
    ScrollManager.go(destScrollPos)
  }

  const onScroll = () => {
    const currentPos = window.scrollY + window.innerHeight
    const isTriggerPos = () => getDistance(currentPos) < BASE_LINE
    const doesNeedMore = () =>
      posts.length > countRef.current * countOfInitialPost

    return EventManager.toFit(() => setCount((prev) => prev + 1), {
      dismissCondition: () => !isTriggerPos(),
      triggerCondition: () => isTriggerPos() && doesNeedMore(),
    })()
  }

  return (
    <Layout location={location} title={siteMetadata.title}>
      <Head title={HOME_TITLE} keywords={siteMetadata.keywords} />
      <Bio />
      <Tag tags={tags} tag={tag} selectTag={selectTag} />
      <Contents
        posts={posts}
        countOfInitialPost={countOfInitialPost}
        count={count}
        tag={tag}
      />
    </Layout>
  )
}

export default Index

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        configs {
          countOfInitialPost
        }
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { ne: null } } }
    ) {
      edges {
        node {
          excerpt(pruneLength: 200, format: HTML, truncate: true)
          fields {
            slug
          }
          frontmatter {
            path
            title
            tags
          }
        }
      }
    }
  }
`
