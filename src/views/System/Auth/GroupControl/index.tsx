import './style.css'
import { useState, useEffect } from 'react'
import { Button, Tree, Modal, Form, Input, Popconfirm } from 'antd'
import { FolderOpenOutlined, FileOutlined } from '@ant-design/icons'
import type { DataNode } from 'antd/es/tree'
import request from '@/utils/request'
import common from '@/utils/common'
const apiUrl = '/v1/api/system/auth/GroupControl/'

function GroupControl() {
  const [pagePara, setPagePara] = useState({ menuInfo: [] })
  const [treeData, setTreeData] = useState([])
  const [actNode, setActNode] = useState(Object.create(null))
  const [action, setAction] = useState('')
  const [permissionTreeData, setPermissionTreeData] = useState<DataNode[]>([])
  const [checkData, setCheckData] = useState([])
  const [groupModalV, setGroupModalV] = useState(false)
  const [permissionModalV, setPermissionModalV] = useState(false)
  const [groupForm] = Form.useForm()
  const [permissionForm] = Form.useForm()

  const getTreeData = async () => {
    let response = await request.post(apiUrl + 'search', {})
    setTreeData(response.data.info)
  }

  const renderTreeNode = (nodeData: any) => {
    if (nodeData.usergroup_id !== 0) {
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

  const handleCheckChange = (_selectedKeys: any, e: any) => {
    setActNode({
      usergroup_id: e.node.usergroup_id,
      node_type: e.node.node_type,
      usergroup_type: e.node.usergroup_type,
      usergroup_code: e.node.usergroup_code,
      name: e.node.name,
      title: e.node.title,
      parent_flag: e.node.parent_flag,
      parent_id: e.node.parent_id
    })
  }

  const addGroupModal = () => {
    if (!actNode) {
      return common.warning('请选择一个节点')
    } else {
      if (actNode.node_type === '01') {
        return common.warning('角色下不允许新增')
      }
    }
    groupForm.resetFields()
    setAction('add')
    setGroupModalV(true)
  }

  const genPermissionTreeData = (data: any): DataNode[] => {
    return data.map((item: any) => {
      return {
        title: item.name,
        key: item.systemmenu_id,
        children: !item.children ? null : genPermissionTreeData(item.children),
        icon:
          item.node_type === '00' ? <FolderOpenOutlined /> : <FileOutlined />
      }
    })
  }

  const addPermissionModal = () => {
    if (!actNode) {
      return common.warning('请选择一个节点')
    } else {
      if (actNode.node_type === '01') {
        return common.warning('角色下不允许新增')
      }
    }
    permissionForm.resetFields()
    console.log(pagePara.menuInfo)
    setCheckData([])
    setAction('add')
    setPermissionModalV(true)
  }

  const editNode = async () => {
    try {
      if (!actNode) {
        return common.warning('请选择一个节点')
      }
      setAction('modify')
      if (actNode.node_type === '00') {
        groupForm.resetFields()
        groupForm.setFieldsValue({
          usergroup_name: actNode.name
        })
        setGroupModalV(true)
      } else {
        let response = await request.post(apiUrl + 'getcheck', {
          usergroup_id: actNode.usergroup_id
        })
        setCheckData(response.data.info.groupMenu)
        permissionForm.resetFields()
        permissionForm.setFieldsValue({
          usergroup_code: actNode.usergroup_code,
          usergroup_name: actNode.name
        })
        setPermissionModalV(true)
      }
    } catch (error) {
      common.fault(error)
    }
  }

  const submitGroup = async () => {
    try {
      const fieldsValue = await groupForm.validateFields()
      if (action === 'add') {
        fieldsValue.parent_id = actNode.usergroup_id
        fieldsValue.node_type = '00'
        await request.post(apiUrl + 'add', fieldsValue)
        common.success('增加组成功')
      } else if (action === 'modify') {
        fieldsValue.usergroup_id = actNode.usergroup_id
        await request.post(apiUrl + 'modify', fieldsValue)
        common.success('修改目录成功')
      }
      await getTreeData()
      setGroupModalV(false)
    } catch (error) {
      common.fault(error)
    }
  }

  const submitPermission = async () => {
    try {
      const fieldsValue = await permissionForm.validateFields()
      fieldsValue.menus = []
      for (let n of checkData) {
        fieldsValue.menus.push({ menu_id: n })
      }
      if (action === 'add') {
        fieldsValue.parent_id = actNode.usergroup_id
        fieldsValue.node_type = '01'
        await request.post(apiUrl + 'add', fieldsValue)
        common.success('增加角色成功')
      } else if (action === 'modify') {
        delete fieldsValue.usergroup_code
        fieldsValue.usergroup_id = actNode.usergroup_id
        await request.post(apiUrl + 'modify', fieldsValue)
        common.success('修改目录成功')
      }
      await getTreeData()
      setPermissionModalV(false)
    } catch (error) {
      common.fault(error)
    }
  }

  const removeNode = async (node: any) => {
    try {
      await request.post(apiUrl + 'remove', { usergroup_id: node.usergroup_id })
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
      setPermissionTreeData([
        ...genPermissionTreeData(response.data.info.menuInfo)
      ])
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
        <Button type="primary" className="m-r-5" onClick={addGroupModal}>
          增加组
        </Button>
        <Button type="primary" className="m-r-5" onClick={addPermissionModal}>
          增加权限组
        </Button>
        <Button type="primary" onClick={editNode}>
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
            fieldNames={{ title: 'name', key: 'usergroup_id' }}
            titleRender={renderTreeNode}
            onSelect={handleCheckChange}
          />
        ) : null}
      </div>
      <Modal
        title="组"
        centered
        open={groupModalV}
        onCancel={() => setGroupModalV(false)}
        onOk={submitGroup}
        width={500}
      >
        <Form form={groupForm} name="groupForm" labelCol={{ span: 4 }}>
          <Form.Item
            label="组名称"
            name="usergroup_name"
            rules={[{ required: true, message: '缺少组名称' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="角色"
        centered
        open={permissionModalV}
        onCancel={() => setPermissionModalV(false)}
        onOk={submitPermission}
        width={500}
      >
        <Form
          form={permissionForm}
          name="permissionForm"
          labelCol={{ span: 4 }}
        >
          <Form.Item
            label="角色代码"
            name="usergroup_code"
            rules={[{ required: true, message: '缺少角色代码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="角色名称"
            name="usergroup_name"
            rules={[{ required: true, message: '缺少角色名称' }]}
          >
            <Input />
          </Form.Item>
          <Tree
            showIcon
            checkable
            defaultExpandAll
            onCheck={(cks) => {
              setCheckData(cks as any)
            }}
            checkedKeys={checkData}
            treeData={permissionTreeData}
            onSelect={handleCheckChange}
          />
        </Form>
      </Modal>
    </div>
  )
}
export default GroupControl
