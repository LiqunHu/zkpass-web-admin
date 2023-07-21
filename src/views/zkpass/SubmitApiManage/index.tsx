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
import request from '@/utils/request'
import SubmitDetail from './submitDetail'
import dayjs from 'dayjs'

const { Column } = Table

const pageSize = 10
let searchParams = {
  limit: pageSize,
  offset: 0
}

const statusMap: {
  [key: string]: string
} = {
  '0': 'Submit',
  '1': 'Passed',
  '2': 'Reject'
}

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

const AuditsManagement: React.FC = () => {
  const [form] = Form.useForm()
  const [audits, setAudits] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [visible, setVisible] = useState(false)
  const [initialValue, setInitialValue] = useState({})

  const search = async () => {
    const params = {
      ...searchParams,
      limit: pageSize,
      offset: (page - 1) * pageSize
    }
    try {
      const { data } = await request.post(
        '/v1/api/zkpass/adminSubmitApi/getSubmitAPIList',
        params
      )
      setTotal(parseInt(data.info.total))
      setAudits(data.info.rows)
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
      sbt_submit_api_id: e.id,
      sbt_submit_api_status: status
    }
    try {
      const res = await request.post(
        '/v1/api/zkpass/adminSubmitApi/modifySubmitAPI',
        params
      )
      if (res.data.errno === '0') {
        message.success('Success')
        search()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSee = (e: any) => {
    setVisible(true)
    setInitialValue(e)
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
            <Form.Item name="sbt_submit_api_country_code" label="Country">
              <Select options={countryOptions} allowClear={true} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sbt_submit_api_category" label="Category">
              <Select options={categoryOptions} allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="sbt_submit_api_status" label="Status">
              <Select allowClear>
                <Select.Option value="0">Submit</Select.Option>
                <Select.Option value="1">Passed</Select.Option>
                <Select.Option value="2">Reject</Select.Option>
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
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={audits}
        rowKey={(record: any) => record.sbt_submit_api_id}
        pagination={{ pageSize, total, onChange: pageChange, showTotal }}
        scroll={{ y: 'calc(100vh - 450px)' }}
      >
        <Column
          title="Wallet account"
          dataIndex="user_account"
          ellipsis={true}
        />
        <Column title="Domain" dataIndex="sbt_submit_api_domain" />
        <Column
          title="Country"
          render={(_: any, record: any) => (
            <div>
              {countries[record.sbt_submit_api_country_code.toLowerCase()]}
            </div>
          )}
        />
        <Column title="Category" dataIndex="sbt_submit_api_category" />
        <Column title="Discard" dataIndex="sbt_submit_api_discord" />
        <Column
          title="Submit time"
          render={(_: any, record: any) => (
            <div>{dayjs(record.created_at).format('YYYY-MM-DD HH:mm')}</div>
          )}
        />
        <Column
          title="Audit Status"
          render={(_: any, record: any) => (
            <div>{statusMap[record.sbt_submit_api_status as string]}</div>
          )}
        />
        <Column
          title="Action"
          render={(_: any, record: any) => (
            <Space size="small">
              <a onClick={() => handleSee(record)}>See</a>
              <Popconfirm
                description="Are you sure to pass this task?"
                onConfirm={() => doClick(record, '1')}
                okText="Yes"
                cancelText="No"
                title="passed"
              >
                <a>Pass</a>
              </Popconfirm>
              <Popconfirm
                description="Are you sure to delete this task?"
                onConfirm={() => doClick(record, '2')}
                okText="Yes"
                cancelText="No"
                title="reject"
              >
                <a>Reject</a>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
      <SubmitDetail
        open={visible}
        onCancel={() => setVisible(false)}
        initialValue={initialValue}
      />
    </div>
  )
}

export default AuditsManagement
