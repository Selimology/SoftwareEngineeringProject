import { MongoClient } from "mongodb"
import { Booking, Listing, User } from "../lib/types"

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`

export const connectDatabase = async () => {
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db("main")

  return {
    //"listings", "users" are collections. We access them through db.collection("name")
    listings: db.collection<Listing>("listings"),
    //using generics we ensure returned type is of type User
    users: db.collection<User>("users"),
    bookings: db.collection<Booking>("bookings"),
  }
}
