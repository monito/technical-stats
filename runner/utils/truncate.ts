export function truncate (input: string, length: number) {
  if (input.length <= length) {
    return input
  }

  const truncated = `${input.substring(0, length)}...`
  if (truncated.length >= input.length) {
    return input
  }

  return truncated
}
