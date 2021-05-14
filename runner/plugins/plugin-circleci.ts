import { gql } from 'graphql-request'
import * as YAML from 'yaml'
import { client } from '../core/api'
import { PluginInput } from '../types'

const QUERY = gql`
  query CircleCi($owner: String!, $name: String!, $configPath: String!) {
    repository(owner: $owner, name: $name) {
      circleciConfig: object(expression: $configPath) {
        ... on Blob {
          text
        }
      }
    }
  }
`

export async function circleci(project: PluginInput) {
  const { owner, name, defaultBranchName } = project
  const { repository } = await client.request(QUERY, {
    owner,
    name,
    configPath: `${defaultBranchName}:.circleci/config.yml`,
  })
  if (!repository.circleciConfig) {
    return {}
  }
  return YAML.parse(repository.circleciConfig.text)
}
