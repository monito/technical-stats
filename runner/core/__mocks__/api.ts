export const client = {
  request: jest.fn().mockImplementation(() =>
    Promise.resolve({
      repository: {
        circleciConfig: {
          text: 'version: 2.1'
        },
        dockerfile: {
          text: 'FROM node:12-slim'
        },
        package: {
          text: JSON.stringify({
            name: '@monito/technical-stats',
          }),
        },
        tsconfig: {
          text: JSON.stringify({
            compilerOptions: {
              strict: true,
            },
          }),
        },
        languages: {
          totalSize: 200,
          edges: [
            {
              size: 150,
              node: {
                name: 'TypeScript',
              },
            },
            {
              size: 45,
              node: {
                name: 'JavaScript',
              },
            }
          ],
        },
        prTemplate: {
          text: '# Title',
        }
      },
    })
  ),
}
