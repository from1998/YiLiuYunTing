import request from '@/utils/request'

// 查询异常记录分页
export function getErrorCarList(query) {
  return request({
    url: '/ylyt/errCar/getErrorCarList',
    method: 'get',
    params: query
  })
}

// 查询异常进场记录详情
export function getErrorCarByCarNumber(query) {
  return request({
    url: '/ylyt/errCar/getErrorCarByCarNumber',
    method: 'get',
    params: query
  })
}

// 查询异常出场记录详情
export function getErrorLeavedCarByCarNumber(query) {
  return request({
    url: '/ylyt/errCar/getErrorLeavedCarByCarNumber',
    method: 'get',
    params: query
  })
}
