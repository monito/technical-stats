import { docker } from '../plugin-docker'
import { client } from '../../core/api'

jest.mock('../../core/api')

describe('docker', () => {
  const runPlugin = async () => await docker({
    owner: 'monito',
    repo: 'monito/technical-stats',
    name: 'technical-stats',
    defaultBranchName: 'main',
  })

  it('return empty object if no Dockerfile config was found', async () => {
    (client.request as unknown as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      repository: {
        dockerfile: undefined
      }
    }))
    const output = await runPlugin()

    expect(output).toEqual({})
  })

  it('fetches Dockerfile and returns image and image version', async () => {
    const output = await runPlugin()

    expect(output).toEqual({
      image: 'node:12-slim',
      imageVersion: '12-slim'
    })
  })
})
