import { gql } from 'graphql-request'
import { client } from '../core/api'
import { PluginInput } from '../types'

const QUERY = gql`
  query readme($owner: String!, $name: String!, $configPath: String!) {
    repository(owner: $owner, name: $name) {
      readme: object(expression: $configPath) {
        ... on Blob {
          text
        }
      }
    }
  }
`

export async function readme(project: PluginInput) {
  const { owner, name, defaultBranchName } = project
  const configPath = `${defaultBranchName}:README.md`
  const {
    repository: { readme },
  } = await client.request(QUERY, { owner, name, configPath })
  return readme?.text
}
