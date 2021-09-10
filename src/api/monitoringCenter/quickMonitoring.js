import request from '@/utils/request'
// --------------------------------------车场信息
// 查询
export function getbaoAnLane() {
  return request({
    url: '/ylyt/baoAn/index',
    method: 'get'
  })
}

// 开闸
export function openLane(id) {
  return request({
    url: '/ylyt/baoAn/open_lane/' + id,
    method: 'get'
  })
}

// 关闸
export function closeLane(id) {
  return request({
    url: '/ylyt/baoAn/close_lane/' + id,
    method: 'get'
  })
}

// 查看详情
export function getLaneDetail(query) {
  return request({
    url: '/ylyt/baoAn/detail',
    method: 'get',
    params: query
  })
}

// 确认开闸
export function confirmOpenLane(data) {
  return request({
    url: '/ylyt/baoAn/enter_setting',
    method: 'post',
    data
  })
}
