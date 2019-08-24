import { format, parseISO } from 'date-fns'

const SLUG_CAPTURE_REGEX = /^\/(\d{4}-\d{2}-\d{2})-(.+)\//

export function divideDateAndPath(slug) {
  const capturedByGroups = SLUG_CAPTURE_REGEX.exec(slug)
  return [
    format(parseISO(capturedByGroups[1]), 'yyyy/MM/dd'),
    `/posts/${capturedByGroups[2]}`,
  ]
}
