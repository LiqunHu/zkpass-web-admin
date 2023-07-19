import s from './style.module.css'
import request from '@/utils/request'
import { Button, Modal, Form, Input, Table, Select, Popconfirm } from 'antd'
import { EditOutlined, CloseOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import common from '@/utils/common'

const { Search } = Input
const apiUrl = '/v1/api/system/auth/OperatorControl/'
const pageSize = 10
let workPara: any = {}

function OperatorControl() {
  const [pagePara, setPagePara] = useState({ groupInfo: [] })
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [action, setAction] = useState('add')
  const [userModalV, setUserModalV] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [tableData, setTableData] = useState([])
  const [userForm] = Form.useForm()

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text: any, record: any, index: number) => `${index + 1}`
    },
    {
      title: '用户名',
      dataIndex: 'user_username',
      key: 'user_username'
    },
    {
      title: '姓名',
      dataIndex: 'user_name',
      key: 'user_name'
    },
    {
      title: '电话',
      dataIndex: 'user_phone',
      key: 'user_phone'
    },
    {
      title: '邮箱',
      dataIndex: 'user_email',
      key: 'user_email'
    },
    {
      title: 'address',
      dataIndex: 'user_account',
      key: 'user_account',
      render: (text: string) => `${!text ? '' : text.slice(0, 5)}...`
    },
    {
      title: 'action',
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: any) => (
        <>
          <Button
            type="primary"
            size="small"
            className={s.mr3}
            icon={<EditOutlined />}
            onClick={() => modifyUserModal(record)}
          />
          <Popconfirm
            title="确认要删除?"
            okText="是"
            cancelText="否"
            onConfirm={() => deleteUser(record)}
          >
            <Button type="primary" size="small" icon={<CloseOutlined />} />
          </Popconfirm>
        </>
      )
    }
  ]

  const getUserData = async () => {
    try {
      let response = await request.post(apiUrl + 'search', {
        search_text: searchText,
        offset: (current - 1) * pageSize,
        limit: pageSize
      })
      setTotal(response.data.info.total)
      setTableData(response.data.info.rows)
    } catch (error) {
      common.fault(error)
    }
  }

  const addUserModal = () => {
    userForm.resetFields()
    setAction('add')
    setUserModalV(true)
  }

  const modifyUserModal = (record: any) => {
    workPara = JSON.parse(JSON.stringify(record))
    userForm.resetFields()
    userForm.setFieldsValue({
      user_account: record.user_account,
      user_username: record.user_username,
      user_name: record.user_name,
      user_email: record.user_email,
      user_phone: record.user_phone,
      user_groups: record.user_groups
    })
    setAction('modify')
    setUserModalV(true)
  }

  const deleteUser = async (record: any) => {
    try {
      await request.post(apiUrl + 'delete', { user_id: record.user_id })
      common.success('删除用户成功')
      await getUserData()
    } catch (error) {
      common.fault(error)
    }
  }

  const submitUser = async () => {
    try {
      const fieldsValue = await userForm.validateFields()
      if (action === 'add') {
        await request.post(apiUrl + 'add', fieldsValue)
        common.success('增加用户成功')
      } else if (action === 'modify') {
        fieldsValue.user_id = workPara.user_id
        delete fieldsValue.user_account
        await request.post(apiUrl + 'modify', fieldsValue)
        common.success('修改用户成功')
      }
      await getUserData()
      setUserModalV(false)
    } catch (error) {
      common.fault(error)
    }
  }

  const initPage = async () => {
    try {
      let response = await request.post(apiUrl + 'init', {})
      setPagePara(response.data.info)
      await getUserData()
    } catch (error) {
      common.fault(error)
    }
  }

  useEffect(() => {
    initPage()
  }, [])

  return (
    <div>
      <div className="panel-toolbar">
        <Search
          placeholder="用户名、手机、姓名"
          value={searchText}
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
          enterButton
          onSearch={() => {
            setCurrent(1)
            getUserData()
          }}
        />
        <Button type="primary" className="m-l-5" onClick={addUserModal}>
          增加用户
        </Button>
      </div>
      <div className="panel-body">
        <Table
          scroll={{ y: 'calc(100vh - 50px)' }}
          columns={columns}
          rowKey={'user_id'}
          pagination={{
            total: total,
            current: current,
            pageSize: pageSize,
            onChange: (page) => {
              setCurrent(page)
              getUserData()
            }
          }}
          dataSource={tableData}
        />
      </div>
      <Modal
        title={action === 'add' ? '增加用户' : '用户维护'}
        centered
        open={userModalV}
        onCancel={() => setUserModalV(false)}
        onOk={submitUser}
        width={500}
      >
        <Form form={userForm} name="userForm" labelCol={{ span: 4 }}>
          <Form.Item
            label="web3地址"
            name="user_account"
            hidden={action === 'add'}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="用户名"
            name="user_username"
            rules={[{ required: true, message: '缺少名称' }]}
          >
            <Input disabled={action === 'modify'} />
          </Form.Item>
          <Form.Item label="姓名" name="user_name">
            <Input />
          </Form.Item>
          <Form.Item label="邮箱" name="user_email">
            <Input />
          </Form.Item>
          <Form.Item label="手机" name="user_phone">
            <Input />
          </Form.Item>
          <Form.Item label="用户组" name="user_groups">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              options={pagePara.groupInfo.map((item: any) => {
                return {
                  label: item.text,
                  value: item.id,
                  disabled: item.disabled
                }
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default OperatorControl
