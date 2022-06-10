import { useMutation, useQuery, gql } from "@apollo/client"
import React from "react"
import { Listings as ListingsComponent } from "./Listings"
import {
  DeleteListingVariables,
  DeleteListingData,
  ListingsData,
} from "./types"

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`

const LISTINGS = gql`
  query Listings {
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

  /* renaming loading and error since useQuery already has them.
  data is not needed since we aren't presenting the deleted listing.
   */
  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING)

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } })
    refetch()
  }

  //if deletion is in progress, show this message
  const deleteLoadingListingMessage = deleteListingLoading ? (
    <div>
      <p>Deleting...</p>
    </div>
  ) : null

  //if deletion has an error, show this message
  const deleteErrorListingMessage = deleteListingError ? (
    <div>
      <p>Error deleting listing</p>
    </div>
  ) : null

  const listings = data ? data.listings : null

  const listingsList = listings ? (
    <ul>
      {listings.map((listing) => {
        return (
          <li key={listing.id}>
            {listing.title}
            <button onClick={() => handleDeleteListing(listing.id)}>
              Delete
            </button>
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
      {listingsList}
      {/*
      Since we are keeping mutation and query functions seperately,
      only the deleted listing will give an error and previous listings
      will not.
      */}
      {deleteLoadingListingMessage}
      {deleteErrorListingMessage}
    </>
  )
}
