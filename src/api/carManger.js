import request from '@/utils/request'
// --------------------------------------车辆管理

// 查询车道列表
export function getLaneList(query) {
  return request({
    url: '/ylyt/lane/getLaneByParkId',
    method: 'get',
    params: query
  })
}

// 查询车位列表
export function getPortList(query) {
  return request({
    url: '/ylyt/car_register/list',
    method: 'get',
    params: query
  })
}

// 查询固定车可添加类型
export function getPortType() {
  return request({
    url: '/ylyt/car_register/register_type',
    method: 'get'
  })
}

// 根据id查询车位信息
export function getPortById(query) {
  return request({
    url: '/ylyt/car_register/car_register_by_id',
    method: 'get',
    params: query
  })
}

// 添加车位
export function addPort(data) {
  return request({
    url: '/ylyt/car_register/add_register',
    method: 'post',
    data
  })
}

// 修改车位
export function updatePort(data) {
  return request({
    url: '/ylyt/car_register/update_register',
    method: 'put',
    data
  })
}

// 删除车位
export function deletePort(id) {
  return request({
    url: '/ylyt/car_register/del_register/' + id,
    method: 'delete'
  })
}

// 续费
export function doRenew(data) {
  return request({
    url: '/ylyt/car_register/register_record/renew',
    method: 'post',
    data
  })
}

// 批量续费
export function doManyRenew(data) {
  return request({
    url: '/ylyt/car_register/register_record/renewList',
    method: 'post',
    data
  })
}

// 根据车位id分页查询车位续费历史信息
export function getPortRenewHistory(query) {
  return request({
    url: '/ylyt/car_register/register_record/list',
    method: 'get',
    params: query
  })
}

// 模板下载
export function downloadRegisterCar() {
  return request({
    url: '/ylyt/car_register/export',
    method: 'get',
    responseType: 'blob'
  })
}

// 批量导出固定车信息
export function exportRegisterCar(query) {
  return request({
    url: '/ylyt/car_register/exportCarRegister',
    method: 'get',
    params: query,
    responseType: 'blob'
  })
}

// 批量上传固定车信息
export function uploadRegisterCar(data) {
  return request({
    url: '/ylyt/car_register/upload',
    method: 'post',
    data
  })
}

// 根据id删除续费历史
export function delRenewHistory(id) {
  return request({
    url: '/ylyt/car_register/delete/' + id,
    method: 'delete'
  })
}

// 根据id修改续费历史
export function editRenewHistory(data) {
  return request({
    url: '/ylyt/car_register/register_record/edit',
    method: 'put',
    data
  })
}
