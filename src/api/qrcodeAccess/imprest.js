import request from '@/utils/request'

// 根据id删除车牌号历史
export function delCarNumberHistory(id) {
  return request({
    url: '/third/history_delete_' + id,
    method: 'delete'
  })
}

// 根据id删除车牌号历史
export function getCouponsDdata(query) {
  return request({
    url: '/third/history_delete_',
    method: 'get',
    params: query
  })
}

