import request from '@/utils/request'

export function getMapData(code) {
  return request({
    url: '/ylyt/park/provinceParkNum?parentid=' + code,
    method: 'get'
  })
}
