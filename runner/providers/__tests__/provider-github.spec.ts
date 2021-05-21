import { getRepository, getRepositories } from '../provider-github'

jest.mock('../../core/api')

describe('provider-github', () => {
  it('fetches info about repository', async () => {
    const output = await getRepository({
      owner: 'monito',
      repo: 'monito/technical-stats',
      name: 'technical-stats',
    })

    expect(output).toEqual({
      url: 'https://github.com/monito/technical-stats',
      description:
        'Tool to generate reports capturing stats of repositories in GitHub organisation 💚',
      isArchived: false,
      defaultBranchName: 'main',
    })
  })

  it('fetches info about organisation', async () => {
    const output = await getRepositories({ organization: 'monito' })

    expect(output).toEqual(['monito/technical-stats'])
  })

  it('config options will take precedence over default and API values', async () => {
    const output = await getRepositories({
      organization: 'monito',
      amountOfRepos: 5,
      repositories: ['monito/technical-stats', 'monito/license-checker-orb', 'monito/monito.github.io'],
      excludeRepos: ['monito/monito.github.io'],
    })

    expect(output).toEqual(['monito/technical-stats', 'monito/license-checker-orb'])
  })
})
