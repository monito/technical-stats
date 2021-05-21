import { github } from '../plugin-github'

jest.mock('../../core/api')

describe('github', () => {
  const runPlugin = async () =>
    await github({
      owner: 'monito',
      repo: 'monito/technical-stats',
      name: 'technical-stats',
      defaultBranchName: 'main',
    })

  it('fetches pr template and its lines', async () => {
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
