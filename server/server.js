// install our server and middleware
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// use to distribute our build to the build file
const path = require('path');

// grab what we need to feed the server
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

//establish connection to the internet
const app = express();
const PORT = process.env.PORT || 3001;

// create the apollo server and give it the typeDefs and resolvers for executing queries and mutations
const server = new ApolloServer ({
  typeDefs, 
  resolvers
})

// setup middleware
server.applyMiddleware({ app })

//set up middleware guidelines
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// send the product to the client after the build
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Test GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  })
});
