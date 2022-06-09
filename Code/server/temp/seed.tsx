import "dotenv/config"

import { ObjectId } from "mongodb"
import { connectDatabase } from "../src/database"
import { Listing } from "../src/lib/types"
const seed = async () => {
  try {
    console.log("loading")

    const db = await connectDatabase()
    const listings: Listing[] = [
      {
        _id: new ObjectId(),
        title: "Single bedroom located in the heart of downtown Tirana",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Skanderbeg_square_tirana_2016.jpg/1200px-Skanderbeg_square_tirana_2016.jpg",
        address: "DonBosko, California",
        price: 25000,
        numOfGuests: 3,
        numOfBeds: 2,
        numOfBaths: 2,
        rating: 3,
      },
    ]
    for (const listing of listings) {
      await db.listings.insertOne(listing)
    }
    console.log("success ")
  } catch {
    throw new Error("failed to add seed")
  }
}
seed()
