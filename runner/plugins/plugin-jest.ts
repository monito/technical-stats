import { gql } from 'graphql-request'
import { client } from '../core/api'
import { PluginInput } from '../types'

const QUERY = gql`
  query JestConfig($owner: String!, $name: String!, $configPath: String!) {
    repository(owner: $owner, name: $name) {
      jestConfig: object(expression: $configPath) {
        ... on Blob {
          text
        }
      }
    }
  }
`

export async function jestConfig(project: PluginInput) {
  const { owner, name, defaultBranchName } = project
  let jestConfig
  const { repository } = await client.request(QUERY, {
    owner,
    name,
    configPath: `${defaultBranchName}:jest.config.js`,
  })
  jestConfig = repository.jestConfig?.text
  if (!jestConfig) {
    const { repository } = await client.request(QUERY, {
      owner,
      name,
      configPath: `${defaultBranchName}:jest.config.base.js`,
    })
    jestConfig = repository.jestConfig?.text
    if (!jestConfig) {
      return {}
    }
  }
  return JSON.parse(jestConfig.substring('module.exports = '.length))
}
