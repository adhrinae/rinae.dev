import React, { useEffect } from 'react'
import { graphql } from 'gatsby'

import * as Elements from '../components/elements'
import { Layout } from '../layout'
import { Head } from '../components/head'
import { PostTitle } from '../components/post-title'
import { PostContainer } from '../components/post-container'
import { SocialShare } from '../components/social-share'
import { SponsorButton } from '../components/sponsor-button'
import { Bio } from '../components/bio'
import { PostNavigator } from '../components/post-navigator'
import { Utterences } from '../components/utterances'
import * as ScrollManager from '../utils/scroll'
import { divideDateAndPath } from '../utils/frontmatter'

import '../styles/code.scss'

export default ({ data, pageContext, location }) => {
  useEffect(() => {
    ScrollManager.init()
    return () => ScrollManager.destroy()
  }, [])

  const post = data.markdownRemark
  const metaData = data.site.siteMetadata
  const { title, comment, author, sponsor, social } = metaData
  const { utterances } = comment
  const [date, path] = divideDateAndPath(post.fields.slug)

  return (
    <Layout location={location} title={title}>
      <Head
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        coverImageUrl={post.frontmatter.coverImageUrl}
        meta={[
          {
            property: `og:url`,
            content: metaData.siteUrl + path,
          },
        ]}
      />
      <PostTitle title={post.frontmatter.title} date={date} />
      <PostContainer html={post.html} />
      <SocialShare
        title={post.frontmatter.title}
        authorName={author}
        twitter={social.twitter}
      />
      {!!sponsor.buyMeACoffeeId && (
        <SponsorButton sponsorId={sponsor.buyMeACoffeeId} />
      )}
      <Elements.Hr />
      <Bio />
      <PostNavigator pageContext={pageContext} />
      <Utterences repo={utterances} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
        siteUrl
        defaultOgImage
        comment {
          utterances
        }
        sponsor {
          buyMeACoffeeId
        }
        social {
          twitter
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 280, truncate: true)
      html
      fields {
        slug
      }
      frontmatter {
        title
        tags
        coverImageUrl
        description
      }
    }
  }
`
