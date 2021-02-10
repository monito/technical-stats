import { gql } from 'graphql-request'
import { client } from '../core/api'
import { PluginInput } from '../types'

const QUERY = gql`
  query Github($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      languages(first: 10, orderBy: { direction: DESC, field: SIZE }) {
        totalSize
        edges {
          size
          node {
            name
          }
        }
      }
    }
  }
`

export async function github (project: PluginInput) {
  const { owner, name } = project
  const { repository } = await client.request(QUERY, { owner, name })
  const { languages: repositoryLanguages } = repository
  const { totalSize } = repositoryLanguages
  const languages = repositoryLanguages.edges
    .map(({ size, node }: { size: number, node: { name: string } }) => ({
      name: node.name,
      percentage: (size / totalSize) * 100,
    }))

  return {
    languages,
  }
}
