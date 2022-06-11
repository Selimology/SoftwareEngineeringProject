import React from "react"
import { Skeleton, Divider, Alert } from "antd"
import "../../style/ListingsSkeleton.css"

interface Props {
  title: String
  error?: boolean
}

export const ListingsSkeleton = ({ title, error = false }: Props) => {
  const errorAlert = error ? (
    <Alert
      type="error"
      message="Something went wrong"
      className="listings-skeleton__alert"
    />
  ) : null
  return (
    <>
      <div className="listings-skeleton">
        {errorAlert}
        <h2>{title}</h2>
        {/* https://ant.design/components/skeleton/ */}
        <Skeleton active paragraph={{ rows: 1 }} />
        <Divider />
        <Skeleton active paragraph={{ rows: 1 }} />
        <Divider />
        <Skeleton active paragraph={{ rows: 1 }} />
      </div>
    </>
  )
}
