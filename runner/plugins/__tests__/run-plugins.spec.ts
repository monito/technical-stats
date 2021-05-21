import { runPlugins } from '../run-plugins'
import { circleci } from '../plugin-circleci'
import { docker } from '../plugin-docker'

jest.mock('../../core/api')

describe('run-plugins', () => {
  const project = {
    owner: 'monito',
    repo: 'monito/technical-stats',
    name: 'technical-stats',
    defaultBranchName: 'main',
  }

  it('return empty object if no plugins provided', async () => {
    const output = await runPlugins(project, {
      plugins: {},
    })

    expect(output).toEqual({})
  })

  it('returns data from multiple plugins', async () => {
    const output = await runPlugins(project, {
      plugins: {
        circleci,
        docker,
      },
    })

    expect(output).toEqual({
      circleci: {
        version: 2.1,
      },
      docker: {
        image: 'node:12-slim',
        imageVersion: '12-slim',
      },
    })
  })
})
