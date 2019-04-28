const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

const SLUG_CAPTURE_REGEX = /^\/(\d{4}-\d{2}-\d{2})-(.+)\//

function divideDateAndTitle(slug) {
  const capturedByGroups = SLUG_CAPTURE_REGEX.exec(slug)
  return [capturedByGroups[1], capturedByGroups[2]]
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPostTemplate = path.resolve(`./src/templates/blog-post.js`)

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }

    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges.filter(
      ({ node }) => !!node.frontmatter.tags
    )

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node
      const slug = post.node.fields.slug
      const [, title] = divideDateAndTitle(slug)
      const path = `/posts/${title}`

      createPage({
        path,
        component: blogPostTemplate,
        context: {
          slug,
          previous,
          next,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    console.log(value)

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
