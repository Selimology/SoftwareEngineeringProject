import React from "react"
import { Viewer } from "../../lib/types"
import { Layout, Typography } from "antd"
import { NavLink } from "react-router-dom"
import { MenuItems } from "./Components"

interface AppHeaderProps {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

const { Header } = Layout
const { Title } = Typography

export function AppHeader({ viewer, setViewer }: AppHeaderProps) {
  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <NavLink to="/">
            <Title level={4}>Grand Real Estate</Title>
          </NavLink>
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  )
}
