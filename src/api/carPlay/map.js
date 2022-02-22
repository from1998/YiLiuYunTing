import request from '@/utils/request'

export function getMapData() {
  return request({
    url: '/ylyt/park/bigCarNumberByCity',
    method: 'get'
  })
}
