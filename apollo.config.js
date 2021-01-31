require('dotenv/config')

module.exports = {
  client: {
    include: ['src/**/*'],
    service: {
      name: 'github',
      url: 'https://api.github.com/graphql',
      headers: {
        authorization: `Bearer ${process.env.TECHNICAL_STATS_GITHUB_TOKEN}`,
      },
      skipSSLValidation: true,
    },
  },
}
