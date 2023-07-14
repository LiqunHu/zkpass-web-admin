import React from 'react'
import { Layout } from 'antd'
import { useLocation, Outlet } from 'react-router-dom'
import VHeader from './compontents/Header'
import VSidebar from './compontents/Sidebar'
import VTags from './compontents/Tags'
import { getCurrentRouter } from '@/routers'

const { Header, Sider, Content } = Layout
function PublicLayout() {
  const location = useLocation()
  let router = getCurrentRouter(location.pathname)

  return (
    <Layout className="layout">
      <Header style={{ position: 'relative', boxSizing: 'border-box', padding: '0px', backgroundColor: '#242f42', height: '60px', lineHeight: '60px' }}>
        <VHeader />
      </Header>
      <Layout>
        <Sider>
          <VSidebar />
        </Sider>
        <Content className="content">
          <VTags />
          <div className="panel">
            <div className="panel-heading">
              <h4 className="panel-title">{router.title}</h4>
            </div>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default React.memo(PublicLayout)
