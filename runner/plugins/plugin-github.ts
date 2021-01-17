import { gql } from 'graphql-request'
import { client } from '../core/api'
import { Project } from '../types'

const QUERY = gql`
  query Github($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      url
      description
      languages(first: 20, orderBy: { direction: DESC, field: SIZE }) {
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

export default async function (project: Project) {
  const { owner, name } = project
  const { repository } = await client.request(QUERY, { owner, name })
  const { url, description, languages } = repository
  const { totalSize } = languages
  return {
    url,
    description,
    languages: languages.edges.map(({ size, node }: { size: number, node: { name: string } }) => ({
      name: node.name,
      percentage: (size / totalSize) * 100,
    })),
  }
}
