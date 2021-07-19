import { github } from '..'
import { client } from '../../core/api'

jest.mock('../../core/api')

describe('github', () => {
  const runPlugin = async () =>
    await github({
      owner: 'monito',
      repo: 'monito/technical-stats',
      name: 'technical-stats',
      defaultBranchName: 'main',
    })

  it('returns no information if not languages and PR template found', async () => {
    const request = client.request as unknown as jest.Mock
    request.mockImplementationOnce(() =>
      Promise.resolve({
        repository: {},
      })
    )
    const output = await runPlugin()

    expect(output).toEqual({ languages: [], prTemplateLines: undefined })
  })

  it('fetches PR template and its lines', async () => {
    const output = await runPlugin()
    expect(output.prTemplateLines).toEqual(['# Title'])
  })

  it('fetches language information and caculates language use percentage', async () => {
    const output = await runPlugin()
    expect(output.languages).toEqual([
      {
        name: 'TypeScript',
        percentage: 75,
      },
      {
        name: 'JavaScript',
        percentage: 22.5,
      },
    ])
  })
})
