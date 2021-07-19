//import our resolvers and typeDefs to be exported to the server file for our 'new ApolloServer'
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

// compress the typeDefs and resolvers for shipment
module.exports = { typeDefs, resolvers };