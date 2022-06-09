import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type Listing {
    id: ID!
    title: String!
    address: String!
    image: String!
    price: Int!
    numOfGuests: Int!
    numOfBaths: Int!
    numOfBeds: Int!
    rating: Int!
  }

  type Query {
    listings: [Listing!]!
  }

  type Mutation {
    deleteListing(id: ID!): Listing!
  }
`
