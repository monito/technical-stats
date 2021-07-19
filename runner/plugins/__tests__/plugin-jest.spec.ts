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

  const notFoundCallback = () =>
    Promise.resolve({
      repository: {
        jestConfig: undefined,
      },
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

  const jestConfigFile = () =>
    Promise.resolve({
      repository: {
        jestConfig: {
          text: `module.exports = {
  transform: {
    '.(ts|tsx|js)': 'ts-jest',
  },
  roots: ['<rootDir>/src/', '<rootDir>/__tests__/'],
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*\\.(test|spec))\\.(ts|tsx|js)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  modulePathIgnorePatterns: ['lib'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
  coverageThreshold:${JSON.stringify(
    COVERAGE_THRESHOLD_MATCH.coverageThreshold
  )},
  collectCoverage: true,
  collectCoverageFrom: ['src/**.{js,ts}'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest unit tests',
        outputDirectory: 'junit',
        outputName: 'user-id-test.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{classname} {title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ],
  verbose: true,
}
          `,
        },
      },
    })
  it('return empty object if no jest config was found', async () => {
    const request = client.request as unknown as jest.Mock
    request
      .mockImplementationOnce(notFoundCallback) // for jest.config.js
      .mockImplementationOnce(notFoundCallback) // for jest.config.base.js

    const output = await runPlugin()

    expect(output).toEqual({})
  })

  it('fetches the base config if config not found', async () => {
    const request = client.request as unknown as jest.Mock
    request
      .mockImplementationOnce(notFoundCallback) // for jest.config.js
      .mockImplementationOnce(jestConfigFile)

    const output = await runPlugin()

    expect(output).toMatchObject(COVERAGE_THRESHOLD_MATCH)
  })

  it('fetches jest config and parses it', async () => {
    const request = client.request as unknown as jest.Mock
    request.mockImplementationOnce(jestConfigFile)

    const output = await runPlugin()

    expect(output).toMatchObject(COVERAGE_THRESHOLD_MATCH)
  })
})
