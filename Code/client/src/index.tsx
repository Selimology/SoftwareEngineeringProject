import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    ApolloClient,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
    useMutation,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Affix, Layout, Spin } from "antd";
import {
    AppHeader,
    Home,
    Host,
    Listing,
    Listings,
    Login,
    NotFound,
    User,
} from "./sections";
import { LOG_IN } from "./lib/graphql/mutations/LogIn";
import {
    LogIn as LogInData,
    LogInVariables,
} from "./lib/graphql/mutations/LogIn/__generated__/LogIn";
import { Viewer } from "./lib/types";
import "./styles/index.css";
import { AppHeaderSkeleton } from "./lib/components/AppHeaderSkeleton";
import { ErrorBanner } from "./lib/components/ErrorBanner";

const httpLink = createHttpLink({
    uri: "/api",
});

const authLink = setContext((_, { headers }) => {
    const token = sessionStorage.getItem("token");
    return {
        headers: {
            ...headers,
            "X-CSRF-TOKEN": token || "",
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

const initialViewer: Viewer = {
    id: null,
    token: null,
    avatar: null,
    hasWallet: null,
    didRequest: false,
};

function App() {
    const [viewer, setViewer] = useState<Viewer>(initialViewer);
    const [logIn, { error }] = useMutation<LogInData, LogInVariables>(LOG_IN, {
        onCompleted: (data) => {
            if (data && data.logIn) {
                setViewer(data.logIn);
                if (data.logIn.token) {
                    sessionStorage.setItem("token", data.logIn.token);
                }
            } else {
                sessionStorage.removeItem("token");
            }
        },
    });
    const logInRef = useRef(logIn);
    useEffect(() => {
        logInRef.current();
    }, []);

    if (!viewer.didRequest && !error) {
        return (
            <Layout className="app-skeleton">
                <AppHeaderSkeleton />
                <div className="app-skeleton__spin-section">
                    <Spin size="large" tip="Launching Grand Real Estate" />
                </div>
            </Layout>
        );
    }

    const logInErrorBannerElement = error ? (
        <ErrorBanner description="We weren't able to verify if you were logged in. Please try again later!" />
    ) : null;
    return (
        <BrowserRouter>
            <Layout id="app">
                {logInErrorBannerElement}
                <Affix offsetTop={0} className="app__affix-header">
                    <AppHeader viewer={viewer} setViewer={setViewer} />
                </Affix>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/host" element={<Host />} />
                    <Route path="/listing/:listingId" element={<Listing />} />
                    <Route
                        path="/listings"
                        element={
                            <Listings title="Grand Real Estate Listings" />
                        }
                    >
                        <Route
                            path="/listings/:location"
                            element={
                                <Listings title="Grand Real Estate Listings" />
                            }
                        />
                    </Route>
                    <Route
                        path="/login"
                        element={<Login setViewer={setViewer} />}
                    />
                    <Route
                        path="/user/:userId"
                        element={<User viewer={viewer} />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

render(
    <>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </>,
    document.getElementById("root")
);
