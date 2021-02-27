export function truncate (input: string, length: number) {
  return input.length > length
    ? `${input.substring(0, length)}...`
    : input
}
