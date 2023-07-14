import { lazy, Suspense } from 'react'
import LayoutPage from '@/layout'
const Home = lazy(() => import('@/views/Home'))

const load = (children: JSX.Element) => {
  return <Suspense fallback="">{children}</Suspense>
}

const dashboard = [
  {
    path: '/dashboard',
    element: <LayoutPage />,
    children: [
      {
        path: 'home',
        element: load(<Home />),
        meta: {
          title: '首页',
        },
      },
    ],
  },
]

export default dashboard
