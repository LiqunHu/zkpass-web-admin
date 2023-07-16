// import React from 'react'
import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
// import { Spin } from 'antd'
import Home from '@/views/Home'
// import Login from '@/views/Login'
// import Board from '@/views/Board'
import Nomatch from '@/views/Nomatch'
import system from './system'
import dashboard from './dashboard'
const Login = lazy(() => import('@/views/Login'))

const load = (children: JSX.Element) => {
  return <Suspense fallback="">{children}</Suspense>
}

const routeMap = new Map()

const routeList = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: load(<Login />),
    meta: {
      title: '登陆页',
    },
  },
  ...system,
  ...dashboard,
  {
    path: '*',
    element: <Nomatch />,
    meta: {
      title: '404'
    }
  }
]

const RenderRouter = () => {
  const element = useRoutes(routeList)
  return element
}

const router2map = (rList: any, pUrl: string) => {
  rList.forEach((item: any) => {
    let url = ''
    if (pUrl.endsWith('/') || pUrl.length === 0) {
      url = pUrl + item.path
    } else {
      url = pUrl + '/' + item.path
    }
    if (item.children) {
      router2map(item.children, url)
    } else {
      routeMap.set(`${url}`, item.meta || {})
    }
  })
}

router2map(routeList, '')

export const getCurrentRouter = (currentPath: string) => {
  let item = routeMap.get(currentPath)
  if (item) {
    return item
  } else {
    return null
  }
}

export const routers = routeList
export default RenderRouter
