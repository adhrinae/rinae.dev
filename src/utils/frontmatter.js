const SLUG_CAPTURE_REGEX = /(^\/\d{4}-\d{2}-\d{2}-)(.+)/

export function divideDateAndPath(slug) {
  const capturedByGroups = SLUG_CAPTURE_REGEX.exec(slug)
  return [capturedByGroups[1], `/posts/${capturedByGroups[2]}`]
}
