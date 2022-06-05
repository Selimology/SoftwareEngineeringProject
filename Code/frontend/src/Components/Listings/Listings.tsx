import { server } from "../../lib/api"
import React from "react"

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
    const { data } = await server.fetch({ query: LISTINGS })
    console.log("listings", data)
  }
  return (
    <>
      <div>
        <button onClick={fetchListings}>Click me</button>
      </div>
    </>
  )
}
