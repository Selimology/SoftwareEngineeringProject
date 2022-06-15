import { gql } from "apollo-server-express"

export const typeDefs = gql`
  type Bookings {
    total: Int!
    result: [Booking!]!
  }

  type Listings {
    total: Int!
    result: [Listing!]!
  }

  type User {
    id: ID!
    name: String!
    avatar: String!
    contact: String!
    hasConnectedWallet: Boolean!
    income: Int
    bookings(limit: Int!, page: Int!): Bookings
    listings(limit: Int!, page: Int!): Listings!
  }

  type Listing {
    id: ID!
    title: String!
    description: String!
    image: String!
    host: User!
    type: ListingType!
    address: String!
    city: String!
    bookings(limit: Int!, page: Int!): Bookings
    bookingsIndex: String!
    price: Int!
    numOfGuests: Int!
  }

  enum ListingsFilter {
    PRICE_LOW_TO_HIGH
    PRICE_HIGH_TO_LOW
  }

  enum ListingType {
    APARTMENT
    HOUSE
    ROOM
  }

  type Booking {
    id: ID!
    listing: Listing!
    tenant: User!
    checkIn: String!
    checkOut: String!
  }

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
