import React from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import ReactDOM from "react-dom/client"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "antd"
import {
  Listings,
  Home,
  Host,
  Listing,
  NotFound,
  User,
  Login,
} from "./Components"
import "./style/index.css"

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
})

const App = () => {
  return (
    <Router>
      <Layout id="app">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/host" element={<Host />} />
          <Route path="/user/id" element={<User />} />
          {/* Property Information */}
          <Route path="/listing/:id" element={<Listing />} />

          <Route path="/login" element={<Login />} />
          {/* All the Properties */}
          <Route path="/listings/location?" element={<Listings />} />
          {/* 404 NOT FOUND */}
          <Route element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
