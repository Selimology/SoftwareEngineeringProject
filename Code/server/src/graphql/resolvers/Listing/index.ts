import { IResolvers } from "@graphql-tools/utils"
import { Database, Listing } from "../../../lib/types"
import { ObjectId } from "mongodb"

export const listingResolvers: IResolvers = {
  Query: {
    listings: async (
      _root: undefined,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray()
    },
  },

  Mutation: {
    deleteListing: async (
      _root: undefined,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      const deleteResult = await db.listings.findOneAndDelete({
        _id: new ObjectId(id),
      })
      if (!deleteResult.value) {
        throw new Error("Failed to delete listing")
      }
      return deleteResult.value
    },
  },

  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
    title: (listing: Listing) => listing.title,
    image: (listing: Listing) => listing.image,
    address: (listing: Listing) => listing.address,
    price: (listing: Listing) => listing.price,
    numOfGuests: (listing: Listing) => listing.numOfGuests,
    numOfBeds: (listing: Listing) => listing.numOfBeds,
    numOfBaths: (listing: Listing) => listing.numOfBaths,
    rating: (listing: Listing) => listing.rating,
  },
}
