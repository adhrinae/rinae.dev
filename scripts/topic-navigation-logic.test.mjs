import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getPostsForTag,
  getReadingTags,
  getRelatedPosts,
  getTagUrl,
} from '../src/lib/topic-navigation.ts'

const post = (id, title, tags) => ({ id, data: { title, tags } })

test('topic navigation handles OR matches, title exclusion, empty tags, and the five-result limit', () => {
  const current = post('current', 'Current article', ['alpha', 'beta'])
  const posts = [
    current,
    post('duplicate-title', 'Current article', ['alpha']),
    post('unrelated', 'Unrelated', ['gamma']),
    post('alpha-1', 'Alpha one', ['alpha']),
    post('beta-1', 'Beta one', ['beta']),
    post('both', 'Both tags', ['alpha', 'beta']),
    post('alpha-2', 'Alpha two', ['alpha']),
    post('beta-2', 'Beta two', ['beta']),
    post('alpha-3', 'Alpha three', ['alpha']),
  ]

  assert.deepEqual(
    getPostsForTag(posts, 'beta').map(({ id }) => id),
    ['current', 'beta-1', 'both', 'beta-2']
  )
  assert.deepEqual(
    getRelatedPosts(posts, current).map(({ id }) => id),
    ['alpha-1', 'beta-1', 'both', 'alpha-2', 'beta-2'],
    'either shared tag qualifies, title matches are excluded, and the input order is capped at five'
  )
  assert.deepEqual(getRelatedPosts(posts, post('tagless', 'No tags', [])), [])
})

test('topic navigation counts tags in first-seen order and encodes tag path segments', () => {
  const posts = [
    post('first', 'First', ['Reading', 'Web Fundamental']),
    post('second', 'Second', ['React', 'Reading']),
  ]

  assert.deepEqual(getReadingTags(posts), [
    { name: 'Reading', count: 2 },
    { name: 'Web Fundamental', count: 1 },
    { name: 'React', count: 1 },
  ])
  assert.equal(getTagUrl('Web Fundamental & Tools'), '/tags/Web%20Fundamental%20%26%20Tools')
  assert.equal(getTagUrl('A/B'), '/tags/A%2FB')
})
