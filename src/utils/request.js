import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store/'
import { getToken } from '@/utils/auth'
import router from '../router'

// 创建axios实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8082', // api的base_url
  timeout: 15000 // 请求超时时间
})

service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers.Authorization = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
                * code为非200是抛错 可结合自己业务进行修改
                */
    const res = response.data
    // 如果状态码是200 那么直接返回
    if (res.code === 200) return Promise.resolve(response)

    // 401:未登录则清除所有用户信息，然后重新登陆，其他页面需要打印消息警告;
    if (res.code >= 400 && res.code < 500) {
      Message({
        message: res.message,
        type: 'warning',
        duration: 3 * 1000
      })
      if (res.code === 401) {
        return new Promise((resolve, reject) => {
          store.dispatch('LogOut').then(() => {
            router.push('/login')
          }).catch(error => {
            reject(error)
          })
        })
      }
      return Promise.resolve(response)
    // 如果遇到五百则打印错误警告
    } else if (res.code >= 500) {
      Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      })
      return Promise.reject(response)
    } else {
      return response.data
    }
  }
  ,
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
