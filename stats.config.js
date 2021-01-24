const typescript = require('./runner/plugins/plugin-typescript').default
const docker = require('./runner/plugins/plugin-docker').default
const github = require('./runner/plugins/plugin-github').default

const round = (num) => Math.round(num * 100) / 100

module.exports = {
  organization: 'gifsa',
  plugins: {
    typescript,
    docker,
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
        const value = round(ts && ts.percentage)
        const status = value >= 75
          ? 'pass'
          : value >= 50
            ? 'warn'
            : 'fail'
        return { status, value }
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
        const php = github.languages.find((l) => l.name === 'PHP')
        const topLang = github.languages[0] || {}
        return {
          status: php === undefined ? 'pass' : 'fail',
          value: `${topLang.name}: ${roundtopLang.percentage}`
        }
      },
    },
    {
      name: 'Latest Logger',
      description: 'Using latest tawilog library with improved tracing',
      check({ typescript }) {
        if (!typescript.packageJson || !typescript.packageJson.dependencies) {
          return { status: 'skip' }
        }
        const value = typescript.packageJson.dependencies['@gifsa/logger']
        return {
          status: value >= '^3.0.0' ? 'pass' : 'fail',
          value
        }
      },
    },
    {
      name: 'Alpine',
      description: 'Using alpine image',
      check({ docker }) {
        if (!docker.image) {
          return { status: 'skip' }
        }
        const value = docker.image
        const status = value.includes('alpine')
          ? 'pass'
          : value.includes('slim')
            ? 'warn'
            : 'fail'
        return {
          status,
          value
        }
      }
    },
    {
      name: 'Node LTS',
      description: 'Using LTS version of Node.js',
      check({ docker }) {
        if (!docker.image || !docker.image.includes('node')) {
          return { status: 'skip' }
        }
        const status = docker.image.includes('lts') || Number(docker.imageVersion) >= 14
          ? 'pass'
          : Number(docker.imageVersion) >= 10
            ? 'warn'
            : 'fail'
        return {
          status,
          value: docker.image
        }
      },
    },
  ],
}
