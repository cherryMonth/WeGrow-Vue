import request from '@/utils/request'

export function createBlock (params) {
  return request({
    url: '/block/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    // 如果使用params参数代表使用url传参
    // 使用data参数代表使用json传参
    data: params
  })
}

export function updateBlock (params, id) {
  return request({
    url: '/block/update/' + id,
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    // 如果使用params参数代表使用url传参
    // 使用data参数代表使用json传参
    data: params
  })
}

export function getBlock (id) {
  return request({
    url: '/user/info',
    method: 'get'
  })
}