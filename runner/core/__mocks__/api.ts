export const client = {
  request: jest.fn().mockImplementation(() =>
    Promise.resolve({
      organization: {
        repositories: {
          nodes: [{ name: 'technical-stats' }],
        },
      },
      repository: {
        url: 'https://github.com/monito/technical-stats',
        description:
          'Tool to generate reports capturing stats of repositories in GitHub organisation 💚',
        isArchived: false,
        defaultBranchRef: {
          name: 'main',
        },
        circleciConfig: {
          text: 'version: 2.1',
        },
        dockerfile: {
          text: 'FROM node:12-slim',
        },
        package: {
          text: JSON.stringify({
            name: '@monito/technical-stats',
          }),
        },
        tsconfig: {
          text: JSON.stringify({
            compilerOptions: {
              strict: true,
            },
          }),
        },
        languages: {
          totalSize: 200,
          edges: [
            {
              size: 150,
              node: {
                name: 'TypeScript',
              },
            },
            {
              size: 45,
              node: {
                name: 'JavaScript',
              },
            },
          ],
        },
        prTemplate: {
          text: '# Title',
        },
        readme: {
          text: `
          # Projects Stats

> Compliance statistics of our GitHub Monito projects

---

- [Why?](#why)
- [Getting Started](#getting-started)
- [FAQ](#faq)

---

## Why?

...

## Getting Started

..

## FAQ

..
          `,
        },
        jestConfig: {
          text: `module.exports = ${JSON.stringify({
            transform: {
              '.(ts|tsx|js)': 'ts-jest',
            },
            roots: ['<rootDir>/src/', '<rootDir>/__tests__/'],
            testEnvironment: 'node',
            testResultsProcessor: '<rootDir>/../../node_modules/jest-junit',
            testRegex: '(/__tests__/.*\\.(test|spec))\\.(ts|tsx|js)$',
            moduleFileExtensions: ['ts', 'tsx', 'js'],
            modulePathIgnorePatterns: ['lib'],
            coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
            coverageThreshold: {
              global: {
                branches: 80,
                functions: 85,
                lines: 95,
                statements: 95,
              },
            },
            collectCoverage: true,
            collectCoverageFrom: ['src/**.{js,ts}'],
            reporters: [
              'default',
              [
                'jest-junit',
                {
                  suiteName: 'jest unit tests',
                  outputDirectory: '../../junit',
                  uniqueOutputName: 'true',
                  classNameTemplate: '{classname}',
                  titleTemplate: '{classname} {title}',
                  ancestorSeparator: ' › ',
                  usePathForSuiteName: 'true',
                },
              ],
            ],
            verbose: true,
          })}`,
        },
      },
    })
  ),
}
