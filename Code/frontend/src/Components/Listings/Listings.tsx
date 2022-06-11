import "../../style/Listings.css"
import React from "react"

import { useMutation, useQuery, gql } from "@apollo/client"
import { Alert, List, Avatar, Button, Spin } from "antd"
import { ListingsSkeleton } from "../ListingsSkeleton"
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from "./__generated__/DeleteListing"

import { Listings as ListingsData } from "./__generated__/Listings"

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

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
      type="error"
      message="Something went wrong with deleting"
      className="listings__alert"
    />
  ) : null

  const listings = data ? data.listings : null

  const listingsList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={64} />}
          />
        </List.Item>
      )}
    />
  ) : null

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    )
  }

  return (
    <>
      <div className="listings">
        <Spin spinning={deleteListingLoading}>
          {deleteListingErrorAlert}
          <h1>{title}</h1>
          {listingsList}
          {/*
      Since we are keeping mutation and query functions seperately,
      only the deleted listing will give an error and previous listings
      will not.
      */}
        </Spin>
      </div>
    </>
  )
}
