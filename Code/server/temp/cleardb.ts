import "dotenv/config"

import { connectDatabase } from "../src/database"

const cleardb = async () => {
  try {
    console.log("loading")

    const db = await connectDatabase()

    //.find({}) is a mongoDB method that returns all the documents in the collection
    const bookings = await db.bookings.find({}).toArray()
    const users = await db.users.find({}).toArray()
    const listings = await db.listings.find({}).toArray()

    //if they have at least one booking, they will be deleted
    if (bookings.length > 0) {
      await db.bookings.drop()
    }

    //if they have at least one user, they will be deleted
    if (users.length > 0) {
      await db.users.drop()
    }

    //if they have at least one listing, they will be deleted
    if (listings.length > 0) {
      await db.listings.drop()
    }

    console.log("database cleared successfully ")
  } catch {
    throw new Error("failed to clear database")
  }
}

cleardb()
