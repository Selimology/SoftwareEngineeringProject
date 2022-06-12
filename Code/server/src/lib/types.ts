import { Collection, ObjectId } from "mongodb"

export interface Listing {
  _id: ObjectId
}

export interface User {
  //it will be authenticated by a 3rdparty which will return an id token in string format
  _id: string
  //store logging session
  token: string
  name: string
  picture: string
  //email
  contact: string
  //walletID if undefined, it means they didn't link to a wallet yet
  walletId?: string
  income: number
  //one to many relationship - one user will hold references to many bookings
  bookings: ObjectId[]
  //one to many relationship - one user will hold references to many listings
  listings: ObjectId[]
}
export interface Booking {
  _id: ObjectId
}

export interface Database {
  listings: Collection<Listing>
  users: Collection<User>
  bookings: Collection<Booking>
}
