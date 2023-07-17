import { lazy, Suspense } from 'react'
import LayoutPage from '@/layout'
const DemandManagement = lazy(() => import('@/views/DemandManagement'))
const AuditsManagement = lazy(() => import('@/views/AuditsManagement'))
const ResourcePool = lazy(() => import('@/views/ResourcePool'))

const load = (children: JSX.Element) => {
  return <Suspense fallback="">{children}</Suspense>
}

const demand = [
  {
    path: '/home',
    element: <LayoutPage />,
    children: [
      {
        path: 'demand',
        element: load(<DemandManagement />),
        meta: {
          title: '需求管理',
        },
      },
      {
        path: 'audits',
        element: load(<AuditsManagement />),
        meta: {
          title: '审核管理',
        },
      },
      {
        path: 'resource',
        element: load(<ResourcePool />),
        meta: {
          title: '资源池',
        },
      },
    ],
  },
]

export default demand
