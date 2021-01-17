const javascript = require('./runner/plugins/plugin-javascript').default
const typescript = require('./runner/plugins/plugin-typescript').default
const github = require('./runner/plugins/plugin-github').default

module.exports = {
  repositories: [
    'gifsa/tawidata',
    'gifsa/tawicontent',
    'gifsa/tawiconfig',
    'gifsa/tawigator',
    'gifsa/tawid',
  ],
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
        const ts = github.languages.find((l) => l.name === 'TypeScript')
        return ts && ts.percentage >= 75
      },
    },
    {
      name: 'Typescript Strict',
      description: 'Should use a strict Typescript config',
      check({ typescript }) {
        return typescript.tsconfig.compilerOptions.strict === true
      },
    },
    {
      name: 'PHP Free',
      description: 'Not using PHP',
      check({ github }) {
        return github.languages.find((l) => l.name === 'PHP') === undefined
      },
    },
    {
      name: 'Latest Logger',
      description: 'Using latest tawilog library with improved tracing',
      check({ javascript }) {
        return (
          javascript.package.dependencies.tawilog >=
          'git+https://github.com/gifsa/tawilog.git#semver:^1.4.0'
        )
      },
    },
  ],
}
