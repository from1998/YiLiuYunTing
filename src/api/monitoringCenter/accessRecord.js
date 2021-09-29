import request from '@/utils/request'
// --------------------------------------进出记录
// 查询
export function getRecordList(query) {
  return request({
    url: '/park/record/list',
    method: 'get',
    params: query
  })
}

export function getOrderList(query) {
  return request({
    url: '/ylyt/park/getOrdersList',
    method: 'get',
    params: query
  })
}

// 清理离场车辆信息
export function cleanLeaveRecord() {
  return request({
    url: '/park/record/clean_leave_record',
    method: 'delete'
  })
}

// 清理在场车辆信息
export function cleanEnterRecord(days) {
  return request({
    url: '/park/record/clean_record/' + days,
    method: 'delete'
  })
}
// 查询车流报表
export function getCarOrder(data) {
  return request({
    url: '/ylyt/park/getCarOrder',
    method: 'get',
    params: data
  })
}
// 查询收费报表
export function getOrders(data) {
  return request({
    url: '/ylyt/park/getOrders',
    method: 'get',
    params: data
  })
}
