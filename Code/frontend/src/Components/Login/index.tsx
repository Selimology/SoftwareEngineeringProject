import React from "react"
import { Card, Layout, Typography } from "antd"
import googleLogo from "./assets/google_logo.jpg"

const { Text, Title } = Typography
const { Content } = Layout

export const Login = () => {
  return (
    <>
      <Content className="log-in">
        <Card className="log-in-card">
          <div className="log-in-car__intro">
            <Title className="log-in-card__intro-title" level={2}>
              Log In
            </Title>
            <Text> Sign in with Google</Text>
          </div>
          <button className="log-in-card__google-button">
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
