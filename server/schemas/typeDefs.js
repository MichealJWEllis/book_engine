// our typeDefs will serve as our new models as we shift over from MVC to graphQL Apollo

// import graphQL
const { gql } = require('apollo-server-express')

const typeDefs = gql `
  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    saveBooks: [Book]
  }
  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
  type Auth {
    token: ID
    user: User
  }
  
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: [String], description: String, title: String, bookId: ID, image: String, link: String): User
    removeBooks(bookId: ID!): User
  }
`

module.exports = typeDefs;