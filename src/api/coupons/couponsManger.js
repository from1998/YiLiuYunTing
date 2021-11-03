import request from '@/utils/request'

// 分页查询
export function listCouponsForPage(query) {
  return request({
    url: '/ylyt/merchant/getListCoupons',
    method: 'get',
    params: query
  })
}
// 查询一个
export function getCouponsById(data) {
  return request({
    url: '/ylyt/merchant/selectCoupons',
    method: 'get',
    params: data
  })
}
// 添加
export function addCoupons(data) {
  return request({
    url: '/ylyt/merchant/addCoupons',
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
// 修改
export function openCoupons(data) {
  return request({
    url: '/ylyt/merchant/updateIsActiveCoupons',
    method: 'put',
    params: data
  })
}
// 删除
export function deleteCouponsByIds(id) {
  return request({
    url: '/ylyt/merchant/delCoupons/' + id,
    method: 'get'
  })
}
// 多个删除
export function deleteCouponsId(id) {
  return request({
    url: '/ylyt/merchant/deleteCouponsByList/' + id,
    method: 'DELETE'
  })
}
// 查询车场
export function listAll() {
  return request({
    url: '/ylyt/park/listAll',
    method: 'get'
  })
}
