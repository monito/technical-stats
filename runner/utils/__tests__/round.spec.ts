import { round } from '../round'

describe('round', () => {
  it('rounds to 2 digits by default', () => {
    const output = round(12.3456789)
    expect(output).toBe(12.35)
  })

  it('rounds depending on digits parameter', () => {
    const output = round(12.34321, 1)
    expect(output).toBe(12.3)
  })
})
