import request from '@/utils/request'

export function getNumber() {
  return request({
    url: '/ylyt/park/big',
    method: 'get'
  })
}
