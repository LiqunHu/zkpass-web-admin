import { Button, Form, Input, Modal, Radio, Select, Space, message } from 'antd'
import { getCodeList } from 'country-list'
import { useEffect } from 'react'
import request from '@/utils/request'
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

function Detail({open, handleOpen, flag, initialValue, refresh}:any) {
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    try {
      if (initialValue?.sbt_task_id) {
        const params = { ...values, sbt_task_id: initialValue.sbt_task_id }
        const res = await request.post('/v1/api/zkpass/adminTask/modifyTask', params)
        if(res.data.errno === '0'){
          message.success('update success')
          handleOpen(false);
          refresh()
        }
      } else {
        const res = await request.post('/v1/api/zkpass/adminTask/addTask', values)
        if(res.data.errno === '0'){
          message.success('add success')
          handleOpen(false);
          refresh()
        }
      }
    }catch (e){
      console.error(e)
    }
  };

  useEffect(() => {
    form.setFieldsValue(initialValue)
  }, [initialValue])

  const hideModal = () => {
    handleOpen(false);
  };
  return (
    <Modal
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
        <Form.Item name="sbt_task_country_code" label="Country" rules={[{ required: true }]}>
          <Select options={countryOptions} />
        </Form.Item>
        <Form.Item name="sbt_task_category" label="Category" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="bank">bank</Select.Option>
            <Select.Option value="game">game</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="sbt_task_domain" label="Domain" rules={[{ required: true }]}>
          <Input/>
        </Form.Item>
        <Form.Item name="sbt_task_requirements" label="Info" rules={[{ required: true }]}>
          <TextArea rows={2} maxLength={200} />
        </Form.Item>
        <Form.Item name="sbt_task_reward" label="Reward" rules={[{ required: true }]}>
          <TextArea rows={2} maxLength={200} />
        </Form.Item>
        {flag === 'Add' && <Form.Item name="sbt_task_status" label="status" rules={[{ required: true }]}>
          <Radio.Group >
            <Radio value="1">Publish</Radio>
            <Radio value="2">Off shelf</Radio>
          </Radio.Group>
        </Form.Item>}
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