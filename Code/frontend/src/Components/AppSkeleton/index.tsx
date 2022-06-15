import React from "react"
import { Layout, Typography } from "antd"

const { Header } = Layout
const { Title } = Typography

export function AppHeaderSkeleton() {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Title level={4}> Grand Real Estate</Title>
        </div>
      </div>
    </Header>
  )
}
