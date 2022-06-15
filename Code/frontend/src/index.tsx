import React, { useState, useEffect, useRef } from "react"
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
  useMutation,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import ReactDOM from "react-dom/client"
import { Viewer } from "./lib/types"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout, Affix, Spin } from "antd"
import { LOG_IN } from "./lib/graphql/mutations"
import {
  LogIn as LogInData,
  LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn"
import { ErrorBanner } from "./lib/components"
import {
  Listings,
  Home,
  Host,
  Listing,
  NotFound,
  User,
  Login,
  AppHeader,
  AppHeaderSkeleton,
} from "./Components"

import "./style/index.css"

const httpLink = createHttpLink({
  uri: "/api",
})

const authLink = setContext((_, { headers }) => {
  const token = sessionStorage.getItem("token")
  return {
    headers: {
      ...headers,
      "X-CSRF-TOKEN": token || "",
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
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

  const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn) {
        setViewer(data.logIn)
        if (data.logIn.token) {
          sessionStorage.setItem("token", data.logIn.token)
        }
      } else {
        sessionStorage.removeItem("token")
      }
    },
  })

  const logInRef = useRef(logIn)
  useEffect(() => {
    logInRef.current()
  }, [])

  if (!viewer.didRequest && !error) {
    return (
      <Layout className="app-skeleton">
        <AppHeaderSkeleton />
        <div className="app-skeleton__spin-section">
          <Spin size="large" tip="Launching TinyHouse" />
        </div>
      </Layout>
    )
  }

  const logInErrorBannerElement = error ? (
    <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
  ) : null

  return (
    <Router>
      <Layout id="app">
        {logInErrorBannerElement}
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
