import request from '@/utils/request'

export function updatePassword (params) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data: params
  })
}

export function updateInfo (params) {
  return request({
    url: '/user/updateInfo',
    method: 'post',
    data: params
  })
}
