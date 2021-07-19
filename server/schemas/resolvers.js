// our resolvers are what controllers are for an MVC model

// allow access to the User database for queries and mutations
const { User } = require('../models')
// here were importing a helpful function from the apollo serverside library
const { AuthenticationError } = require('apollo-server-express');
// here we import a function from our own library, utils
const { signToken } = require('../utils/auth');

// our controllers that will be used for mutations and queries by front end fetch request using React
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if(context.user) {
        // find a user by id
        const userdata = await User.findOne({ _id: context.user._id})
        // after we grab the user we select all data except the password and version
        .select('-__v -password')
        .populate('savedBooks')

        // send userdata if the fetch request is authorized
        return userdata
      }
      // if request is not successful then throw an error
      throw new AuthenticationError('Not logged in')
    }
  },
  //we can use four mutations to create a user, login, save a book, and remove a book
  //these are our controllers
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args)
      const token = signToken(user)

      //create a user using the args param and return it to the client
      return { token, user }
    },
    login: async (parent, { email, password }) => {
      //find a user by the email passed in the fetch
      const user = await User.findOne({ email })
      if (!user) {
        throw new AuthenticationError('Incorrect Email')
      }
      //find password by the password passed in the fetch
      const correctPassword = await user.isCorrectPassword(password)
      if(!correctPassword) {
        throw new AuthenticationError('Incorrect Password')
      }
      
      const token = signToken(user)
      //return both the client for login if successful
      return { token, user }
    }, 
    saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
      if(context.user) {
        // push a new book with the data passed from the fetch
        const mutatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: { bookId, authors, description, title, image, link }}},
          { new: true, runValidators: true }
        )
        // return the new book to the client
        return mutatedUser;
      }
      throw new AuthenticationError('Error saving the book')
    },
    removeBook: async (parent, { bookId }, context) => {
      // pull a book from users collection using the id of the book passed in
      if(context.user) {
        const mutatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId }}},
          { new: true }
        )
        return mutatedUser
      }
      throw new AuthenticationError('Not logged in')
    }
  }
}

module.exports = resolvers;

