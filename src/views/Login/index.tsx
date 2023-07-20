import './style.css'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import request from '@/utils/request'
import common from '@/utils/common'
import { login } from '@/store/dashboardSlice'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loginForm] = Form.useForm()

  const onLogin = async (values: any) => {
    try {
      const identify_code = await common.aesEncryptModeCBC(values.username, values.password)

      const response = await request.post('/v1/api/auth/signin', {
        username: values.username,
        identify_code: identify_code,
        login_type: 'ADMIN',
      })
      const userInfo = response.data.info
      if (userInfo.Authorization) {
        if (!userInfo.avatar) {
          userInfo.avatar = '/static/images/base/head.jpg'
        }
        await dispatch(login(userInfo))
        navigate('/dashboard/home')
      } else {
        console.log('no Authorization')
      }

      console.log('submit')
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="login-wrap">
      <div className="ms-login">
        <div className="ms-title">zkPass</div>
        <Form form={loginForm} name="loginForm" className="ms-content" onFinish={onLogin}>
          <Form.Item name="username" rules={[{ required: true, message: 'please enter username!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="username" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'please enter password!' }]}>
            <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="password" />
          </Form.Item>
          <Form.Item className="login-btn">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
