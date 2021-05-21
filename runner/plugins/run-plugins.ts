import { Config, PluginInput, PluginOutput } from '../types'

export async function runPlugins(
  project: PluginInput,
  config: Pick<Config, 'plugins'>
): Promise<PluginOutput> {
  const data = await Promise.all(
    Object.entries(config.plugins).map(async ([name, plugin]) => {
      return [name, await plugin(project)]
    })
  )
  return Object.fromEntries(data)
}
