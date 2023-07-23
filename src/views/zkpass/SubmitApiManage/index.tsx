import {
  Button,
  Col,
  Form,
  Input,
  message,
  PaginationProps,
  Popconfirm,
  Row,
  Modal,
  Select,
  Space,
  Table
} from 'antd'
import React, { useEffect, useState } from 'react'
import { getCodeList } from 'country-list'
import request from '@/utils/request'
import dayjs from 'dayjs'
import ReactJson from 'react-json-view'
const { Column } = Table
const { TextArea } = Input

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
  const [dataForm] = Form.useForm()
  const [audits, setAudits] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [detailModalV, setDetailModalV] = useState(false)
  const [current, setCurrent] = useState({
    created_at: 0,
    sbt_submit_api_images: '',
    sbt_submit_api_data: []
  })

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
              <Select options={countryOptions} allowClear showSearch />
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
                <Select.Option key="0" value="0">Submit</Select.Option>
                <Select.Option key="1" value="1">Passed</Select.Option>
                <Select.Option key="2" value="2">Reject</Select.Option>
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
        rowKey='sbt_submit_api_id'
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
              <a
                onClick={() => {
                  dataForm.setFieldsValue({
                    user_account: record.user_account,
                    sbt_submit_api_domain: record.sbt_submit_api_domain,
                    sbt_submit_api_country_code:
                      record.sbt_submit_api_country_code,
                    sbt_submit_api_category: record.sbt_submit_api_category,
                    sbt_submit_api_discord: record.sbt_submit_api_discord,
                    sbt_submit_api_description:
                      record.sbt_submit_api_description
                  })
                  setCurrent(record)
                  setDetailModalV(true)
                }}
              >
                See
              </a>
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
      <Modal
        footer={null}
        title="detail"
        onCancel={() => {
          setDetailModalV(false)
        }}
        open={detailModalV}
        width={800}
      >
        <Form
          form={dataForm}
          labelCol={{
            xs: { span: 24 },
            sm: { span: 6 }
          }}
          wrapperCol={{
            xs: { span: 24 },
            sm: { span: 16 }
          }}
          disabled={true}
        >
          <Form.Item name="user_account" label="Wallet account">
            <Input />
          </Form.Item>
          <Form.Item name="sbt_submit_api_domain" label="Domain">
            <Input />
          </Form.Item>
          <Form.Item name="sbt_submit_api_country_code" label="Country">
            <Select options={countryOptions} />
          </Form.Item>
          <Form.Item name="sbt_submit_api_category" label="Category">
            <Select options={categoryOptions} />
          </Form.Item>
          <Form.Item name="sbt_submit_api_discord" label="Discard">
            <Input />
          </Form.Item>
          <Form.Item label="Images">
            {current.sbt_submit_api_images.split(',').map((item: any, index: number) => {
              return (
                <a href={`${item}`} target='_blank' key={index}>Image{index} </a>
              )
            })}
          </Form.Item>
          <Form.Item name="sbt_submit_api_description" label="describe">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Submit time">
            <div>{dayjs(current.created_at).format('YYYY-MM-DD HH:mm')}</div>
          </Form.Item>
          <Form.Item label="Page data">
            {current.sbt_submit_api_data.map((item: any, index: number) => (
              <ReactJson src={item} collapsed={true} key={index} displayDataTypes={false} />
            ))}
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            htmlType="button"
            onClick={() => {
              setDetailModalV(false)
            }}
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default AuditsManagement
