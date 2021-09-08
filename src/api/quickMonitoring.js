import request from '@/utils/request'
// --------------------------------------车场信息
// 查询
export function getbaoAnLane() {
  return request({
    url: '/ylyt/baoAn/index',
    method: 'get'
  })
}

// 查询
export function openLane(id) {
  return request({
    url: '/ylyt/baoAn/open_lane/' + id,
    method: 'get'
  })
}
