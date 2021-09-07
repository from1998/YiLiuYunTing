import request from '@/utils/request'
// --------------------------------------车场信息
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
// --------------------------------------车场配置
// 查询车场配置
export function getParkOperationByMid(id) {
  return request({
    url: '/ylyt/parkOperation/getParkOperationByMid/' + id,
    method: 'get'
  })
}

// 添加车场配置
export function addDepotSet(data) {
  return request({
    url: '/ylyt/parkOperation/addParkOperation',
    method: 'post',
    data
  })
}

// 修改车场配置
export function updateDepotSet(data) {
  return request({
    url: '/ylyt/parkOperation/updateParkOperation',
    method: 'put',
    data
  })
}
// --------------------------------------收费规则
// 添加收费规则
export function addParkfee(data) {
  return request({
    url: '/ylyt/parkFee/addParkfee',
    method: 'post',
    data
  })
}

// 修改收费规则
export function updateParkfee(data) {
  return request({
    url: '/ylyt/parkFee/updateParkfee',
    method: 'put',
    data
  })
}

// 查询收费规则
export function getParkfeeByMid(id) {
  return request({
    url: '/ylyt/parkFee/getParkfeeByMid/' + id,
    method: 'get'
  })
}
// -------------------------------------岗亭

// 查询岗亭设置列表
export function getWorkStationByMid(query) {
  return request({
    url: '/ylyt/workStation/getWorkStationByMid',
    method: 'get',
    params: query
  })
}

// 根据ID查询岗亭信息
export function getWorkStationById(id) {
  return request({
    url: '/ylyt/workStation/getWorkStationById/' + id,
    method: 'get'
  })
}

// 添加岗亭设置
export function addWorkStation(data) {
  return request({
    url: '/ylyt/workStation/addWorkStation',
    method: 'post',
    params: data
  })
}

// 修改岗亭设置
export function updateWorkStation(data) {
  return request({
    url: '/ylyt/workStation/updateWorkStation',
    method: 'put',
    params: data
  })
}

// 删除岗亭设置
export function deleteWorkStationById(id) {
  return request({
    url: '/ylyt/workStation/deleteWorkStationByList/' + id,
    method: 'delete'
  })
}

// 根据岗亭名称查询岗亭设置
export function getWorkStationLikeName(name) {
  return request({
    url: '/ylyt/workStation/getWorkStationLikeName/' + name,
    method: 'get'
  })
}
// -------------------------------------车道

// 查询车道列表
export function getLaneByMid(query) {
  return request({
    url: '/ylyt/lane/getLaneList/',
    method: 'get',
    params: query
  })
}
// 根据ID查询车道信息
export function getLaneById(id) {
  return request({
    url: '/ylyt/lane/getLaneById/' + id,
    method: 'get'
  })
}

// 添加车道设置
export function addLane(data) {
  return request({
    url: '/ylyt/lane/addLane',
    method: 'post',
    data
  })
}

// 修改车道设置
export function updateLane(data) {
  return request({
    url: '/ylyt/lane/updateLane',
    method: 'put',
    data
  })
}

// 删除车道
export function deleteLaneById(id) {
  return request({
    url: '/ylyt/lane/deleteLaneByList/' + id,
    method: 'delete'
  })
}
// -------------------------------------保安管理

// 查询保安列表
export function getBaoAnList(query) {
  return request({
    url: '/ylyt/baoAn/getBaoAnList',
    method: 'get',
    params: query
  })
}
// 根据ID查询保安
export function getBaoAnById(id) {
  return request({
    url: '/ylyt/baoAn/getBaoAnById/' + id,
    method: 'get'
  })
}

// 添加保安
export function addBaoAn(data) {
  return request({
    url: '/ylyt/baoAn/addBaoAn',
    method: 'post',
    data
  })
}

// 修改保安
export function updateBaoAn(data) {
  return request({
    url: '/ylyt/baoAn/updateBaoAn',
    method: 'put',
    params: data
  })
}

// 删除保安
export function deleteBaoAn(id) {
  return request({
    url: '/ylyt/baoAn/deleteBaoAnByList/' + id,
    method: 'delete'
  })
}

// 根据当前保安ID查询保安负责车道信息
export function getLaneListByMid(id) {
  return request({
    url: '/ylyt/baoAn/getLaneListByMid/' + id,
    method: 'get'
  })
}

// 车道设置或岗亭设置
export function baoAnSetting(data) {
  return request({
    url: '/ylyt/baoAn/laneOrStation',
    method: 'post',
    data
  })
}
// -------------------------------------车位管理

// 查询车位列表
export function getSiteByMid(query) {
  return request({
    url: '/ylyt/carSite/getSiteByMid',
    method: 'get',
    params: query
  })
}
// 根据ID查询车位
export function getSiteById(id) {
  return request({
    url: '/ylyt/carSite/getSiteById/' + id,
    method: 'get'
  })
}

// 添加车位
export function addCarSite(data) {
  return request({
    url: '/ylyt/carSite/addCarSite',
    method: 'post',
    params: data
  })
}

// 修改车位
export function updateSite(data) {
  return request({
    url: '/ylyt/carSite/updateSite',
    method: 'put',
    params: data
  })
}

// 删除车位
export function deleteSiteByList(id) {
  return request({
    url: '/ylyt/carSite/deleteSiteByList/' + id,
    method: 'delete'
  })
}
