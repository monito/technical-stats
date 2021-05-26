import { sleep } from '../sleep'

describe('sleep', () => {
  it('pauses script execution for given amount of milliseconds', async () => {
    const timeBefore = Date.now()
    await sleep(1000)
    const timeAfter = Date.now()

    const timeDiffernce = timeAfter - timeBefore
    expect(timeDiffernce).toBeGreaterThanOrEqual(1000)
    expect(timeDiffernce).toBeLessThanOrEqual(1010)
  })
})
