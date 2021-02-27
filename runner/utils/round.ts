export function round (num: number, decimal: number = 2) {
  const modifier = Math.pow(10, decimal)
  return Math.round(num * modifier) / modifier
}
