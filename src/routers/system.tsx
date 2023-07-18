import { lazy, Suspense } from 'react'
import LayoutPage from '@/layout'
const SystemApiControl = lazy(
  () => import('@/views/System/Auth/SystemApiControl')
)
const GroupControl = lazy(() => import('@/views/System/Auth/GroupControl'))

const load = (children: JSX.Element) => {
  return <Suspense fallback="">{children}</Suspense>
}

const admin = [
  {
    path: '/system',
    element: <LayoutPage />,
    children: [
      {
        path: 'auth/SystemApiControl',
        element: load(<SystemApiControl />),
        meta: {
          title: '系统菜单维护'
        }
      },
      {
        path: 'auth/GroupControl',
        element: load(<GroupControl />),
        meta: {
          title: '角色组维护'
        }
      }
    ]
  }
]

export default admin
