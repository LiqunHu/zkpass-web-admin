import { lazy, Suspense } from 'react'
import LayoutPage from '@/layout'
const SystemApiControl = lazy(
  () => import('@/views/System/Auth/SystemApiControl')
)
const GroupControl = lazy(() => import('@/views/System/Auth/GroupControl'))

const OperatorControl = lazy(
  () => import('@/views/System/Auth/OperatorControl')
)

const ResetPassword = lazy(
  () => import('@/views/System/Auth/ResetPassword')
)

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
      },
      {
        path: 'auth/OperatorControl',
        element: load(<OperatorControl />),
        meta: {
          title: '用户维护'
        }
      },
      {
        path: 'auth/ResetPassword',
        element: load(<ResetPassword />),
        meta: {
          title: '重制密码'
        }
      }
    ]
  }
]

export default admin
