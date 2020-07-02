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
