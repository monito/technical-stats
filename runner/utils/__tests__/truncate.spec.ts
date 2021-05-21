import { truncate } from '../truncate'

describe('truncate', () => {
  it('truncates according to required length', () => {
    const output = truncate('abcdefg', 3)
    expect(output).toBe('abc...')
  })

  it('does not truncates if string length is lower than required length', () => {
    const output = truncate('abcdefg', 10)
    expect(output).toBe('abcdefg')
  })

  it('does not truncates if adding dots makes string lengthier', () => {
    const output = truncate('abcdefg', 5)
    expect(output).toBe('abcdefg')
  })
})
