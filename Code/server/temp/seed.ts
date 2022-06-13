import "dotenv/config"

import { ObjectId } from "mongodb"
import { connectDatabase } from "../src/database"
import { Listing, ListingType, User } from "../src/lib/types"

const listings: Listing[] = [
  {
    _id: new ObjectId("5d378db94e84753160e08b30"),
    title: "Single bedroom located in the heart of downtown Tirana",
    description:
      " Single bedroom located in the heart of downtown Tirana, really close to the Mosque and the square. Sovengerous neighborhood and great for a group of friends.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Skanderbeg_square_tirana_2016.jpg/1200px-Skanderbeg_square_tirana_2016.jpg",
    host: "5f3e8f8f8f9e8b0f8f8f8f8f",
    type: ListingType.Apartment,
    address: "Qender, Tirana",
    country: "Albania",
    admin: "Tirana",
    city: "Tirana",
    bookings: [],
    bookingsIndex: {},
    numberOfGuests: 2,
    price: 13000,
  },
  {
    _id: new ObjectId("5d378db94e84753160e08b31"),
    title: "Two bedroom villa close to the center of Tirana",
    description:
      " Two bedroom villa close to the center of Tirana, really close to the Blloku and has a great view of the square. Great for couples.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Skanderbeg_square_tirana_2016.jpg/1200px-Skanderbeg_square_tirana_2016.jpg",
    host: "5f3e8f8f8f9e8b0f8f8f8f8f",
    type: ListingType.House,
    address: "Qender, Tirana",
    country: "Albania",
    admin: "Tirana",
    city: "Tirana",
    bookings: [],
    bookingsIndex: {},
    numberOfGuests: 2,
    price: 33000,
  },
]
const users: User[] = [
  {
    _id: "5f3e8f8f8f9e8b0f8f8f8f8f",
    token: "token_************",
    name: "Kamil Ertekin",
    avatar:
      "https://www.mensjournal.com/wp-content/uploads/mf/low_body_fat_muscular_muscle_abs_chest_main.jpg?w=1188&h=675&crop=1&quality=86&strip=all",
    contact: "kertekin2018@gmail.com",
    walletId: "acct_************",
    income: 23000,
    bookings: [],
    listings: [
      new ObjectId("5d378db94e84753160e08b30"),
      new ObjectId("5d378db94e84753160e08b31"),
    ],
  },
]

const seed = async () => {
  try {
    console.log("loading")

    const db = await connectDatabase()

    //insertOne is a mongoDB method that inserts one document into the collection
    for (const listing of listings) {
      await db.listings.insertOne(listing)
    }

    for (const user of users) {
      await db.users.insertOne(user)
    }

    console.log("success ")
  } catch {
    throw new Error("failed to add seed")
  }
}

seed()
