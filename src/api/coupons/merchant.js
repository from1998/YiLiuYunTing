import request from '@/utils/request'

// 分页查询
export function listMerchantForPage(query) {
  return request({
    url: '/ylyt/merchant/getListMerchantCoupons',
    method: 'get',
    params: query
  })
}
// 添加
export function addMerchant(data) {
  return request({
    url: '/ylyt/merchant/addMerchantCoupons',
    method: 'post',
    params: data
  })
}
// 修改
export function updateMerchantCoupons(data) {
  return request({
    url: '/ylyt/merchant/updateMerchantCoupons',
    method: 'put',
    params: data
  })
}
// 多个删除
export function deleteMerchantCoupons(id) {
  return request({
    url: '/ylyt/merchant/deleteMerchantCoupons/' + id,
    method: 'DELETE'
  })
}
// 查询一个
export function getMerchantCouponsById(id) {
  return request({
    url: '/ylyt/merchant/selectMerchantCoupons/' + id,
    method: 'get'
  })
}
// 发放优惠券
export function getMerchantCoupons(query) {
  return request({
    url: '/ylyt/merchant/getMerchantCoupons',
    method: 'get',
    params: query
  })
}
// 根据车场ID查询商家
export function selectMerchantByParkId(id) {
  return request({
    url: '/ylyt/merchant/selectMerchantByParkId/' + id,
    method: 'get'
  })
}
// 根据车场ID查询优惠券
export function selectCouponsByParkId(id) {
  return request({
    url: '/ylyt/merchant/selectCouponsByParkId/' + id,
    method: 'get'
  })
}
