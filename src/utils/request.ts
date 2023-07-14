import axios from 'axios'
import { message } from 'antd'
import { getStoreData } from './storage'

// axios
let axiosConfig = {
  timeout: 50000 // request timeout
}

const request = axios.create(axiosConfig)

// Add a request interceptor
request.interceptors.request.use(
  function (config) {
    let token = getStoreData('token')
    if (typeof token === 'string') {
      config.headers['Authorization'] = token
    }
    // config.headers["Authorization"] = 'WEB_66b8fbf0bf0d11e99da725679125a355_0028ddb1b01310b97935f55f8a3d0c80_1578057391186_ab8fc5956322107ab73cadfabf93b0410e1b7ea1';
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)

//拦截response
request.interceptors.response.use(
  // 请求成功
  (res) => {
    if (res.data.errno !== '0') {
      message.error(res.data.message)
    }
    return res
  },
  // 请求失败
  (error) => {
    const { response } = error
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.msg)
      return Promise.reject(response)
    } else {
      return Promise.reject(error)
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false);
    }
  }
)

const errorHandle = (status: number, msg: string) => {
  // 状态码判断
  switch (status) {
    case 401:
      message.error(msg || `请先登录`)
      break
    case 403:
      message.error(`登录过期，请重新登录`)
      break
    case 404:
      message.error(`请求的资源不存在`)
      break
    case 500:
      message.error(`服务器内部错误`)
      break
    case 700:
      message.error(msg || '未知错误,请刷新重试')
      break
    default:
      message.error(`未知错误`)
  }
}

export default request
