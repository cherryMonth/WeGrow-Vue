// 文件转base64

import { Message } from 'element-ui'

export function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    let fileResult = ''
    reader.readAsDataURL(file)
    // 开始转
    reader.onload = function () {
      fileResult = reader.result
    }
    // 转 失败
    reader.onerror = function (error) {
      reject(error)
    }
    // 转 结束  咱就 resolve 出去
    reader.onloadend = function () {
      resolve(fileResult)
    }
  })
}

export function beforeAvatarUpload (file) {
  const isLegitimate = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLegitimate) {
    Message({
      message: '上传头像图片只能是 JPG/PNG/GIF 格式!',
      type: 'error',
      duration: 3 * 1000
    })
  }
  if (!isLt2M) {
    Message({
      message: '上传头像图片大小不能超过 2MB!',
      type: 'error',
      duration: 3 * 1000
    })
  }
  return isLegitimate && isLt2M
}
