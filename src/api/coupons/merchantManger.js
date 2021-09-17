import request from '@/utils/request'

// 分页查询
export function listCouponsMerchantForPage(query) {
  return request({
    url: '/ylyt/merchant/getListMerchant',
    method: 'get',
    params: query
  })
}
// 查询一个
export function getCouponsById(id) {
  return request({
    url: '/ylyt/merchant/selectCoupons/' + id,
    method: 'get'
  })
}
// 添加
export function addMerchant(data) {
  return request({
    url: '/ylyt/merchant/addMerchant',
    method: 'post',
    params: data
  })
}
// 修改
export function updateCoupons(data) {
  return request({
    url: '/ylyt/merchant/updateCoupons',
    method: 'put',
    params: data
  })
}
// 多个删除
export function deleteMerchantId(id) {
  return request({
    url: '/ylyt/merchant/deleteMerchantByList/' + id,
    method: 'DELETE'
  })
}
// 查询一个
export function getMerchantById(id) {
  return request({
    url: '/ylyt/merchant/selectMerchant/' + id,
    method: 'get'
  })
}
// 修改
export function updateMerchant(data) {
  return request({
    url: '/ylyt/merchant/updateMerchant',
    method: 'put',
    params: data
  })
}
