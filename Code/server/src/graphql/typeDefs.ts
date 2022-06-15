import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type Viewer {
    id: ID
    token: String
    avatar: String
    hasConnectedWallet: Boolean
    #obtain users information from google
    didRequest: Boolean!
  }

  type Query {
    authUrl: String!
    user(id: ID!): User!
    listing(id: ID!): Listing!
    listings(filter: ListingsFilter!, limit: Int!, page: Int!): Listings!
  }

  input LogInInput {
    code: String!
  }
  type Mutation {
    # to accept argument we use input type. Return a Viewer
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`
