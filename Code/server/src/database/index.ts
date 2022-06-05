import { MongoClient } from "mongodb"

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`

export const connectDatabase = async () => {
  const client = new MongoClient(url)
  await client.connect()
  const db = client.db("main")

  return {
    listings: db.collection("test-listings"),
  }
}
