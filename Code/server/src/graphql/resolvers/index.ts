import merge from "lodash.merge"
import { userResolvers } from "./User"
import { viewerResolvers } from "./Viewer"
import { listingResolvers } from "./Listing"
import { bookingsResolver } from "./Bookings"

export const resolvers = merge(
  bookingsResolver,
  listingResolvers,
  viewerResolvers,
  userResolvers
)
