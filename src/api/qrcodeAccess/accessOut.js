import request from '@/utils/request'

// 查询未支付页面数据
export function getNoPayData(query) {
  return request({
    url: '/third/query_not_pay_data',
    method: 'get',
    params: query
  })
}

// 查询已支付页面数据
export function getPayedData(query) {
  return request({
    url: '/third/query_has_pay_data',
    method: 'get',
    params: query
  })
}

// 创建订单
export function createOrder(query) {
  return request({
    url: '/third/create_order',
    method: 'post',
    params: query
  })
}

// 取消订单
export function cancleOrder(data) {
  return request({
    url: '/third/order_cancel',
    method: 'post',
    data
  })
}

// 订单失败
export function failedOrder(data) {
  return request({
    url: '/third/order_fail',
    method: 'post',
    data
  })
}

// 订单成功
export function successedOrder(parkId, query) {
  return request({
    url: '/third/pay_success_' + parkId,
    method: 'get',
    params: query
  })
}

// 订单成功页面数据
export function successedOrderData(query) {
  return request({
    url: '/third/pay_success_Data',
    method: 'get',
    params: query
  })
}

