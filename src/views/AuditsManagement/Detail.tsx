import { Button, Form, Input, Modal, Select, Space } from 'antd'
import dayjs from 'dayjs'
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
      width={800}
    >
      <Form
        {...formItemLayout}
        disabled={true}
        form={form}
        initialValues={initialValue}
      >
        <Form.Item name="user_account" label="Wallet account">
          <Input/>
        </Form.Item>
        <Form.Item name="sbt_submit_api_domain" label="Domain">
          <Input/>
        </Form.Item>
        <Form.Item name="sbt_submit_api_country_code" label="Country">
          <Select options={countryOptions} />
        </Form.Item>
        <Form.Item name="sbt_submit_api_category" label="Category">
          <Select>
            <Select.Option value="bank">bank</Select.Option>
            <Select.Option value="game">game</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="sbt_submit_api_discord" label="Discard">
          <Input/>
        </Form.Item>
        <Form.Item name="sbt_submit_api_images" label="Images">
          <div></div>
        </Form.Item>
        <Form.Item name="sbt_submit_api_description" label="describe">
          <TextArea rows={2} />
        </Form.Item>
        <Form.Item label="Submit time">
          <div>{dayjs(initialValue?.created_at).format('YYYY-MM-DD HH:mm')}</div>
        </Form.Item>
        <Form.Item label="Page data">
          {initialValue?.sbt_submit_api_data?.map((item, index) => (
            <ReactJson src={item.request} collapsed={true} key={index}/>
          ))}
        </Form.Item>
      </Form>
      <div style={{display: 'flex', justifyContent:'flex-end'}}>
        <Button htmlType="button" onClick={hideModal}>
          Close
        </Button>
      </div>
    </Modal>
  );
}

export default Detail;