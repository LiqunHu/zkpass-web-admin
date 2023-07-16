import { Button, Col, Form, Input, PaginationProps, Row, Select, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { getCodeList } from 'country-list'
import Detail from '@/views/AuditsManagement/Detail'

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


const ResourcePool: React.FC = () => {
  const [form] = Form.useForm();
  const [total, setTotal] = useState<Number>(0)
  const [page, setPage] = useState<Number>(1)
  const [visible, setVisible] = useState<Boolean>(false)
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

  const handleSee = (e: any) => {
    console.log(e);
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
      <Table dataSource={data} pagination={{ pageSize, total, onChange: pageChange, showTotal }}>
        <Column title="Wallet account" dataIndex="age" />
        <Column title="Category" dataIndex="address" />
        <Column title="Domain" dataIndex="address" />
        <Column title="Discard" dataIndex="address" />
        <Column title="Submit time" dataIndex="address" />
        <Column
          title="Action"
          render={(_: any, record: any) => (
            <Space size="small">
              <a onClick={() => handleSee(record)}>See</a>
            </Space>
          )}
        />
      </Table>
      <Detail open={visible} handleOpen={handleOpen} initialValue={initialValue}/>
    </div>
  );
};

export default ResourcePool;