import { gql } from 'graphql-request'
import { client } from '../core/api'
import { PluginInput } from '../types'
import * as JSON5 from 'json5'

const QUERY = gql`
  query Typescript($owner: String!, $name: String!, $packageJsonLocation: String!, $tsconfigLocation: String!) {
    repository(owner: $owner, name: $name) {
      package: object(expression: $packageJsonLocation) {
        ... on Blob {
          text
        }
      }
      tsconfig: object(expression: $tsconfigLocation) {
        ... on Blob {
          text
        }
      }
    }
  }
`

export async function typescript (project: PluginInput) {
  const { owner, name, defaultBranchName } = project
  const { repository } = await client.request(QUERY, {
    owner,
    name,
    packageJsonLocation: `${defaultBranchName}:package.json`,
    tsconfigLocation: `${defaultBranchName}:tsconfig.json`
  })

  const tsconfig = repository.tsconfig
    ? JSON5.parse(repository.tsconfig.text)
    : null
  const packageJson = repository.package
    ? JSON.parse(repository.package.text)
    : null
  return { tsconfig, packageJson }
}
