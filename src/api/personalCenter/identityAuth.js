
import request from '@/utils/request'

// 提交身份认证信息
export function identityAuth(data) {
  return request({
    url: '/ylyt/personal/verify',
    method: 'post',
    data
  })
}
