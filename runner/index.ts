import 'dotenv/config'
import { Config, Project, PluginInput, PluginOutput, ProjectScanned, CheckOutput, GoalOutput, Output } from './types'
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
          repo: project.repo
        }
      } catch (err) {
        return {
          status: 'error',
          value: err.message,
          name,
          repo: project.repo
        }
      }
    })
  )
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function run(config: Config): Promise<Output> {
  const repositories = await getRepositories(config)
  const goalsMap = config.goals.reduce<Record<string, GoalOutput>>((accumulator, goal) => {
    accumulator[goal.name] = {
      name: goal.name,
      description: goal.description,
      link: goal.link,
      checks: [],
      stats: { pass: 0, warn: 0, fail: 0, error: 0, skip: 0 },
      percentage: 0,
      achieved: { status: 'error', value: 'Not yet calculated' }
    }
    return accumulator
  }, {})

  console.log(`Running plugins for ${repositories.length} repositories...`)
  const scannedProjects = await Promise.all(
    repositories.map(async (repo, index): Promise<ProjectScanned> => {
      const [owner, name] = repo.split('/')
      const project = { repo, owner, name }
      const { url, description, isArchived, defaultBranchName } = await getRepository(project)
      if (isArchived) {
        return {
          active: false
        } as ProjectScanned
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
  const filteredProjects = scannedProjects.filter(project => project.active)

  console.log(`Running checks for ${filteredProjects.length} projects...`)
  const allChecks: CheckOutput[] = []
  const projects = await Promise.all(
    filteredProjects
      .map(async (project) => {
        const checks = await runChecks(project, config)
        allChecks.push(...checks)
        checks.forEach(check => {
          goalsMap[check.name].checks.push(check)
        })

        return {
          repo: project.repo,
          description: project.description,
          url: project.url,
          checks,
          ...calculateStats(checks, config),
        }
      })
  )

  const goals: GoalOutput[] = Object.values(goalsMap).map((goal) => {
    return {
      ...goal,
      ...calculateStats(goal.checks, config),
    }
  })

  const { stats, achieved } = calculateStats(allChecks, config)

  return {
    projects,
    goals,
    stats,
    totalAchieved: achieved,
    generatedAt: new Date().toISOString()
  }
}
