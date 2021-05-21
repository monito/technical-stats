import { calculateStats } from '..'
import { Status } from '../../types'

describe('calculateStats', () => {
  const PASSED: Status = 'pass'
  const config = {
    checkAchieved: () => ({ status: PASSED }),
  }

  it('returns achived value as calculated in checkAchieved', () => {
    const output = calculateStats([], config)
    expect(output.achieved).toEqual({ status: 'pass' })
  })

  it('gives you 0 percent achived and 0 stats when no checks specified', () => {
    const output = calculateStats([], config)
    expect(output.percentage).toBe(0)
    expect(output.stats).toEqual({ error: 0, fail: 0, pass: 0, skip: 0, warn: 0 })
  })

  it('gives you 100 percent when all checks passed', () => {
    const output = calculateStats([
      { status: 'pass' },
      { status: 'pass' },
    ], config)
    expect(output.percentage).toEqual(100)
  })

  it('uses formula to calculate percentage', () => {
    const output = calculateStats([
      { status: 'pass' },
      { status: 'warn' },
      { status: 'fail' },
    ], config)
    expect(output.percentage).toEqual(50)
  })

  it('skip and error does not count in percentage formula', () => {
    const output = calculateStats([
      { status: 'skip' },
      { status: 'error' },
    ], config)
    expect(output.percentage).toEqual(0)
  })
})
