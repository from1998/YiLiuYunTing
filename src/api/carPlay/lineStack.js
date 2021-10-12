import request from '@/utils/request'

export function getLineData() {
  return request({
    url: '/ylyt/park/bigSeven',
    method: 'get'
  })
}
