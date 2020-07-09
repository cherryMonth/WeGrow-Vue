import request from '@/utils/request'

export function getTopicList (params) {
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
