import 'dotenv/config'
import { Config, Project, PluginInput, PluginOutput, ProjectOutput, CheckOutput } from './types'
import { getRepositories, getRepository } from './providers/provider-github'
import { calculateStats } from './features'

const SERVICE_SCAN_TIMEOUT = 100

async function runPlugins(project: PluginInput, config: Config): Promise<PluginOutput> {
  const data = await Promise.all(
    Object.entries(config.plugins).map(async ([name, plugin]) => {
      return [name, await plugin(project)]
    })
  )
  return Object.fromEntries(data)
}

async function runChecks(project: Project, config: Config): Promise<CheckOutput[]> {
  return Promise.all(
    config.goals.map(async ({ check, name }): Promise<CheckOutput> => {
      try {
        const checkResult = await check(project)
        return {
          ...checkResult,
          name,
        }
      } catch(err) {
        return {
          name,
          status: 'error',
          value: err.message
        }
      }
    })
  )
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function run(config: Config) {
  const repositories = await getRepositories(config)

  console.log(`Running plugins for ${repositories.length} repositories...`)
  const projects = await Promise.all(
    repositories.map(async (repo, index): Promise<ProjectOutput> => {
      const [owner, name] = repo.split('/')
      const project = { repo, owner, name }
      const { url, description, isArchived, defaultBranchName } = await getRepository(project)
      if (isArchived) {
        return {
          active: false
        } as ProjectOutput
      }

      await sleep(index * SERVICE_SCAN_TIMEOUT)
      console.log(`Scanning ${repo}...`)
      const pluginsData = await runPlugins({ ...project, defaultBranchName }, config)
      return {
          active: true,
          url,
          description,
          defaultBranchName,
        ...project,
        ...pluginsData,
      }
    })
  )
  const filteredProject = projects.filter(project => project.active)

  console.log(`Running checks for ${filteredProject.length} projects...`)
  const results = await Promise.all(
    filteredProject
    .map(async (project) => {
      const checks = await runChecks(project, config)
      const { stats, percentage } = calculateStats(checks)

      return {
        repo: project.repo,
        description: project.description,
        url: project.url,
        stats,
        achieved: config.checkAchieved(percentage),
        checks,
      }
    })
  )

  return {
    projects: results,
    goals: config.goals.map(({ name, description, link }) => ({ name, description, link })),
    generatedAt: new Date().toISOString()
  }
}
