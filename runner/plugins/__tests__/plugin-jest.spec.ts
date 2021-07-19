import { jestConfig } from '..'
import { client } from '../../core/api'

jest.mock('../../core/api')

describe('jest', () => {
  const runPlugin = async () =>
    await jestConfig({
      owner: 'monito',
      repo: 'monito/technical-stats',
      name: 'technical-stats',
      defaultBranchName: 'main',
    })

  it('return empty object if no jest config was found', async () => {
    const request = client.request as unknown as jest.Mock
    const notFoundCallback = () =>
      Promise.resolve({
        repository: {
          jestConfig: undefined,
        },
      })
    request
      .mockImplementationOnce(notFoundCallback) // for jest.config.js
      .mockImplementationOnce(notFoundCallback) // for jest.config.base.js
    const output = await runPlugin()

    expect(output).toEqual({})
  })

  const COVERAGE_THRESHOLD_MATCH = {
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 85,
        lines: 95,
        statements: 95,
      },
    },
  }

  it('fetches jest config and parses it', async () => {
    const output = await runPlugin()

    expect(output).toMatchObject(COVERAGE_THRESHOLD_MATCH)
  })

  it('fetches the base config is config not found', async () => {
    const request = client.request as unknown as jest.Mock
    const notFoundCallback = () =>
      Promise.resolve({
        repository: {
          jestConfig: undefined,
        },
      })
    request.mockImplementationOnce(notFoundCallback) // for jest.config.js
    const output = await runPlugin()

    expect(output).toMatchObject(COVERAGE_THRESHOLD_MATCH)
  })
})
