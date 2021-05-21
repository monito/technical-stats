import { typescript } from '../plugin-typescript'

jest.mock('../../core/api')

describe('typescript', () => {
  const runPlugin = async () =>
    await typescript({
      owner: 'monito',
      repo: 'monito/technical-stats',
      name: 'technical-stats',
      defaultBranchName: 'main',
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
