import { run } from '..'
import { github } from '../plugins/plugin-github'
import { typescript } from '../plugins/plugin-typescript'

jest.mock('../core/api')

describe('runner', () => {
  beforeEach(() => {
    console.log = () => {}
  })

  it('can generate report without goals specified', async () => {
    const output = await run({
      organization: 'monito',
      checkAchieved: (percentage: number) => ({
        status: percentage > 75 ? 'pass' : 'fail',
      }),
      plugins: {
        github,
        typescript,
      },
      goals: [],
    })

    expect(output).toMatchSnapshot()
  })

  it('can generate report with goals applied', async () => {
    const output = await run({
      organization: 'monito',
      checkAchieved: (percentage: number) => ({
        status: percentage > 75 ? 'pass' : 'fail',
      }),
      plugins: {
        github,
        typescript,
      },
      goals: [{
        name: 'main branch',
        description: 'the project is using main branch',
        check: async ({ defaultBranchName }) => {
          const status = defaultBranchName === 'main' ? 'pass' : 'fail'
          return { status, value: defaultBranchName }
        }
      }],
    })

    expect(output).toMatchSnapshot()
  })
})
