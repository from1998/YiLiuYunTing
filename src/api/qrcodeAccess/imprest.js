import request from '@/utils/request'

// 根据id删除车牌号历史
export function delCarNumberHistory(id) {
  return request({
    url: '/third/history_delete_' + id,
    method: 'delete'
  })
}

// 优惠券扫码跳转页面数据接口
export function getCouponsDdata(query) {
  return request({
    url: '/third/coupons_code_data',
    method: 'get',
    params: query
  })
}

// 领取优惠券
export function getCoupons(parkId, mcId, query) {
  return request({
    url: '/third/get_coupons_' + parkId + '_' + mcId,
    method: 'get',
    params: query
  })
}

