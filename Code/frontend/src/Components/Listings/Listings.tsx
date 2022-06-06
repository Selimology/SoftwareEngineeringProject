import { server } from "../../lib/api"
import React, { useState, useEffect } from "react"
import {
  DeleteListingVariables,
  Listing,
  DeleteListingData,
  ListingsData,
} from "./types"

const DELETE_LISTING = `
mutation DeleteListing($id:ID!){
  deleteListing(id: $id){
    id
  }
}
`

const LISTINGS = `
query Listings{
  listings {
    id
    title
    image
    address
    price
    numOfGuests
    numOfBeds
    numOfBaths
    rating

}
}
  
`

interface Props {
  title: string
}

export const Listings = ({ title }: Props) => {
  const [listings, setListings] = useState<Listing[] | null>(null)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS })
    setListings(data.listings)
  }

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id,
      },
    })
    fetchListings()
  }

  const listingList = listings ? (
    <ul>
      {listings.map((listing) => {
        return (
          <li key={listing.id}>
            {listing.title}
            <button onClick={() => deleteListing(listing.id)}>Delete</button>
          </li>
        )
      })}
    </ul>
  ) : null

  return (
    <>
      <h1>{title}</h1>
      {listingList}
    </>
  )
}
