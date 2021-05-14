# technical-stats

## How to use this project

Add `@monito` to list of registries.

```txt
@monito:registry=https://npm.pkg.github.com
```

Install package.

```sh
yarn add @monito/technical-stats
```

Configure `package.json` to run cli tool

```js
// package.json
{
  ...
  "generate:stats": generate-stats.js
  ...
}

// generate-stats.js
const { cli } = require('@monito/technical-stats')
cli(__dirname)
```

Add `.env` file containing Github token.

```sh
TECHNICAL_STATS_GITHUB_TOKEN=
```

Configure goals.

```js
// stats.config.js
const { pluginTypescript } = require('@monito/technical-stats')

module.exports = {
  organization: 'monito',
  plugins: {
    pluginTypescript,
  },
  goals: [
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
    }
}

```

Run stats generation

```
yarn generate:stats
```

Open `report.html` to see the results.

## How to contribute

We welcome [issues](https://github.com/monito/technical-stats/issues) to and [pull requests](https://github.com/monito/technical-stats/pulls) against this repository!

### How to test your changes on your local.

There is a target in the `package.json` allowing to trigger the `service-stats` CLI:

```
yarn cli:test
```

The prerequisites are:

1. copy `.env.template` to `.env`, and add your Github token.
2. create a `stats.config.js` in the `./cli` directory

Sample of `stats.config.js`:

```
const { circleci, docker, github, typescript } = require('../runner/plugins')

module.exports = {
  organization: 'monito',
  plugins: {
    circleci,
    docker,
    github,
    typescript,
  },
  checkAchieved(percentage) {
    const value = percentage
    const status = value >= 80 ? 'pass' : value >= 50 ? 'warn' : 'fail'
    return {
      status,
      value,
    }
  },
  goals: [
    {
      name: 'My check',
      description: 'a check against the repository',
      check({ circleci }) {
        const value = circleci.version
        return {
          status: value === 2.1 ? 'pass' : 'warn',
          value,
        }
      },
    },
  ],
}
```

See the [Config type](https://github.com/monito/technical-stats/blob/e7b3fafc3f06aad62f537c646ec2bd8aaf1b21c4/runner/types.ts#L25)

Reports are going to be created in the `./cli` directory
