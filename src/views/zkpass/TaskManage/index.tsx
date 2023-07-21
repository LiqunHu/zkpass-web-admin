import {
  Button,
  Col,
  Form,
  Input,
  message,
  PaginationProps,
  Popconfirm,
  Radio,
  Row,
  Modal,
  Select,
  Space,
  Table
} from 'antd'
import React, { useEffect, useState } from 'react'
import { getCodeList } from 'country-list'
import dayjs from 'dayjs'
import request from '@/utils/request'
import common from '@/utils/common'

const { Column } = Table
const { TextArea } = Input

const apiUrl = '/v1/api/zkpass/adminTask/'
const pageSize = 10
let searchParams = {
  limit: pageSize,
  offset: 0
}
let workPara: any = {}

const countries = getCodeList()
const countryOptions = Object.keys(countries).map((key) => ({
  value: key,
  label: countries[key]
}))

const categoryOptions = [
  {
    value: 'Legal Identity',
    label: 'Legal Identity'
  },
  {
    value: 'Financial',
    label: 'Financial'
  },
  {
    value: 'Social',
    label: 'Social'
  },
  {
    value: 'Educational',
    label: 'Educational'
  },
  {
    value: 'Skills',
    label: 'Skills'
  },
  {
    value: 'On-chain Activities',
    label: 'On-chain Activities'
  }
]

const DemandManagement: React.FC = () => {
  const [action, setAction] = useState('add')
  const [taskList, setTaskList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [detailModalV, setDetailModalV] = useState(false)
  const [form] = Form.useForm()
  const [detailForm] = Form.useForm()

  const search = async () => {
    const params = {
      ...searchParams,
      limit: pageSize,
      offset: (page - 1) * pageSize
    }
    try {
      const { data } = await request.post(
        '/v1/api/zkpass/adminTask/getTaskList',
        params
      )
      setTotal(parseInt(data.info.total))
      setTaskList(data.info.rows)
    } catch (e) {
      console.error(e)
    }
  }

  const handleSearch = (values: any) => {
    searchParams = values
    search()
  }

  const onReset = () => {
    searchParams = {
      limit: pageSize,
      offset: 0
    }
    form.resetFields()
    if (page !== 1) setPage(1)
    else search()
  }

  useEffect(() => {
    search()
  }, [page])

  function pageChange(page: number) {
    setPage(page)
  }

  const showTotal: PaginationProps['showTotal'] = (total) =>
    `Total ${total} items`

  const doClick = async (e: any, status: string) => {
    const params = {
      sbt_task_id: e.sbt_task_id,
      sbt_task_status: status
    }
    const res = await request.post(apiUrl + 'modifyTask', params)
    if (res.data.errno === '0') {
      message.success('Success')
      search()
    }
  }

  const addTaskModal = () => {
    detailForm.resetFields()
    setAction('add')
    setDetailModalV(true)
  }

  const modifyTaskModal = (record: any) => {
    workPara = JSON.parse(JSON.stringify(record))
    detailForm.resetFields()
    detailForm.setFieldsValue({
      sbt_task_country_code: record.sbt_task_country_code,
      sbt_task_category: record.sbt_task_category,
      sbt_task_domain: record.sbt_task_domain,
      sbt_task_requirements: record.sbt_task_requirements,
      sbt_task_reward: record.sbt_task_reward,
      sbt_task_status: record.sbt_task_status
    })
    setAction('modify')
    setDetailModalV(true)
  }

  const submitDeatil = async () => {
    try {
      const fieldsValue = await detailForm.validateFields()
      if (action === 'add') {
        await request.post(apiUrl + 'addTask', fieldsValue)
        common.success('Add Task Success')
      } else if (action === 'modify') {
        fieldsValue.sbt_task_id = workPara.sbt_task_id
        await request.post(apiUrl + 'modifyTask', fieldsValue)
        common.success('Modify Task Success')
      }
      await search()
      setDetailModalV(false)
    } catch (error) {
      common.fault(error)
    }
  }

  return (
    <div>
      <Form form={form} name="control-hooks" onFinish={handleSearch}>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="search_text" label="Domain">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sbt_task_country_code" label="Country">
              <Select options={countryOptions} allowClear showSearch />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sbt_task_category" label="Category">
              <Select options={categoryOptions} allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sbt_task_status" label="status">
              <Select allowClear>
                <Select.Option value="1">Published</Select.Option>
                <Select.Option value="0">Removed from shelves</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item>
              <Space size="small">
                <Button type="primary" htmlType="submit">
                  Search
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  Reset
                </Button>
                <Button type="primary" onClick={addTaskModal}>
                  Add demand
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={taskList}
        rowKey='sbt_task_id'
        pagination={{ pageSize, total, onChange: pageChange, showTotal }}
        scroll={{ y: 'calc(100vh - 450px)' }}
      >
        <Column
          title="Country"
          render={(_: any, record: any) => (
            <div>{countries[record.sbt_task_country_code.toLowerCase()]}</div>
          )}
        />
        <Column title="Category" dataIndex="sbt_task_category" />
        <Column title="Domain" dataIndex="sbt_task_domain" />
        <Column title="Demand" dataIndex="sbt_task_requirements" />
        <Column title="Reward" dataIndex="sbt_task_reward" />
        <Column
          title="Release time"
          width={180}
          render={(_: any, record: any) => (
            <div>{dayjs(record.created_at).format('YYYY-MM-DD HH:mm')}</div>
          )}
        />
        <Column
          title="Status"
          render={(_: any, record: any) => (
            <div>
              {record.sbt_task_status === '0'
                ? 'Removed from shelves'
                : 'Published'}
            </div>
          )}
        />
        <Column
          title="Action"
          width={200}
          render={(_: any, record: any) => (
            <Space size="small">
              <Popconfirm
                description="Are you sure to publish this task?"
                onConfirm={() => doClick(record, '1')}
                okText="Yes"
                cancelText="No"
                title="warning"
              >
                <a>Publish</a>
              </Popconfirm>
              <Popconfirm
                description="Are you sure to off shelf this task?"
                onConfirm={() => doClick(record, '0')}
                okText="Yes"
                cancelText="No"
                title="warning"
              >
                <a>Off shelf</a>
              </Popconfirm>
              <a onClick={() => modifyTaskModal(record)}>Edit</a>
            </Space>
          )}
        />
      </Table>
      <Modal
        onCancel={() => setDetailModalV(false)}
        onOk={submitDeatil}
        title={action === 'add' ? 'Add Task' : 'Modify Task'}
        open={detailModalV}
      >
        <Form
          labelCol={{
            xs: { span: 24 },
            sm: { span: 6 }
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 16 }
          }}
          form={detailForm}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="sbt_task_country_code"
            label="Country"
            rules={[{ required: true }]}
          >
            <Select options={countryOptions} showSearch />
          </Form.Item>
          <Form.Item
            name="sbt_task_category"
            label="Category"
            rules={[{ required: true }]}
          >
            <Select options={categoryOptions} />
          </Form.Item>
          <Form.Item
            name="sbt_task_domain"
            label="Domain"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="sbt_task_requirements"
            label="Info"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} maxLength={200} />
          </Form.Item>
          <Form.Item
            name="sbt_task_reward"
            label="Reward"
            rules={[{ required: true }]}
          >
            <TextArea rows={2} maxLength={200} />
          </Form.Item>
          {action === 'add' && (
            <Form.Item
              name="sbt_task_status"
              label="status"
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value="1">Publish</Radio>
                <Radio value="2">Off shelf</Radio>
              </Radio.Group>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default DemandManagement
