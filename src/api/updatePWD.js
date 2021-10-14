import request from '@/utils/request'

export function updatePWD(data) {
  return request({
    url: '/system/user/updatePassword',
    method: 'put',
    data
  })
}
