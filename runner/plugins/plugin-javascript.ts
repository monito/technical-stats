import { gql } from 'graphql-request'
import { client } from '../core/api'
import { Project } from '../types'

const QUERY = gql`
  query Javascript($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      package: object(expression: "master:package.json") {
        ... on Blob {
          text
        }
      }
    }
  }
`

export default async function (project: Project) {
  const { owner, name } = project
  const { repository } = await client.request(QUERY, { owner, name })
  const packageJson = repository.package
    ? JSON.parse(repository.package.text)
    : null
  return {
    packageJson,
  }
}
