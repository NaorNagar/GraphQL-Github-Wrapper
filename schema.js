// Imports
const {makeExecutableSchema} = require('graphql-tools');
const {importSchema} = require('graphql-import');
const typeDefs = importSchema('./schema.graphql'); // import schema definition
const fetch = require('node-fetch');

// Definitions
const BASE_URL = 'https://api.github.com'; // should be an env var

// Resolvers
const resolvers = {
  Query: {
    async user(parent, args, ctx, info) {
      if (!args.username) {
        throw new Error('username is required')
      }

      const userInfo = await fetch(`${BASE_URL}/users/${args.username}`);
      return userInfo.ok ? userInfo.json() : null;
    }

  },
  User: {
    async repositories(parent, args, ctx, info) {
      if (!parent['repos_url']) {
        throw new Error('missing repos_url in parent');
      }
      const reposInfo = await fetch(parent['repos_url']);
      return reposInfo.ok ? reposInfo.json() : [];
    },
  }

};


// Export Schema
module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});