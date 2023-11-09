const typeDefs = `
  input userInput {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [bookInput]!
  }

  input bookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]!
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me(input: userInput!): User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(input: bookInput!): User
    removeBook(input: bookInput!): User
  }
`;

module.exports = typeDefs;
