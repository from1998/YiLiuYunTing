import request from '@/utils/request'

// 查询一个
export function getDepotById(id) {
  return request({
    url: '/ylyt/park/getParkByMid/' + id,
    method: 'get'
  })
}