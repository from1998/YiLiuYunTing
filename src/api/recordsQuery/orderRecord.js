import request from '@/utils/request'

export function getOrderList(query) {
  return request({
    url: '/order/list',
    method: 'get',
    params: query
  })
}

// 获取订单列表所有数据字典！
export function getOrderDict() {
  return request({
    url: '/order/order_dic',
    method: 'get'
  })
}
