import { runChecks } from '../run-checks'

describe('run-checks', () => {
  const project = {
    owner: 'monito',
    repo: 'monito/technical-stats',
    name: 'technical-stats',
    defaultBranchName: 'main',
    url: 'https://github.com/monito/technical-stats',
    description:
      'Tool to generate reports capturing stats of repositories in GitHub organisation 💚',
    active: false,
  }

  it('return empty array if no checks provided', async () => {
    const output = await runChecks(project, {
      goals: [],
    })

    expect(output).toEqual([])
  })

  it('runs provided checks', async () => {
    const output = await runChecks(project, {
      goals: [
        {
          name: 'main branch',
          description: 'should use main branch as default branch',
          check: async ({ defaultBranchName }) => {
            const status = defaultBranchName === 'main' ? 'pass' : 'fail'
            return { status, value: defaultBranchName }
          },
        },
      ],
    })

    expect(output).toEqual([
      {
        repo: 'monito/technical-stats',
        name: 'main branch',
        status: 'pass',
        value: 'main'
      },
    ])
  })

  it('catches checks error with "error" status', async () => {
    const output = await runChecks(project, {
      goals: [
        {
          name: 'main branch',
          description: 'should use main branch as default branch',
          check: async () =>
            Promise.reject(new Error('Failed to perform check')),
        },
      ],
    })

    expect(output).toEqual([
      {
        repo: 'monito/technical-stats',
        name: 'main branch',
        status: 'error',
        value: 'Failed to perform check',
      },
    ])
  })
})
