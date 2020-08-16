import request from '@/utils/request'

export function getCommentList (params) {
  const urlParams = new URLSearchParams({
    targetType: params.targetType,
    targetId: params.targetId,
    pageNum: params.pageNum,
    pageSize: params.pageSize
  }).toString()
  return request({
    url: '/comment/getCommentList?' + urlParams,
    method: 'get'
  })
}

export function createComment (params) {
  return request({
    url: '/comment/createComment',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    // 如果使用params参数代表使用url传参
    // 使用data参数代表使用json传参
    data: params
  })
}

export function createReplyComment (params) {
  return request({
    url: '/comment/createReplyComment',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    // 如果使用params参数代表使用url传参
    // 使用data参数代表使用json传参
    data: params
  })
}
