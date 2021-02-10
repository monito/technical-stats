import { gql } from 'graphql-request'
import { client } from '../core/api'
import { Project } from '../types'
import * as JSON5 from 'json5'

const QUERY = gql`
  query Typescript($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      package: object(expression: "master:package.json") {
        ... on Blob {
          text
        }
      }
      tsconfig: object(expression: "master:tsconfig.json") {
        ... on Blob {
          text
        }
      }
    }
  }
`

export async function typescript (project: Project) {
  const { owner, name } = project
  const { repository } = await client.request(QUERY, { owner, name })
  const tsconfig = repository.tsconfig
    ? JSON5.parse(repository.tsconfig.text)
    : null
  const packageJson = repository.package
    ? JSON.parse(repository.package.text)
    : null
  return { tsconfig, packageJson }
}
