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
        address: "Qender, Tirana",
        price: 25000,
        numOfGuests: 3,
        numOfBeds: 2,
        numOfBaths: 2,
        rating: 3,
      },
      {
        _id: new ObjectId(),
        title: "Two bedroom villa close to the center of Tirana",
        image:
          "https://q-xx.bstatic.com/xdata/images/hotel/840x460/89634025.jpg?k=41cfb0b56f6eebc7e4872d67d855f06bf0f901672413fac661cff80e81d25b34&o=",
        address: "Toptani, Tirana",
        price: 45000,
        numOfGuests: 2,
        numOfBeds: 2,
        numOfBaths: 3,
        rating: 5,
      },
      {
        _id: new ObjectId(),
        title: "Luxury Apartment closed to Blloku",
        image:
          "https://q-xx.bstatic.com/xdata/images/hotel/840x460/175389360.jpg?k=f8f39ac8de2229fb701dba12100cb864d753d5791a0b583b97d64665b05f0eb1&o=",
        address: "Blloku, Tirana",
        price: 45000,
        numOfGuests: 2,
        numOfBeds: 2,
        numOfBaths: 3,
        rating: 5,
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
