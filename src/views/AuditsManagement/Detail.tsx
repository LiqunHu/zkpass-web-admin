import { Button, Form, Input, Modal, Select, Space } from 'antd'
import { getCodeList } from 'country-list'
import ReactJson from 'react-json-view'
import React, { useEffect } from 'react'
const { TextArea } = Input

const countries = getCodeList()
const countryOptions = Object.keys(countries).map((key) => ({
  value: key,
  label: countries[key]
}))

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const jsonData = {}

function Detail({open, handleOpen, initialValue}:any) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValue)
  }, [initialValue])

  const hideModal = () => {
    handleOpen(false);
  };
  return (
    <Modal
      forceRender={form}
      destroyOnClose={true}
      footer={null}
      onCancel={hideModal}
      title="detail"
      open={open}
    >
      <Form
        {...formItemLayout}
        form={form}
        style={{ maxWidth: 600 }}
        initialValues={initialValue}
      >
        <Form.Item name="account" label="Wallet account">
          <Input/>
        </Form.Item>
        <Form.Item name="domain" label="Domain">
          <Input/>
        </Form.Item>
        <Form.Item name="country" label="Country">
          <Select options={countryOptions} />
        </Form.Item>
        <Form.Item name="category" label="Category">
          <Select>
            <Select.Option value="bank">bank</Select.Option>
            <Select.Option value="game">game</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="discard" label="Discard">
          <Input/>
        </Form.Item>
        <Form.Item name="images" label="Images">
          <div></div>
        </Form.Item>
        <Form.Item name="describe" label="describe">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item name="submitTime" label="Submit time">
          <Input/>
        </Form.Item>
        <Form.Item name="pageData" label="Page data">
          <ReactJson src={jsonData} collapsed={true} />
        </Form.Item>
        <div style={{display: 'flex', justifyContent:'flex-end', alignItems:'center'}}>
          <Space size="small">
            <Button htmlType="button" onClick={hideModal}>
              Confirm
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}

export default Detail;