import request from '@/utils/request'

// 获取扫码出场数据
export function getLeaveData(query) {
  return request({
    url: '/third/index_data',
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
