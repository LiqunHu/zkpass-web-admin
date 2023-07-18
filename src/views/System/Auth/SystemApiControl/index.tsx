import './style.css'
import { useState, useEffect } from 'react'
import {
  Button,
  Tree,
  Modal,
  Form,
  Input,
  Table,
  Tabs,
  Select,
  Popconfirm
} from 'antd'
import request from '@/utils/request'
import common from '@/utils/common'
import icons from '@/assets/icon.json'
const apiUrl = '/v1/api/system/auth/SystemApiControl/'

function SystemApiControl() {
  const [pagePara, setPagePara] = useState({ authInfo: [] })
  const [treeData, setTreeData] = useState([])
  const [folderModalV, setFolderModalV] = useState(false)
  const [iconModalV, setIconModalV] = useState(false)
  const [menuModalV, setMenuModalV] = useState(false)
  const [folderForm] = Form.useForm()
  const [menuForm] = Form.useForm()
  const [action, setAction] = useState('')
  const [actNode, setActNode] = useState(Object.create(null))
  const [apiType, setApiType] = useState('0')

  const getTreeData = async () => {
    let response = await request.post(apiUrl + 'search', {})
    setTreeData(response.data.info)
  }

  const renderTreeNode = (nodeData: any) => {
    if (nodeData.systemmenu_id !== 0) {
      return (
        <span className="tree-node">
          <span> {nodeData.name}</span>
          <span>
            <Popconfirm
              title="确认要删除?"
              okText="是"
              cancelText="否"
              onConfirm={() => {
                removeNode(nodeData)
              }}
            >
              <Button
                size="small"
                shape="circle"
                style={{ position: 'absolute', left: '500px' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </Button>
            </Popconfirm>
          </span>
        </span>
      )
    } else {
      return (
        <span className="tree-node">
          <span> {nodeData.name}</span>
        </span>
      )
    }
  }

  const iconColumns = [
    {
      title: '图标',
      dataIndex: 'iconSource',
      key: 'iconImg',
      render: (classStr: string | undefined) => <i className={classStr}></i>
    },
    {
      title: '图标代码',
      dataIndex: 'iconSource',
      key: 'iconStr'
    }
  ]

  const handleCheckChange = (_selectedKeys: any, e: any) => {
    setActNode({
      systemmenu_id: e.node.systemmenu_id,
      systemmenu_name: e.node.systemmenu_name,
      systemmenu_icon: e.node.systemmenu_icon,
      node_type: e.node.node_type,
      api_type: e.node.api_type,
      api_function: e.node.api_function,
      auth_flag: e.node.auth_flag,
      api_path: e.node.api_path,
      api_remark: e.node.api_remark
    })
  }

  const addFolderModal = () => {
    folderForm.resetFields()
    setAction('add')
    if (actNode) {
      if (actNode.node_type === '01') {
        return common.warning('菜单下不允许新增内容')
      }
      setFolderModalV(true)
    } else {
      return common.warning('请选择一个目录')
    }
  }

  const submitFolder = async () => {
    try {
      const fieldsValue = await folderForm.validateFields()
      if (action === 'add') {
        fieldsValue.parent_id = actNode.systemmenu_id
        await request.post(apiUrl + 'addFolder', fieldsValue)
        common.success('增加目录成功')
      } else if (action === 'modify') {
        fieldsValue.systemmenu_id = actNode.systemmenu_id
        await request.post(apiUrl + 'modifyFolder', fieldsValue)
        common.success('修改目录成功')
      }
      await getTreeData()
      setFolderModalV(false)
    } catch (error) {
      common.fault(error)
    }
  }

  const addMenuModal = () => {
    setAction('add')
    setApiType('0')
    menuForm.resetFields()
    if (actNode) {
      if (actNode.node_type === '01') {
        return common.warning('菜单下不允许新增内容')
      }
      setMenuModalV(true)
    } else {
      return common.warning('请选择一个目录')
    }
  }

  const submitMenu = async () => {
    try {
      const fieldsValue = await menuForm.validateFields()
      if (action === 'add') {
        fieldsValue.parent_id = actNode.systemmenu_id
        fieldsValue.api_type = apiType
        await request.post(apiUrl + 'addMenu', fieldsValue)
        common.success('增加目录成功')
      } else if (action === 'modify') {
        fieldsValue.systemmenu_id = actNode.systemmenu_id
        fieldsValue.api_type = actNode.api_type
        await request.post(apiUrl + 'modifyMenu', fieldsValue)
        common.success('修改菜单成功')
      }

      await getTreeData()
      setMenuModalV(false)
    } catch (error) {
      common.fault(error)
    }
  }

  const editNodeModal = () => {
    if (!actNode || actNode.systemmenu_id === 0) {
      return common.warning('请选择一个节点')
    }
    setAction('modify')
    if (actNode.node_type === '00') {
      folderForm.resetFields()
      folderForm.setFieldsValue({
        systemmenu_name: actNode.systemmenu_name,
        systemmenu_icon: actNode.systemmenu_icon
      })
      setFolderModalV(true)
    } else if (actNode.node_type === '01') {
      menuForm.resetFields()
      menuForm.setFieldsValue({
        systemmenu_name: actNode.systemmenu_name,
        api_path: actNode.api_path,
        api_function: actNode.api_function,
        auth_flag: actNode.auth_flag,
        api_remark: actNode.api_remark
      })
      setApiType(actNode.api_type)
      setMenuModalV(true)
    }
  }

  const removeNode = async (node: any) => {
    try {
      await request.post(apiUrl + 'remove', {
        systemmenu_id: node.systemmenu_id
      })
      common.success('删除成功')
      await getTreeData()
    } catch (error) {
      common.fault(error)
    }
  }

  const initPage = async () => {
    try {
      let response = await request.post(apiUrl + 'init', {})
      setPagePara(response.data.info)
      await getTreeData()
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
        <Button type="primary" className="m-r-5" onClick={addFolderModal}>
          增加目录
        </Button>
        <Button type="primary" className="m-r-5" onClick={addMenuModal}>
          增加菜单
        </Button>
        <Button type="primary" onClick={editNodeModal}>
          编辑
        </Button>
      </div>
      <div className="panel-body">
        {treeData.length > 0 ? (
          <Tree
            showIcon
            defaultExpandedKeys={[0]}
            icon={(nodeData: any) =>
              nodeData.node_type === '00' ? (
                <i className="fa-regular fa-folder m-r-5"></i>
              ) : null
            }
            treeData={treeData}
            fieldNames={{ title: 'name', key: 'systemmenu_id' }}
            titleRender={renderTreeNode}
            onSelect={handleCheckChange}
          />
        ) : null}
      </div>
      <Modal
        title="目录"
        centered
        open={folderModalV}
        onCancel={() => setFolderModalV(false)}
        onOk={submitFolder}
        width={500}
      >
        <Form form={folderForm} name="folderForm" labelCol={{ span: 4 }}>
          <Form.Item
            label="目录名称"
            name="systemmenu_name"
            rules={[{ required: true, message: '缺少名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="图标"
            name="systemmenu_icon"
            rules={[{ required: true, message: '缺少图标' }]}
          >
            <Input.Search
              onSearch={() => {
                setIconModalV(true)
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="图标选择"
        centered
        open={iconModalV}
        onCancel={() => setIconModalV(false)}
        width={420}
        footer={null}
      >
        <Table
          size="small"
          pagination={{ defaultPageSize: 8 }}
          columns={iconColumns}
          dataSource={icons}
          rowKey="id"
          onRow={(record) => {
            return {
              onClick: () => {
                folderForm.setFieldsValue({
                  systemmenu_icon: record.iconSource
                })
                setIconModalV(false)
              } // 点击行
            }
          }}
        />
      </Modal>
      <Modal
        title="菜单"
        centered
        open={menuModalV}
        onCancel={() => setMenuModalV(false)}
        onOk={submitMenu}
        width={500}
      >
        <Form form={menuForm} name="menuForm" labelCol={{ span: 4 }}>
          <Form.Item
            label="功能名称"
            name="systemmenu_name"
            rules={[{ required: true, message: '缺少名称' }]}
          >
            <Input />
          </Form.Item>
          <Tabs
            activeKey={apiType}
            onChange={(activeKey: string) => {
              setApiType(activeKey)
            }}
            items={[
              {
                key: '0',
                label: '菜单&授权API',
                children: (
                  <>
                    <Form.Item label="菜单路径" name="api_path">
                      <Input />
                    </Form.Item>
                    <Form.Item label="授权功能" name="api_function">
                      <Input />
                    </Form.Item>
                    <Form.Item label="权限校验" name="auth_flag">
                      {!pagePara ? null : (
                        <Select>
                          {pagePara.authInfo.map((item: any) => (
                            <Select.Option value={item.id} key={item.id}>
                              {item.text}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="备注">
                      <Input.TextArea />
                    </Form.Item>
                  </>
                )
              },
              {
                key: '1',
                label: '菜单',
                children: (
                  <>
                    <Form.Item label="菜单路径" name="api_path">
                      <Input />
                    </Form.Item>
                    <Form.Item label="备注" name="api_remark">
                      <Input.TextArea />
                    </Form.Item>
                  </>
                )
              },
              {
                key: '2',
                label: '授权API',
                children: (
                  <>
                    <Form.Item label="授权功能" name="api_function">
                      <Input />
                    </Form.Item>
                    <Form.Item label="权限校验" name="auth_flag">
                      {!pagePara ? null : (
                        <Select>
                          {pagePara.authInfo.map((item: any) => (
                            <Select.Option value={item.id} key={item.id}>
                              {item.text}
                            </Select.Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item label="备注" name="api_remark">
                      <Input.TextArea />
                    </Form.Item>
                  </>
                )
              }
            ]}
          />
        </Form>
      </Modal>
    </div>
  )
}

export default SystemApiControl
