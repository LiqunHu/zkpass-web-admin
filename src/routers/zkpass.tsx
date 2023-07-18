import { lazy, Suspense } from 'react'
import LayoutPage from '@/layout'
const TaskManage = lazy(() => import('@/views/zkpass/TaskManage'))
const SubmitApiManage = lazy(() => import('@/views/zkpass/SubmitApiManage'))
// const ResourcePool = lazy(() => import('@/views/ResourcePool'))

const load = (children: JSX.Element) => {
  return <Suspense fallback="">{children}</Suspense>
}

const demand = [
  {
    path: '/zkpass',
    element: <LayoutPage />,
    children: [
      {
        path: 'TaskManage',
        element: load(<TaskManage />),
        meta: {
          title: '需求管理'
        }
      },
      {
        path: 'SubmitApiManage',
        element: load(<SubmitApiManage />),
        meta: {
          title: '提交审核管理'
        }
      }
    ]
  }
]

export default demand
