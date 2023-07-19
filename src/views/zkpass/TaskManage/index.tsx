import {
  Button,
  Col,
  Form,
  Input,
  message,
  PaginationProps,
  Popconfirm,
  Row,
  Select,
  Space,
  Table
} from 'antd'
import React, { useEffect, useState } from 'react'
import { getCodeList } from 'country-list'
import dayjs from 'dayjs'
import request from '@/utils/request'
import TaskDetail from './taskDetail'

const { Column } = Table

const pageSize = 10
let searchParams = {
  limit: pageSize,
  offset: 0
}

const countries = getCodeList()
const countryOptions = Object.keys(countries).map((key) => ({
  value: key,
  label: countries[key]
}))

const DemandManagement: React.FC = () => {
  const [form] = Form.useForm()
  const [taskList, setTaskList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [flag, setFlag] = useState('')
  const [initialValue, setInitialValue] = useState({})

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
    const res = await request.post(
      '/v1/api/zkpass/adminTask/modifyTask',
      params
    )
    if (res.data.errno === '0') {
      message.success('Success')
      search()
    }
  }

  const handleAdd = () => {
    setFlag('Add')
    setVisible(true)
    setInitialValue({})
  }

  const handleEdit = (e: any) => {
    console.log(e)
    setFlag('Edit')
    setVisible(true)
    setInitialValue(e)
  }

  const handleOpen = (val: boolean) => {
    setVisible(val)
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
              <Select options={countryOptions} allowClear={true} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sbt_task_category" label="Category">
              <Select allowClear>
                <Select.Option value="bank">bank</Select.Option>
                <Select.Option value="game">game</Select.Option>
              </Select>
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
                <Button type="primary" onClick={handleAdd}>
                  Add demand
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={taskList}
        rowKey={(record: any) => record.sbt_task_id}
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
              <a onClick={() => handleEdit(record)}>Edit</a>
            </Space>
          )}
        />
      </Table>
      <TaskDetail
        open={visible}
        handleOpen={handleOpen}
        flag={flag}
        initialValue={initialValue}
        refresh={search}
      />
    </div>
  )
}

export default DemandManagement
