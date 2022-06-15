import React, { useState } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import ReactDOM from "react-dom/client"
import { Viewer } from "./lib/types"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout, Affix } from "antd"
import {
  Listings,
  Home,
  Host,
  Listing,
  NotFound,
  User,
  Login,
  AppHeader,
} from "./Components"
import "./style/index.css"

const client = new ApolloClient({
  uri: "/api",
  cache: new InMemoryCache(),
})

const initialViewer: Viewer = {
  id: null,
  token: null,
  avatar: null,
  hasConnectedWallet: null,
  didRequest: false,
}

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer)

  return (
    <Router>
      <Layout id="app">
        {/* fix position */}
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/host" element={<Host />} />
          <Route path="/user/id" element={<User />} />
          {/* Property Information */}
          <Route path="/listing/:id" element={<Listing />} />

          <Route path="/login" element={<Login setViewer={setViewer} />} />
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
