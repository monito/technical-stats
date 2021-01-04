require('dotenv/config')

module.exports = {
  client: {
    include: ['src/**/*'],
    service: {
      name: 'github',
      url: 'https://api.github.com/graphql',
      headers: {
        authorization: `Bearer ${process.env.GH_TOKEN}`,
      },
      skipSSLValidation: true,
    },
  },
}
