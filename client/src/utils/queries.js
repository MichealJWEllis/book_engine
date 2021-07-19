// make graphQL queries by importing graphQL
import { gql } from '@apollo/client';

//export our query for use by App.js
export const GET_ME = gql `
  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        title
        description
        authors
        image
        link
      }
    }
  }
`


