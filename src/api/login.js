import request from '@/utils/request'

// 封装的axios请求函数，放入到js文件中集中管理，避免与vue文件耦合

export function login (username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function logout () {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getInfo () {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function createUser (params) {
  return request({
    url: '/user/register',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    // 如果使用params参数代表使用url传参
    // 使用data参数代表使用json传参
    data: params
  })
}
