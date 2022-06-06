import { server, useQuery } from "../../lib/api"
import React from "react"
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
  const { data, loading, refetch, error } = useQuery<ListingsData>(LISTINGS)

  const deleteListing = async (id: string) => {
    await server.fetch<DeleteListingData, DeleteListingVariables>({
      query: DELETE_LISTING,
      variables: {
        id,
      },
    })
    refetch()
  }

  const listings = data ? data.listings : null

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

  if (error) {
    return <div>Something went wrong</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h1>{title}</h1>
      {listingList}
    </>
  )
}
