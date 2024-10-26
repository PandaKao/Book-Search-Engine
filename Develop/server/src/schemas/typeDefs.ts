const gql = String.raw;

const typeDefs = gql `
    type User {
        _id: ID
        username: String!
        email: String!
        password: String!
        savedBooks: [Book]
        bookCount: Int
        }

    type Book {
        bookId: String!
        title: String!
        authors: [String]
        description: String!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }

    input UserInput {
        username: String!
        email: String!
        password: String!
    }

    type Query {
        me: User
        searchBooks(searchTerm: String!): [Book]
    }

    type Mutation {
        signup(input: UserInput!): Auth
        login(email: String!, password: String!): Auth

        saveBook(bookId: String!): User
        removeBook(bookId: String!): User
    }
`;

export default typeDefs;