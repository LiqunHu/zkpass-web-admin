import { Button, Col, Form, Input, PaginationProps, Popconfirm, Row, Select, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getCodeList } from 'country-list'
import Detail from './Detail'

const { Column } = Table;

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
  const [form] = Form.useForm();
  const [total, setTotal] = useState<Number>(0)
  const [page, setPage] = useState<Number>(1)
  const [visible, setVisible] = useState<Boolean>(false)
  const [flag, setFlag] = useState<String>('')
  const [initialValue, setInitialValue] = useState<any>({})
  const data: any[] = [
    {
      key: '1',
      age: 32,
      address: 'New York ',
      domain: 'https://www.baidu.com'
    },
    {
      key: '2',
      age: 32,
      address: 'New York ',
      domain: 'https://www.jinghan.com'
    }]

  const search = () => {
    const params = {
      ...searchParams,
      limit: pageSize,
      offset: (page - 1) * pageSize
    }
    setTotal(10)
    console.log(params)
  }

  const handleSearch = (values: any) => {
    searchParams = values
    search()
  };

  const onReset = () => {
    searchParams = {}
    form.resetFields();
    if (page !== 1) setPage(1)
    else search()
  };

  useEffect(() => {
    search()
  }, [page])

  function pageChange(page: number) {
    setPage(page)
  }

  const showTotal: PaginationProps['showTotal'] = (total) => `Total ${total} items`;

  const publishConfirm = (e: any) => {
    console.log(e);
  };

  const offConfirm = (e: any) => {
    console.log(e);
  };

  const handleAdd = () => {
    setFlag('Add')
    setVisible(true)
    setInitialValue({})
  }

  const handleEdit = (e: any) => {
    console.log(e);
    setFlag('Edit')
    setVisible(true)
    setInitialValue(e)
  }

  const handleOpen = (val: Boolean) => {
    setVisible(val)
  }

  return (
    <div>
      <Form
        form={form}
        name="control-hooks"
        onFinish={handleSearch}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="domain" label="Domain" >
              <Input/>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="country" label="Country" >
              <Select options={countryOptions} allowClear={true} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="category" label="Category" >
              <Select allowClear>
                <Select.Option value="bank">bank</Select.Option>
                <Select.Option value="game">game</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="status" label="status" >
              <Select allowClear>
                <Select.Option value="1">Published</Select.Option>
                <Select.Option value="2">Removed from shelves</Select.Option>
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
      <Table dataSource={data} pagination={{ pageSize, total, onChange: pageChange, showTotal }}>
        <Column title="Country" dataIndex="age" />
        <Column title="Category" dataIndex="address" />
        <Column title="Domain" dataIndex="address" />
        <Column title="Demand" dataIndex="address" />
        <Column title="Reward" dataIndex="address" />
        <Column title="Release time" dataIndex="address" />
        <Column title="Status" dataIndex="address" />
        <Column
          title="Action"
          render={(_: any, record: any) => (
            <Space size="small">
              <Popconfirm
                description="Are you sure to delete this task?"
                onConfirm={() => publishConfirm(record)}
                okText="Yes"
                cancelText="No"
                title="warning">
                <a>publish</a>
              </Popconfirm>
              <Popconfirm
                description="Are you sure to delete this task?"
                onConfirm={() => offConfirm(record)}
                okText="Yes"
                cancelText="No"
                title="warning">
                <a>Off shelf</a>
              </Popconfirm>
              <a onClick={() => handleEdit(record)}>Edit</a>
            </Space>
          )}
        />
      </Table>
      <Detail open={visible} handleOpen={handleOpen} flag={flag} initialValue={initialValue}/>
    </div>
  );
};

export default DemandManagement;