import { readme } from '..'
import { client } from '../../core/api'

jest.mock('../../core/api')

describe('readme', () => {
  const runPlugin = async () =>
    await readme({
      owner: 'monito',
      repo: 'monito/technical-stats',
      name: 'technical-stats',
      defaultBranchName: 'main',
    })

  const notFoundCallback = () =>
    Promise.resolve({
      repository: {
        jestConfig: undefined,
      },
    })

  it('fetches README.md lines', async () => {
    const readme = await runPlugin()
    expect(readme.includes('[Why?](#why)')).toBeTruthy()
  })

  it('returns undefined if no README.md file', async () => {
    const request = client.request as unknown as jest.Mock
    request.mockImplementationOnce(notFoundCallback)

    const readme = await runPlugin()
    expect(readme).toBeUndefined()
  })
})
