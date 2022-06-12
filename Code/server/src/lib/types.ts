import { Collection, ObjectId } from "mongodb"

export enum ListingType {
  Apartment = "APARTMENT",
  House = "HOUSE",
  Room = "ROOM",
}

export interface BookingsIndexMonth {
  [key: string]: boolean
}

/* 
object of objects which are boolean
January - 0 is December - 11
below is 2022-January-01

ex:
"2022":{
  "00":{
    "01":true
  }
}
*/

//represents a single object of for a single year.
export interface BookingsIndexYear {
  [key: string]: BookingsIndexMonth
}

/* represent different objects for different years. Which each year object, will have different objects for months. Each month object will have boolean values for each day.  */
export interface BookingsIndex {
  [key: string]: BookingsIndexYear
}
export interface Listing {
  _id: ObjectId
  title: string
  description: string
  image: string
  //one to one relationship with user, host has _id of user. That is why it is string
  host: string
  //type of listing, apartment, house, room
  type: ListingType
  address: string
  country: string
  admin: string
  city: string
  bookings: ObjectId[]
  //to prevent someone from booking already booked listing
  bookingsIndex: BookingsIndexYear
  numberOfGuests: number
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
  //one to one relationship
  listing: ObjectId
  //one to one relationship, user ID that will return is string
  tenant: string
  checkInDate: string
  checkOutDate: string
}

export interface Database {
  listings: Collection<Listing>
  users: Collection<User>
  bookings: Collection<Booking>
}
