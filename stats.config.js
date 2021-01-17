const javascript = require('./runner/plugins/plugin-javascript').default
const typescript = require('./runner/plugins/plugin-typescript').default
const github = require('./runner/plugins/plugin-github').default

module.exports = {
  organization: 'gifsa',
  plugins: {
    javascript,
    typescript,
    github,
  },
  rules: [
    {
      name: 'Typescript Compliant',
      description: 'Written 75% in TypeScript',
      check({ github }) {
        const python = github.languages.find((l) => l.name === 'Python')
        if (python) {
          return { status: 'skip' }
        }
        const ts = github.languages.find((l) => l.name === 'TypeScript')
        const value = ts && ts.percentage
        return {
          status: value >= 75 ? 'pass' : 'fail',
          value
        }
      },
    },
    {
      name: 'Typescript Strict',
      description: 'Should use a strict Typescript config',
      check({ typescript }) {
        if (!typescript.tsconfig) {
          return { status: 'skip' }
        }
        const value = typescript.tsconfig.compilerOptions.strict
        return {
          status: value === true ? 'pass' : 'fail',
          value
        }
      },
    },
    {
      name: 'PHP Free',
      description: 'Not using PHP',
      check({ github }) {
        return {
          status: github.languages.find((l) => l.name === 'PHP') === undefined ? 'pass' : 'fail',
          value: JSON.stringify(github.languages)
        }
      },
    },
    {
      name: 'Latest Logger',
      description: 'Using latest tawilog library with improved tracing',
      check({ javascript }) {
        if (!javascript.packageJson) {
          return { status: 'skip' }
        }
        const value = javascript.packageJson.dependencies['@gifsa/logger']
        return {
          status: value >= '^3.0.0' ? 'pass' : 'fail',
          value
        }
      },
    },
  ],
}
