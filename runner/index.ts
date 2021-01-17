import 'dotenv/config'
import { Config, Project, ProjectInfo, CheckResult } from './types'
import { getRepositories, getRepository } from './providers/provider-github'

async function runPlugins(project: Project, config: Config): Promise<ProjectInfo> {
  const data = await Promise.all(
    Object.entries(config.plugins).map(async ([name, plugin]) => {
      return [name, await plugin(project)]
    })
  )
  return Object.fromEntries(data)
}

async function runChecks(project: Project, config: Config): Promise<CheckResult[]> {
  return Promise.all(
    config.rules.map(async ({ check, ...rule }): Promise<CheckResult> => {
      try {
        const checkResult = await check(project)
        return {
          ...rule,
          ...checkResult,
        }
      } catch(err) {
        return {
          ...rule,
          status: 'error',
          value: err.message
        }
      }
    })
  )
}

export async function run(config: Config) {
  const repositories = await getRepositories(config)

  console.log('Running plugins...')
  const projects = await Promise.all(
    repositories.map(async (repo) => {
      const [owner, name] = repo.split('/')
      const project = { repo, owner, name }
      const pluginsData = await runPlugins(project, config)
      return {
        ...project,
        ...pluginsData,
      }
    })
  )

  console.log('Running checks..')
  const results = await Promise.all(
    projects.map(async (project) => {
      const { repo } = project
      const { url, description } = await getRepository(project)
      return {
        repo,
        url,
        description,
        rules: await runChecks(project, config),
      }
    })
  )

  return { projects: results }
}
