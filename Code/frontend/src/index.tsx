import React from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Listings, Home, Host, Listing, NotFound, User } from "./Components"
import "./style/index.css"

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
})

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/host" element={<Host />} />
        <Route path="/user/id" element={<User />} />
        {/* Property Information */}
        <Route path="/listing/:id" element={<Listing />} />
        {/* All the Properties */}
        <Route path="/listings/location?" element={<Listings />} />
        {/* 404 NOT FOUND */}
        <Route element={<NotFound />} />
      </Routes>
    </Router>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
