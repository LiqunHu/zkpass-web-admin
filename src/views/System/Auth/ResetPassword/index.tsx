import s from './style.module.css'
import request from '@/utils/request'
import { Button, Input, Popconfirm } from 'antd'
import { useState } from 'react'
import common from '@/utils/common'

const { Search } = Input
const apiUrl = '/v1/api/system/auth/ResetPassword/'

function ResetPassword() {
  const [searchText, setSearchText] = useState('')
  const [user, setUser] = useState({
    user_id: '',
    user_username: '',
    user_name: '',
    user_phone: '',
    user_email: '',
    user_account: '',
    user_remark: '',
    version: 0,
    updated_at: 0
  })

  const getUserData = async () => {
    try {
      let response = await request.post(apiUrl + 'search', {
        search_text: searchText
      })
      setUser(response.data.info)
    } catch (error) {
      common.fault(error)
    }
  }

  const resetPassword = async () => {
    try {
      await request.post(apiUrl + 'reset', {
        user_id: user.user_id,
        version: user.version,
        updated_at: user.updated_at
      })
      setUser({
        user_id: '',
        user_username: '',
        user_name: '',
        user_phone: '',
        user_email: '',
        user_account: '',
        user_remark: '',
        version: 0,
        updated_at: 0
      })
      common.success('重置成功')
    } catch (error) {
      common.fault(error)
    }
  }

  return (
    <div>
      <div className="panel-toolbar">
        <Search
          placeholder="用户名、手机、姓名"
          value={searchText}
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          enterButton
          onSearch={getUserData}
        />
      </div>
      <div className="panel-body">
        <table className={s.table}>
          <thead>
            <tr>
              <th></th>
              <th>
                <h4>{user.user_username}</h4>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className={s.highlight}>
              <td className={s.field}>姓名</td>
              <td>
                <a href="javascript:;">{user.user_name}</a>
              </td>
            </tr>
            <tr>
              <td colSpan={2}></td>
            </tr>
            <tr>
              <td className={s.field}>手机</td>
              <td>{user.user_phone}</td>
            </tr>
            <tr>
              <td colSpan={2}></td>
            </tr>
            <tr className={s.highlight}>
              <td className={s.field}>Email</td>
              <td>{user.user_email}</td>
            </tr>
            <tr>
              <td colSpan={2}></td>
            </tr>
            <tr className={s.highlight}>
              <td className={s.field}>web3地址</td>
              <td>{user.user_account}</td>
            </tr>
            <tr>
              <td colSpan={2}></td>
            </tr>
            <tr>
              <td className={s.field}>备注</td>
              <td>{user.user_remark}</td>
            </tr>
            <tr>
              <td colSpan={2}></td>
            </tr>
            <tr className={s.highlight}>
              <td className={s.field}>&nbsp;</td>
              <td>
                <Popconfirm
                  title="确认要重置密码?"
                  okText="是"
                  cancelText="否"
                  onConfirm={resetPassword}
                >
                  <Button type="primary">重置密码</Button>
                </Popconfirm>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default ResetPassword
