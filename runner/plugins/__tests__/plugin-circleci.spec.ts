import { circleci } from '../plugin-circleci'
import { client } from '../../core/api'

jest.mock('../../core/api')

describe('circleci', () => {
  const runPlugin = async () => await circleci({
    owner: 'monito',
    repo: 'monito/technical-stats',
    name: 'technical-stats',
    defaultBranchName: 'main',
  })

  it('return empty object if no circle ci config was found', async () => {
    (client.request as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      repository: {
        circleciConfig: undefined
      }
    }))
    const output = await runPlugin()

    expect(output).toEqual({})
  })

  it('fetches circle config and parses it', async () => {
    const output = await runPlugin()

    expect(output).toEqual({
      version: 2.1
    })
  })
})
