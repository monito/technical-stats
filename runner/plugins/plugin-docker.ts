import { gql } from 'graphql-request'
import { client } from '../core/api'
import { PluginInput } from '../types'

const QUERY = gql`
  query Docker($owner: String!, $name: String!, $dockerfileLocation: String!) {
    repository(owner: $owner, name: $name) {
      dockerfile: object(expression: $dockerfileLocation) {
        ... on Blob {
          text
        }
      }
    }
  }
`

export async function docker (project: PluginInput) {
  const { owner, name, defaultBranchName } = project
  const { repository } = await client.request(QUERY, {
    owner,
    name,
    dockerfileLocation: `${defaultBranchName}:Dockerfile`
  })
  if (!repository.dockerfile) {
    return {}
  }
  const dockerfile = repository.dockerfile.text
  const image: string = dockerfile.split('\n')[0].split('FROM ')[1]
  const versionResults = /.*:(\S+)\s?.*/.exec(image)
  const imageVersion = versionResults && versionResults[1]
  return {
    image,
    imageVersion
  }
}
