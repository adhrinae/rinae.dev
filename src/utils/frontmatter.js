import format from 'date-fns/format'

const SLUG_CAPTURE_REGEX = /^\/(\d{4}-\d{2}-\d{2})-(.+)\//

export function divideDateAndPath(slug) {
  const capturedByGroups = SLUG_CAPTURE_REGEX.exec(slug)
  return [
    format(capturedByGroups[1], 'YYYY/MM/DD'),
    `/posts/${capturedByGroups[2]}`,
  ]
}
