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
export function createOrder(data) {
  return request({
    url: '/third/create_order',
    method: 'post',
    data
  })
}

