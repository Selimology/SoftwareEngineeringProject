import React from "react"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client"
import ReactDOM from "react-dom/client"
import Listings from "./Components/Listings"

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
})

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <ApolloProvider client={client}>
    <Listings title="real estate management system" />
  </ApolloProvider>
)
