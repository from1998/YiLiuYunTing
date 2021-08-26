import request from '@/utils/request'

// 查询车场信息
export function getDepotById(id) {
  return request({
    url: '/ylyt/park/getParkByMid/' + id,
    method: 'get'
  })
}

// 添加车场信息
export function addDepotInfo(data) {
  return request({
    url: '/ylyt/park/addPark',
    method: 'post',
    params: data
  })
}

// 修改车场信息
export function updateDepotInfo(data) {
  return request({
    url: '/ylyt/park/updatePark',
    method: 'put',
    params: data
  })
}

// 查询车场配置
export function getParkOperationByMid(id) {
  return request({
    url: '/ylyt/park/getParkOperationByMid/' + id,
    method: 'get'
  })
}

// 添加车场配置
export function addDepotSet(data) {
  return request({
    url: '/ylyt/park/addParkOperation',
    method: 'post',
    params: data
  })
}

// 修改车场配置
export function updateDepotSet(data) {
  return request({
    url: '/ylyt/park/updateParkOperation',
    method: 'put',
    params: data
  })
}

// 添加收费规则
export function addParkfee(data) {
  return request({
    url: '/ylyt/parkFee/addParkfee',
    method: 'post',
    params: data
  })
}

// 修改收费规则
export function updateParkfee(data) {
  return request({
    url: '/ylyt/parkFee/updateParkfee',
    method: 'put',
    params: data
  })
}

