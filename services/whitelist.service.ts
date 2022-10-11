export function urlAllowed(url: string) {
  const rules = [
    RegExp('^(http|https)://').test(url),
    url.includes('.br'),
    !url.includes('.com'),
  ]
  return rules.every((rule) => rule)
}
