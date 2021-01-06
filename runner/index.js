import 'dotenv/config'

async function runPlugins(project, config) {
  const data = await Promise.all(
    Object.entries(config.plugins).map(async ([name, plugin]) => {
      return [name, await plugin(project)]
    })
  )
  return Object.fromEntries(data)
}

async function runChecks(project, config) {
  return Promise.all(
    config.rules.map(async ({ check, ...rule }) => ({
      ...rule,
      pass: Boolean(await check(project)),
    }))
  )
}

export async function run(config) {
  const projects = await Promise.all(
    config.repositories.map(async (repo) => {
      const [owner, name] = repo.split('/')
      const project = { repo, owner, name }
      const pluginsData = await runPlugins(project, config)
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
        rules: await runChecks(project, config),
      }
    })
  )

  return { projects: results }
}
