import { typescript } from '..'
import { client } from '../../core/api'

jest.mock('../../core/api')

describe('typescript', () => {
  const runPlugin = async () =>
    await typescript({
      owner: 'monito',
      repo: 'monito/technical-stats',
      name: 'technical-stats',
      defaultBranchName: 'main',
    })

  it('returns no information if no package.json or tsconfig.json found', async () => {
    const request = client.request as unknown as jest.Mock
    request.mockImplementationOnce(() =>
      Promise.resolve({
        repository: {},
      })
    )
    const output = await runPlugin()

    expect(output).toEqual({ packageJson: undefined, tsconfig: undefined })
  })

  it('fetches package.json', async () => {
    const output = await runPlugin()
    expect(output.packageJson).toEqual({ name: '@monito/technical-stats' })
  })

  it('fetches tsconfig.json', async () => {
    const output = await runPlugin()
    expect(output.tsconfig).toEqual({ compilerOptions: { strict: true } })
  })
})
