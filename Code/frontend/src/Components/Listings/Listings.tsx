import { server } from "../../lib/api"
import React from "react"
import {
  DeleteListingVariables,
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
  const fetchListings = async () => {
    const { data } = await server.fetch<ListingsData>({ query: LISTINGS })
    console.log("listings", data)
  }

  const deleteListing = async () => {
    const { data } = await server.fetch<
      DeleteListingData,
      DeleteListingVariables
    >({
      query: DELETE_LISTING,
      variables: {
        id: "",
      },
    })
    console.log(data)
  }
  return (
    <>
      <div>
        <button onClick={fetchListings}>Fetch</button>
      </div>
      <div>
        <button onClick={deleteListing}>Delete</button>
      </div>
    </>
  )
}
