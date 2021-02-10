import { gql } from 'graphql-request'
import { client } from '../core/api'
import { Project } from '../types'

const QUERY = gql`
  query Javascript($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      dockerfile: object(expression: "master:Dockerfile") {
        ... on Blob {
          text
        }
      }
    }
  }
`

export async function docker (project: Project) {
  const { owner, name } = project
  const { repository } = await client.request(QUERY, { owner, name })
  if (!repository.dockerfile) {
    return {}
  }
  const dockerfile = repository.dockerfile.text
  const image = dockerfile.split('\n')[0].substring(5)
  const imageVersion = image.substring(image.indexOf(':') + 1)
  return {
    image,
    imageVersion
  }
}
