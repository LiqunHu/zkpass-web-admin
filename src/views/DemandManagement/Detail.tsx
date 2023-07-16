import { Button, Form, Input, Modal, Radio, Select, Space } from 'antd'
import { getCodeList } from 'country-list'
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

function Detail({open, handleOpen, flag, initialValue}:any) {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log(values);
    handleOpen(false);
  };

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
      title={flag}
      open={open}
    >
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
        initialValues={initialValue}
      >
        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
          <Select options={countryOptions} />
        </Form.Item>
        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="bank">bank</Select.Option>
            <Select.Option value="game">game</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="domain" label="Domain" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item name="info" label="Info" rules={[{ required: true }]}>
          <TextArea rows={2} maxLength={200} />
        </Form.Item>
        <Form.Item name="reward" label="Reward" rules={[{ required: true }]}>
          <TextArea rows={2} maxLength={200} />
        </Form.Item>
        <Form.Item name="status" label="status" rules={[{ required: true }]}>
          <Radio.Group >
            <Radio value={1}>Publish</Radio>
            <Radio value={2}>Off shelf</Radio>
          </Radio.Group>
        </Form.Item>
        <div style={{display: 'flex', justifyContent:'flex-end', alignItems:'center'}}>
          <Space size="small">
            <Button htmlType="button" onClick={hideModal}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
}

export default Detail;