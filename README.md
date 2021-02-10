# technical-stats

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

Configure rules.
```js
// stats.config.js
const { pluginTypescript } = require('@monito/technical-stats')

module.exports = {
  organization: 'monito',
  plugins: {
    pluginTypescript,
  },
  rules: [
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
