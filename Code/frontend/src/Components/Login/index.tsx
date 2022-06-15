import React, { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Viewer } from "../../lib/types"
import { Card, Layout, Spin, Typography } from "antd"
import googleLogo from "./assets/google_logo.jpg"
import { LOG_IN } from "../../lib/graphql/mutations"
import { ErrorBanner } from "../../lib/components"
import {
  displayErrorMessage,
  displaySuccessNotification,
} from "../../lib/utils"
import {
  LogIn as LogInData,
  LogInVariables,
} from "../../lib/graphql/mutations/LogIn/__generated__/LogIn"
import { useApolloClient, useMutation } from "@apollo/client"
import { AUTH_URL } from "../../lib/graphql/queries/AuthUrl"
import { AuthUrl as AuthUrlData } from "../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl"

const { Text, Title } = Typography
const { Content } = Layout

interface Props {
  setViewer: (viewer: Viewer) => void
}

export const Login = ({ setViewer }: Props) => {
  const client = useApolloClient()
  const navigate = useNavigate()
  const [logIn, { loading: logInLoading, error: loginError }] = useMutation<
    LogInData,
    LogInVariables
  >(LOG_IN, {
    onCompleted: (data) => {
      if (data && data.logIn && data.logIn.token) {
        setViewer(data.logIn)
        sessionStorage.setItem("token", data.logIn.token)
        displaySuccessNotification("You've successfully logged in!")
        const { id: viewerId } = data.logIn
        //after successfully login, redirect to user page, rather than login page
        navigate(`/user/${viewerId}`)
      }
    },
  })

  const logInRef = useRef(logIn)

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code")
    if (code) {
      logInRef.current({
        variables: {
          input: { code },
        },
      })
    }
  }, [])

  const handleAuthorize = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({
        query: AUTH_URL,
      })
      if (data) {
        //redirect to the google auth url page
        window.location.href = data.authUrl
      }
    } catch {
      displayErrorMessage(
        "Sorry! We weren't able to log you in. Please try again later!"
      )
    }
  }

  if (logInLoading) {
    return (
      <Content className="log-in">
        <Spin size="large" tip="Logging you in..." />
      </Content>
    )
  }

  const logInErrorBanner = loginError ? (
    <ErrorBanner description="Sorry! We weren't able to log you in. Please try again later!" />
  ) : null
  return (
    <>
      <Content className="log-in">
        {logInErrorBanner}
        <Card className="log-in-card">
          <div className="log-in-car__intro">
            <Title className="log-in-card__intro-title" level={2}>
              Log In
            </Title>
            <Text> Sign in with Google</Text>
          </div>
          <button
            className="log-in-card__google-button"
            onClick={handleAuthorize}
          >
            <img
              src={googleLogo}
              className="log-in-card__google-button-logo"
              alt="google logo"
            />
            <span className="log-in-card__google-button-text">
              Sign in with GOogle
            </span>
          </button>
        </Card>
      </Content>
    </>
  )
}
