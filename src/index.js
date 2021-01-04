import 'dotenv/config'
import config from './config'

async function runPlugins(project, conf) {
  const data = await Promise.all(
    Object.entries(conf.plugins).map(async ([name, plugin]) => {
      return [name, await plugin(project)]
    })
  )
  return Object.fromEntries(data)
}

async function runChecks(project, conf) {
  return Promise.all(
    conf.rules.map(async ({ check, ...rule }) => ({
      ...rule,
      pass: Boolean(await check(project)),
    }))
  )
}

async function run(conf) {
  const projects = await Promise.all(
    conf.repositories.map(async (repo) => {
      const [owner, name] = repo.split('/')
      const project = { repo, owner, name }
      const pluginsData = await runPlugins(project, conf)
      return {
        ...project,
        ...pluginsData,
      }
    })
  )
  const results = await Promise.all(
    projects.map(async (project) => {
      const { repo } = project
      return {
        repo,
        rules: await runChecks(project, conf),
      }
    })
  )

  console.log(require('util').inspect(results, false, null, true))
}

run(config)
